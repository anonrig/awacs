import test from 'ava'
import { build } from '../../src/server.js'

test('should check for product_name', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [{ name: 'in_app_purchase', timestamp: Date.now() }],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(`should have required property 'product_name'`),
    response.message,
  )
})

test('should check for product_quantity', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [
      {
        name: 'in_app_purchase',
        timestamp: Date.now(),
        product_name: 'Weekly package',
      },
    ],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(
      `should have required property 'product_quantity'`,
    ),
    response.message,
  )
})

test('should check for product_price', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [
      {
        name: 'in_app_purchase',
        timestamp: Date.now(),
        product_name: 'Weekly package',
        product_quantity: 1,
      },
    ],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(`should have required property 'product_price'`),
    response.message,
  )
})

test('should check for product_currency', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [
      {
        name: 'in_app_purchase',
        timestamp: Date.now(),
        product_name: 'Weekly package',
        product_quantity: 1,
        product_price: 14.99,
      },
    ],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(
      `should have required property 'product_currency'`,
    ),
    response.message,
  )
})

test('validate product_currency', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [
      {
        name: 'in_app_purchase',
        timestamp: Date.now(),
        product_name: 'Weekly package',
        product_quantity: 1,
        product_price: 14.99,
        product_currency: 'HELLO',
      },
    ],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(`should match format "currency_code"`),
    response.message,
  )
})
