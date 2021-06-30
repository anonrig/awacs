import test from 'ava'

test('openapi should return json', async (t) => {
  const { build } = await import('../src/server.js')
  const server = await build()
  const response = await server.inject({
    method: 'GET',
    url: '/docs/json',
  })

  t.is(response.statusCode, 200)
  t.truthy(await response.json())
})

test('openapi should return yaml', async (t) => {
  const { build } = await import('../src/server.js')
  const server = await build()
  const response = await server.inject({
    method: 'GET',
    url: '/docs/yaml',
  })

  t.is(response.statusCode, 200)
  t.truthy(response.body)
})
