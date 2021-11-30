import * as Clients from '../pg/client.js'
import * as Events from '../pg/event.js'
import pg from '../pg/index.js'
import * as Sessions from '../pg/session.js'

export async function handleSetClient(reply, { client_id, application_id, account_id }, fields) {
  return pg.transaction(async (trx) => {
    let client = await Clients.findOne({ account_id, application_id, client_id }, trx)

    if (!client) {
      return reply.notFound(`Client not found`)
    }

    await Clients.update(
      {
        ...client,
        additional_properties: fields.additional_properties ?? {},
        distinct_id: fields.distinct_id,
        is_opt_out: fields.is_opt_out,
        push_token: fields.push_token,
        referer: fields.referer,
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
        created_at: fields.timestamp,
        properties: {
          additional_properties: fields.additional_properties ?? {},
          distinct_id: fields.distinct_id,
          is_opt_out: fields.is_opt_out,
          push_token: fields.push_token,
          referer: fields.referer,
        },
        session_started_at: session.started_at,
        title: 'set_client',
      },
      trx,
    )

    return {}
  })
}
