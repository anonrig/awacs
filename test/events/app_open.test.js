import test from 'ava'
import { build } from '../../src/server.js'

test('should check for locale', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [{ name: 'app_open', timestamp: Date.now() }],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(`should have required property 'locale'`),
    response.message,
  )
})

test('should validate for locale', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [{ name: 'app_open', timestamp: Date.now(), locale: 'HELLO' }],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(`should match format "locale_code"`),
    response.message,
  )
})

test('should check for platform', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [
      {
        name: 'app_open',
        timestamp: Date.now(),
        locale: 'en-US',
        manufacturer: 'Apple',
      },
    ],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(`should have required property 'platform'`),
    response.message,
  )
})

test('should check for manufacturer', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [
      {
        name: 'app_open',
        timestamp: Date.now(),
        platform: 'ios',
        locale: 'en-US',
      },
    ],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(`should have required property 'manufacturer'`),
    response.message,
  )
})

test('should check for type', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [
      {
        name: 'app_open',
        timestamp: Date.now(),
        platform: 'ios',
        manufacturer: 'Apple',
        locale: 'en-US',
      },
    ],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(`should have required property 'type'`),
    response.message,
  )
})

test('should check for os_name', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [
      {
        name: 'app_open',
        timestamp: Date.now(),
        platform: 'ios',
        manufacturer: 'Apple',
        type: 'iPad13,1',
        carrier: 'T-Mobile',
        locale: 'en-US',
      },
    ],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(response.message.includes(`should have required property 'os_name'`))
})

test('should check for screen_size', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [
      {
        name: 'app_open',
        timestamp: Date.now(),
        platform: 'ios',
        manufacturer: 'Apple',
        type: 'iPad13,1',
        carrier: 'T-Mobile',
        os_name: 'iOS',
        os_version: '14.4.1',
        locale: 'en-US',
      },
    ],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(`should have required property 'screen_size'`),
    response.message,
  )
})

test('should check for os_version', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [
      {
        name: 'app_open',
        timestamp: Date.now(),
        platform: 'ios',
        manufacturer: 'Apple',
        type: 'iPad13,1',
        carrier: 'T-Mobile',
        os_name: 'iOS',
        locale: 'en-US',
      },
    ],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(`should have required property 'os_version'`),
    response.message,
  )
})

test('should check for application_build_number', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [
      {
        name: 'app_open',
        timestamp: Date.now(),
        platform: 'ios',
        manufacturer: 'Apple',
        type: 'iPad13,1',
        carrier: 'T-Mobile',
        os_version: '1.0.0',
        os_name: 'iOS',
        screen_size: [1080, 640],
        locale: 'en-US',
      },
    ],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(
      `should have required property 'application_build_number'`,
    ),
    response.message,
  )
})

test('should check for application_version', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [
      {
        name: 'app_open',
        timestamp: Date.now(),
        platform: 'ios',
        manufacturer: 'Apple',
        type: 'iPad13,1',
        carrier: 'T-Mobile',
        os_version: '1.0.0',
        os_name: 'iOS',
        application_build_number: 1,
        screen_size: [1080, 640],
        locale: 'en-US',
      },
    ],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(
      `should have required property 'application_version'`,
    ),
    response.message,
  )
})

test('should check for library_version', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [
      {
        name: 'app_open',
        timestamp: Date.now(),
        platform: 'ios',
        manufacturer: 'Apple',
        type: 'iPad13,1',
        carrier: 'T-Mobile',
        os_version: '1.0.0',
        os_name: 'iOS',
        application_build_number: 1,
        application_version: '1.0.0',
        screen_size: [1080, 640],
        locale: 'en-US',
      },
    ],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(
      `should have required property 'library_version'`,
    ),
    response.message,
  )
})
