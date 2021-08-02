import test from 'ava'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'
import { getRandomPort, getGrpcClients, sendEventRequest } from '../helper.js'
import { app_open } from '../seeds.js'
import { createApplication } from '../actions.js'

test('should find all events', async (t) => {
  const port = getRandomPort()
  const { Events } = getGrpcClients(port)
  await createApplication(t, port)
  const { rows } = await Events.findAll({ account_id: randomUUID() })
  t.deepEqual(rows, [])
})

test('should count all events', async (t) => {
  const port = getRandomPort()
  const { Events } = getGrpcClients(port)
  const { account_id } = await createApplication(t, port)
  const { count } = await Events.count({ account_id })
  t.is(count, 0)
})

test('findAll should paginate with limit', async (t) => {
  const port = getRandomPort()
  const { Applications, Events } = getGrpcClients(port)
  const { account_id, application_id } = await createApplication(t, port)
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
