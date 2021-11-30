import { randomUUID } from 'crypto'

import test from 'ava'
import dayjs from 'dayjs'

import { createApplication } from '../actions.js'
import { getRandomPort, getGrpcClients, sendEventRequest } from '../helper.js'
import { app_open } from '../seeds.js'

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

test('findAll should include client information', async (t) => {
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
      timestamp: dayjs().subtract(1, 'day').toISOString(),
      ...app_open,
    },
  ])
  await sendEventRequest(application, clients[1], [
    { name: 'app_open', timestamp: new Date().toISOString(), ...app_open },
  ])

  const { rows } = await Events.findAll({
    account_id,
    limit: 1,
  })

  t.true(Array.isArray(rows))

  rows.forEach((row) => {
    t.truthy(row.client)
    t.truthy(clients.includes(row.client.client_id))
  })
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
      timestamp: dayjs().subtract(1, 'day').toISOString(),
      ...app_open,
    },
  ])
  await sendEventRequest(application, clients[1], [
    { name: 'app_open', timestamp: new Date().toISOString(), ...app_open },
  ])

  const { rows: first_page, cursor: first_page_cursor } = await Events.findAll({
    account_id,
    limit: 1,
  })

  t.truthy(first_page_cursor.created_at)
  t.is(first_page.length, 1)

  const { rows: second_page, cursor: second_page_cursor } = await Events.findAll({
    account_id,
    cursor: first_page_cursor,
    limit: 1,
  })

  t.notDeepEqual(first_page[0].client_id, second_page[0].client_id)

  const { rows: third_page, cursor: third_page_cursor } = await Events.findAll({
    account_id,
    cursor: second_page_cursor,
    limit: 1,
  })

  t.deepEqual(third_page, [])
  t.falsy(third_page_cursor)
})
