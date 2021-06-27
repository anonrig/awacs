import * as Clients from '../pg/client.js'
import * as Events from '../pg/event.js'
import * as Sessions from '../pg/session.js'
import pg from '../pg/index.js'

export async function handleSetClient(
  reply,
  { client_id, application_id, account_id },
  fields,
) {
  return pg.transaction(async (trx) => {
    let client = await Clients.findOne(
      { account_id, application_id, client_id },
      trx,
    )

    if (!client) {
      return reply.notFound(`Client not found`)
    }

    await Clients.update(
      {
        ...client,
        distinct_id: fields.distinct_id,
        referer: fields.referer,
        push_token: fields.push_token,
        is_opt_out: fields.is_opt_out,
        additional_properties: fields.additional_properties ?? {},
        updated_at: new Date(),
      },
      trx,
    )

    const session = await Sessions.findOrCreate(
      {
        account_id,
        application_id,
        client_id,
        timestamp: fields.timestamp,
      },
      trx,
    )

    await Events.create(
      {
        account_id,
        application_id,
        client_id,
        title: 'set_client',
        properties: {
          distinct_id: fields.distinct_id,
          referer: fields.referer,
          push_token: fields.push_token,
          is_opt_out: fields.is_opt_out,
          additional_properties: fields.additional_properties ?? {},
        },
        created_at: fields.timestamp,
        session_started_at: session.started_at,
      },
      trx,
    )

    return {}
  })
}
