import { randomUUID } from 'crypto'

import test from 'ava'
import quibble from 'quibble'

import * as Signing from '../src/signing.js'

import { mockApplicationGetByAuthorization, mockCustomEventHandler } from './mocks.js'

test.serial('should throw forbidden on wrong x-socketkit-key', async (t) => {
  await mockApplicationGetByAuthorization(null)
  const { build } = await import('../src/server.js')
  const server = await build()
  t.teardown(() => quibble.reset())

  const { statusCode, body } = await server.inject({
    headers: {
      'x-client-id': randomUUID(),
      'x-signature': Buffer.from('hello').toString('base64'),
      'x-socketkit-key': Buffer.from('my-super-secret-socketkit-key').toString('base64'),
    },
    method: 'POST',
    payload: [{ name: 'custom', timestamp: new Date().toISOString() }],
    url: '/v1/events',
  })
  const response = JSON.parse(body)
  t.true(response.message.includes('Invalid authorization key'), response.message)
  t.is(response.error, 'Forbidden')
  t.is(statusCode, 403)
})

test.serial('should throw precondition failed on wrong x-signature', async (t) => {
  const defaults = {
    account_id: randomUUID(),
    application_id: randomUUID(),
    ...(await Signing.generateSigningKeys()),
  }
  await mockApplicationGetByAuthorization(defaults)
  await mockCustomEventHandler(null)
  const { build } = await import('../src/server.js')
  const server = await build()
  t.teardown(() => quibble.reset())

  const { statusCode, body } = await server.inject({
    headers: {
      'x-client-id': randomUUID(),
      'x-signature':
        'QqlYhRftVv2RIjYyki4agRZ/lzoFF9IGhytjEFl736ZKiO3Oijw/eDFp0gKN9f9fflSz3gnz0vyq60QtM0gJBQ==',
      'x-socketkit-key': Buffer.from('secret-key').toString('base64'),
    },
    method: 'POST',
    payload: [{ name: 'custom', timestamp: new Date().toISOString() }],
    url: '/v1/events',
  })
  const response = JSON.parse(body)
  t.true(response.message.includes('Application signature does not match'), response.message)
  t.is(statusCode, 417)
  t.is(response.error, 'Expectation Failed')
})
