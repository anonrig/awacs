import { handleAppOpen } from '../../handlers/app_open.js'
import { handleCustom } from '../../handlers/custom.js'
import { handleInAppPurchase } from '../../handlers/in_app_purchase.js'
import { handleSetClient } from '../../handlers/set_client.js'
import Logger from '../../logger.js'

const logger = Logger.create({}).withScope('events').withTag('create')

export default {
  config: { rawBody: true },
  handler: async (
    { account_id, client_id, country_id, application: { application_id }, body: events },
    reply,
  ) => {
    const primaryKeys = { account_id, application_id, client_id, country_id }

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
        case 'custom':
          await handleCustom(reply, primaryKeys, event)
          break
        default:
          logger.warn(`Received unknown event: ${event.name}`, event)
      }
    }
    return {}
  },
  method: 'POST',
  schema: {
    body: {
      items: {
        oneOf: [
          { $ref: 'app_open_event#' },
          { $ref: 'in_app_purchase_event#' },
          { $ref: 'set_client_event#' },
          { $ref: 'custom_event#' },
        ],
        type: 'object',
      },
      minItems: 1,
      type: 'array',
    },
    description: 'Send an event',
    headers: { $ref: 'authorization_header#' },
    operationId: 'sendEvent',
    response: {
      200: { $ref: 'empty_response#', description: 'Empty Response' },
      400: { $ref: 'generic_error#', description: 'Bad Request' },
      401: { $ref: 'generic_error#', description: 'Unauthorized' },
      404: { $ref: 'generic_error#', description: 'Not Found' },
      417: { $ref: 'generic_error#', description: 'Expectation Failed' },
      500: { $ref: 'generic_error#', description: 'Internal Server Error' },
    },
    security: [{ ClientId: [], SocketkitKey: [] }],
  },
  url: '/',
}
