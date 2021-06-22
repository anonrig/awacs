import test from 'ava'
import { v4 } from 'uuid'
import dayjs from 'dayjs'
import * as Signing from '../../src/signing.js'
import { getRandomPort, getGrpcClients, promisifyAll } from '../helper.js'
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

test('should find all sessions', async (t) => {
  const Sessions = promisifyAll(t.context.clients.Sessions)
  const payload = [
    { name: 'app_open', timestamp: dayjs().unix() * 1000, ...app_open },
    {
      name: 'app_open',
      timestamp: dayjs().subtract(1, 'week').unix() * 1000,
      ...app_open,
    },
  ]

  const { account_id, application_id, application } = t.context
  const client_id = v4()

  async function sendEventRequest() {
    const { build } = await import('../../src/server.js')
    const server = await build()
    const { body, statusCode } = await server.inject({
      method: 'POST',
      url: '/v1/events',
      headers: {
        'x-socketkit-key': application.authorization_key.toString('base64'),
        'x-client-id': client_id,
        'x-signature': await Signing.sign(
          JSON.stringify(payload),
          application.application_key,
        ),
      },
      payload,
    })

    t.deepEqual(JSON.parse(body), {})
    t.is(statusCode, 200)
  }

  await sendEventRequest()

  const response = await Sessions.findAll({ account_id })
  t.truthy(response.rows)
  t.is(response.rows.length, 2)
  t.is(response.rows[0].application_id, application_id)
  t.is(response.rows[0].account_id, account_id)
  t.is(response.rows[0].client_id, client_id)
})

test.cb('findAll should check for valid account_id', (t) => {
  t.plan(3)

  const { Sessions } = t.context.clients

  Sessions.findAll({ account_id: 'ahmet' }, (error, response) => {
    t.truthy(error)
    t.is(error.message, '9 FAILED_PRECONDITION: Invalid account_id')
    t.falsy(response)
    t.end()
  })
})
