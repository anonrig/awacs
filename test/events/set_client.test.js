import test from 'ava'
import { build } from '../../src/server.js'

test('should work without any parameters', async (t) => {
  const server = await build()
  const { statusCode, body } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    payload: [{ name: 'set_client', timestamp: Date.now() }],
  })
  const response = JSON.parse(body)

  t.is(statusCode, 400)
  t.is(response.error, 'Bad Request')
  t.truthy(
    response.message.includes(
      `headers should have required property 'x-socketkit-key'`,
    ),
  )
})
