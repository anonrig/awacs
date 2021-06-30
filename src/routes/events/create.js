import { handleAppOpen } from '../../handlers/app_open.js'
import { handleInAppPurchase } from '../../handlers/in_app_purchase.js'
import { handleSetClient } from '../../handlers/set_client.js'
import { handleCustom } from '../../handlers/custom.js'

export default {
  method: 'POST',
  url: '/',
  config: {
    rawBody: true,
  },
  schema: {
    description: 'Send an event',
    tags: ['event_endpoints'],
    headers: { $ref: 'authorization_header#' },
    body: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        oneOf: [
          { $ref: 'app_open_event#' },
          { $ref: 'in_app_purchase_event#' },
          { $ref: 'set_client_event#' },
          { $ref: 'custom_event#' },
        ],
      },
    },
    response: {
      200: {
        description: 'Event processing response',
        type: 'object',
      },
      400: { $ref: 'generic_error#' },
      401: { $ref: 'generic_error#' },
      404: { $ref: 'generic_error#' },
      417: { $ref: 'generic_error#' },
    },
  },
  handler: async (
    {
      account_id,
      client_id,
      country_id,
      application: { application_id },
      body: events,
    },
    reply,
  ) => {
    const primaryKeys = { client_id, country_id, application_id, account_id }

    for (let event of events) {
      switch (event.name) {
        case 'app_open':
          await handleAppOpen(reply, primaryKeys, event)
          break
        case 'in_app_purchase':
          await handleInAppPurchase(reply, primaryKeys, event)
          break
        case 'set_client':
          await handleSetClient(reply, primaryKeys, event)
          break
        default:
          await handleCustom(reply, primaryKeys, event)
          break
      }
    }
    return {}
  },
}
