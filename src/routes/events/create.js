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
    operationId: 'sendEvent',
    description: 'Send an event',
    headers: { $ref: 'authorization_header#' },
    security: [{ SocketkitKey: [], ClientId: [] }],
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
        description: 'Valid response',
        type: 'object',
      },
      400: { $ref: 'generic_error#', description: 'Bad Request' },
      401: { $ref: 'generic_error#', description: 'Unauthorized' },
      404: { $ref: 'generic_error#', description: 'Not Found' },
      417: { $ref: 'generic_error#', description: 'Expectation Failed' },
      500: { $ref: 'generic_error#', description: 'Internal Server Error' },
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
