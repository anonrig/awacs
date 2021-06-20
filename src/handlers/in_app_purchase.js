import * as Clients from '../pg/client.js'
import * as Events from '../pg/event.js'
import * as Sessions from '../pg/session.js'
import pg from '../pg/index.js'

export async function handleInAppPurchase(
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

    await Events.create(
      {
        account_id,
        application_id,
        client_id,
        title: 'in_app_purchase',
        properties: {
          product_name: fields.product_name,
          product_quantity: fields.product_quantity,
          product_price: fields.product_price,
          product_currency: fields.product_currency,
        },
        created_at: fields.timestamp,
        session_started_at: session.started_at,
      },
      trx,
    )

    return {}
  })
}
