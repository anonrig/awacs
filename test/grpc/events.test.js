import test from 'ava'
import { v4 } from 'uuid'
import { getRandomPort, getGrpcClients } from '../helper.js'
import server from '../../src/grpc.js'

test.before(async (t) => {
  t.context.server = server
  const port = getRandomPort()
  await server.start(`0.0.0.0:${port}`)
  t.context.server = server
  t.context.clients = getGrpcClients(port)
  t.context.port = port
})

test.after.always(async (t) => {
  await t.context.server.close()
})

test.cb('findAll should return rows', (t) => {
  t.plan(4)

  const { Events } = t.context.clients
  const account_id = v4()

  Events.findAll({ account_id }, (error, response) => {
    t.is(error, null)
    t.truthy(response)
    t.truthy(Array.isArray(response.rows))
    t.falsy(response.cursor)
    t.end()
  })
})

test.cb('findAll should validate account_id', (t) => {
  t.plan(2)
  const { Events } = t.context.clients

  Events.findAll({ account_id: 'test' }, (error) => {
    t.truthy(error)
    t.is(error.message, '9 FAILED_PRECONDITION: Invalid account_id')
    t.end()
  })
})
