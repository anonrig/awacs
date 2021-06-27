import * as Clients from '../pg/client.js'
import * as Events from '../pg/event.js'
import * as Sessions from '../pg/session.js'
import pg from '../pg/index.js'

export async function handleCustom(
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

    const session = await Sessions.findOrCreate(
      {
        account_id,
        application_id,
        client_id,
        timestamp: fields.timestamp,
      },
      trx,
    )

    const { name, timestamp, ...properties } = fields

    await Events.create(
      {
        account_id,
        application_id,
        client_id,
        title: fields.name,
        properties: properties,
        created_at: fields.timestamp,
        session_started_at: session.started_at,
      },
      trx,
    )

    return {}
  })
}
