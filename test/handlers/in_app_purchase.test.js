import test from 'ava'
import quibble from 'quibble'
import { v4 } from 'uuid'
import {
  mockApplicationGetByAuthorization,
  mockSessionFindOrCreate,
  mockSigning,
  mockEventCreate,
  mockClientFindOne,
  mockPgTransaction,
} from '../mocks.js'

const defaults = {
  account_id: v4(),
  application_id: v4(),
  client_id: v4(),
  country_id: 'tr',
}

test.serial('should create event', async (t) => {
  const payload = {
    name: 'in_app_purchase',
    timestamp: Date.now(),
    product_name: 'Weekly Package',
    product_quantity: 1,
    product_price: 4.99,
    product_currency: 'USD',
  }
  const session = { started_at: payload.timestamp }
  const { name, timestamp, ...properties } = payload

  await mockApplicationGetByAuthorization(defaults)
  await mockSigning(true)
  await mockPgTransaction()
  await mockClientFindOne(
    { client_id: defaults.client_id },
    {
      client_id: defaults.client_id,
      application_id: defaults.application_id,
      account_id: defaults.account_id,
    },
    t,
  )
  await mockSessionFindOrCreate(
    session,
    {
      account_id: defaults.account_id,
      application_id: defaults.application_id,
      client_id: defaults.client_id,
      timestamp: payload.timestamp,
    },
    t,
  )
  await mockEventCreate(
    {},
    {
      account_id: defaults.account_id,
      application_id: defaults.application_id,
      client_id: defaults.client_id,
      title: payload.name,
      properties,
      created_at: payload.timestamp,
      session_started_at: session.started_at,
    },
    t,
  )
  t.teardown(() => quibble.reset())
  const { build } = await import('../../src/server.js')
  const server = await build()
  const { statusCode } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [payload],
    headers: {
      'x-socketkit-key': v4(),
      'x-client-id': defaults.client_id,
      'x-signature': 'aGVsbG8gd29ybGQ=',
    },
  })
  t.is(statusCode, 200)
})
