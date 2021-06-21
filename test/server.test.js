import test from 'ava'

test('/ should return status up', async (t) => {
  const { build } = await import('../src/server.js')
  const server = await build()
  const response = await server.inject({
    method: 'GET',
    url: '/',
  })

  t.deepEqual(await response.json(), { status: 'up' })
})
