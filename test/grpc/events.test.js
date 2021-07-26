import test from 'ava'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'
import {
  getRandomPort,
  getGrpcClients,
  sendEventRequest,
  promisifyAll,
} from '../helper.js'
import server from '../../src/grpc.js'
import { app_open } from '../seeds.js'

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
  const account_id = randomUUID()

  Events.findAll({ account_id }, (error, response) => {
    t.is(error, null)
    t.truthy(response)
    t.truthy(Array.isArray(response.rows))
    t.falsy(response.cursor)
    t.end()
  })
})

test('findAll should paginate with limit', async (t) => {
  const Events = promisifyAll(t.context.clients.Events)
  const Applications = promisifyAll(t.context.clients.Applications)
  const account_id = randomUUID()
  const application_id = randomUUID()

  await Applications.create({
    account_id,
    application_id,
    title: 'Test Application',
    session_timeout: 60,
  })

  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })

  const clients = [randomUUID(), randomUUID()]

  await sendEventRequest(application, clients[0], [
    {
      name: 'app_open',
      timestamp: dayjs().subtract(1, 'day').unix() * 1000,
      ...app_open,
    },
  ])
  await sendEventRequest(application, clients[1], [
    { name: 'app_open', timestamp: Date.now(), ...app_open },
  ])

  const { rows: first_page, cursor: first_page_cursor } = await Events.findAll({
    account_id,
    limit: 1,
  })

  t.truthy(first_page_cursor.created_at)
  t.is(first_page.length, 1)

  const { rows: second_page, cursor: second_page_cursor } =
    await Events.findAll({ account_id, limit: 1, cursor: first_page_cursor })

  t.notDeepEqual(first_page[0].client_id, second_page[0].client_id)

  const { rows: third_page, cursor: third_page_cursor } = await Events.findAll({
    account_id,
    limit: 1,
    cursor: second_page_cursor,
  })

  t.deepEqual(third_page, [])
  t.falsy(third_page_cursor)
})
