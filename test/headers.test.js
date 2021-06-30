import test from 'ava'
import { v4 } from 'uuid'
import quibble from 'quibble'
import * as Signing from '../src/signing.js'
import {
  mockApplicationGetByAuthorization,
  mockCustomEventHandler,
} from './mocks.js'

test('should validate x-socketkit-key', async (t) => {
  const { build } = await import('../src/server.js')
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [{ name: 'custom', timestamp: Date.now() }],
  })
  const response = JSON.parse(body)
  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(
      `headers should have required property 'x-socketkit-key`,
    ),
    response.message,
  )
})

test('should validate x-client-id', async (t) => {
  const { build } = await import('../src/server.js')
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [{ name: 'custom', timestamp: Date.now() }],
    headers: {
      'x-socketkit-key': v4(),
    },
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(
      `headers should have required property 'x-client-id'`,
    ),
    response.message,
  )
})

test.serial('should throw forbidden on wrong x-socketkit-key', async (t) => {
  await mockApplicationGetByAuthorization(null)
  const { build } = await import('../src/server.js')
  const server = await build()
  t.teardown(() => quibble.reset())

  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [{ name: 'custom', timestamp: Date.now() }],
    headers: {
      'x-socketkit-key': v4(),
      'x-client-id': v4(),
      'x-signature': 'hello',
    },
  })
  const response = JSON.parse(body)
  t.is(statusCode, 403)
  t.is(response.error, 'Forbidden')
  t.truthy(
    response.message.includes('Invalid authorization key'),
    response.message,
  )
})

test.serial(
  'should throw precondition failed on wrong x-signature',
  async (t) => {
    const defaults = {
      account_id: v4(),
      application_id: v4(),
      ...(await Signing.generateSigningKeys()),
    }
    await mockApplicationGetByAuthorization(defaults)
    await mockCustomEventHandler(null)
    const { build } = await import('../src/server.js')
    const server = await build()
    t.teardown(() => quibble.reset())

    const { statusCode, body } = await server.inject({
      method: 'POST',
      url: '/v1/events',
      payload: [{ name: 'custom', timestamp: Date.now() }],
      headers: {
        'x-socketkit-key': v4(),
        'x-client-id': v4(),
        'x-signature':
          'QqlYhRftVv2RIjYyki4agRZ/lzoFF9IGhytjEFl736ZKiO3Oijw/eDFp0gKN9f9fflSz3gnz0vyq60QtM0gJBQ==',
      },
    })
    const response = JSON.parse(body)

    t.is(statusCode, 417)
    t.is(response.error, 'Expectation Failed')
    t.truthy(
      response.message.includes('Application signature does not match'),
      response.message,
    )
  },
)
