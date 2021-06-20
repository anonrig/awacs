import * as Events from '../../event-types.js'
import { handleAppOpen } from '../../handlers/app_open.js'
import { handleInAppPurchase } from '../../handlers/in_app_purchase.js'
import { handleSetClient } from '../../handlers/set_client.js'
import { handleCustom } from '../../handlers/custom.js'

import {
  Authorization,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ExpectationFailedError,
} from '../../schemas.js'

export default {
  method: 'POST',
  url: '/',
  config: {
    rawBody: true,
  },
  schema: {
    description: 'Send an event',
    tags: ['event_endpoints'],
    headers: Authorization,
    body: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the event',
            example: 'in_app_purchase',
          },
          timestamp: {
            type: 'integer',
            description: 'Timestamp of the event',
            example: Date.now(),
          },
        },
        additionalProperties: true,
        minProperties: 2,
        required: ['name', 'timestamp'],
        allOf: [
          {
            allOf: [
              {
                if: { properties: { name: { enum: ['app_open'] } } },
                then: Events.app_open,
              },
            ],
          },
          {
            allOf: [
              {
                if: { properties: { name: { enum: ['in_app_purchase'] } } },
                then: Events.in_app_purchase,
              },
            ],
          },
          {
            allOf: [
              {
                if: { properties: { name: { enum: ['set_client'] } } },
                then: Events.set_client,
              },
            ],
          },
        ],
      },
    },
    response: {
      200: {
        description: 'Event processing response',
        type: 'object',
        properties: {},
        required: [],
      },
      400: BadRequestError,
      401: UnauthorizedError,
      404: NotFoundError,
      417: ExpectationFailedError,
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
