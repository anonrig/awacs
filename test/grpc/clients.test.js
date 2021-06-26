import test from 'ava'
import { v4 } from 'uuid'
import {
  getRandomPort,
  getGrpcClients,
  promisifyAll,
  sendEventRequest,
} from '../helper.js'
import private_server from '../../src/grpc.js'
import { app_open } from '../seeds.js'

test.before(async (t) => {
  const account_id = v4()
  const application_id = v4()
  const port = getRandomPort()

  await private_server.start(`0.0.0.0:${port}`)
  t.context.private_server = private_server
  t.context.clients = getGrpcClients(port)
  t.context.account_id = account_id
  t.context.application_id = application_id

  const Applications = promisifyAll(t.context.clients.Applications)

  await Applications.create({
    account_id,
    application_id,
    title: 'Test Application',
    session_timeout: 60,
  })

  t.context.application = (
    await Applications.findOne({
      account_id,
      application_id,
    })
  ).row
})

test.after.always(async (t) => {
  const { account_id, application_id } = t.context
  const Applications = promisifyAll(t.context.clients.Applications)
  await Applications.destroy({ account_id, application_id })
  await t.context.private_server.close()
})

test('should find all clients', async (t) => {
  const Clients = promisifyAll(t.context.clients.Clients)
  const payload = [{ name: 'app_open', timestamp: Date.now(), ...app_open }]
  const { account_id, application_id, application } = t.context
  const client_id = v4()

  await sendEventRequest(application, client_id, payload)
  await sendEventRequest(application, client_id, payload)

  const response = await Clients.findAll({ account_id, application_id })
  t.truthy(response.rows)
  t.is(response.rows.length, 2)
  t.is(response.rows[0].application_id, application_id)
  t.is(response.rows[0].account_id, account_id)
})

test.cb('findAll should check for valid account_id', (t) => {
  t.plan(3)

  const { Clients } = t.context.clients

  Clients.findAll({ account_id: 'ahmet' }, (error, response) => {
    t.truthy(error)
    t.is(error.message, '9 FAILED_PRECONDITION: Invalid account_id')
    t.falsy(response)
    t.end()
  })
})

test('should find a single client', async (t) => {
  const Clients = promisifyAll(t.context.clients.Clients)
  const payload = [{ name: 'app_open', timestamp: Date.now(), ...app_open }]
  const { account_id, application_id, application } = t.context
  const client_id = v4()

  const { body, statusCode } = await sendEventRequest(
    application,
    client_id,
    payload,
  )

  t.deepEqual(JSON.parse(body), {})
  t.is(statusCode, 200)

  const response = await Clients.findOne({
    account_id,
    application_id,
    client_id,
  })
  t.truthy(response.row)
  t.is(response.row.application_id, application_id)
  t.is(response.row.account_id, account_id)
  t.is(response.row.client_id, client_id)
})
