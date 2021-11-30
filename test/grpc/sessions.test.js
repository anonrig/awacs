import { randomUUID } from 'crypto'

import test from 'ava'
import dayjs from 'dayjs'

import { createApplication } from '../actions.js'
import { getRandomPort, getGrpcClients, sendEventRequest } from '../helper.js'
import { app_open } from '../seeds.js'

test('should find all sessions', async (t) => {
  const port = getRandomPort()
  const { Applications, Sessions } = getGrpcClients(port)
  const { application_id, account_id } = await createApplication(t, port)
  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })
  const client_id = randomUUID()
  const payload = [
    { name: 'app_open', timestamp: dayjs().toISOString(), ...app_open },
    {
      name: 'app_open',
      timestamp: dayjs().subtract(1, 'week').toISOString(),
      ...app_open,
    },
    {
      name: 'app_open',
      timestamp: dayjs().subtract(2, 'week').toISOString(),
      ...app_open,
    },
  ]

  const { body, statusCode } = await sendEventRequest(application, client_id, payload)

  t.deepEqual(JSON.parse(body), {})
  t.is(statusCode, 200)

  const response = await Sessions.findAll({ account_id })
  t.truthy(response.rows)
  t.is(response.rows.length, 3)
  response.rows.forEach((row) => {
    t.is(row.application_id, application_id)
    t.is(row.account_id, account_id)
    t.is(row.client_id, client_id)
  })
  t.falsy(response.cursor)

  const { count } = await Sessions.count({ account_id })
  t.is(count, 3)
})

test('should limit on Sessions.findAll', async (t) => {
  const port = getRandomPort()
  const { Applications, Sessions } = getGrpcClients(port)
  const { account_id, application_id } = await createApplication(t, port)
  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })
  const client_id = randomUUID()
  const payload = [
    { name: 'app_open', timestamp: dayjs().toISOString(), ...app_open },
    {
      name: 'app_open',
      timestamp: dayjs().subtract(1, 'week').toISOString(),
      ...app_open,
    },
    {
      name: 'app_open',
      timestamp: dayjs().subtract(2, 'week').toISOString(),
      ...app_open,
    },
  ]

  await sendEventRequest(application, client_id, payload)

  const { rows, cursor } = await Sessions.findAll({ account_id, limit: 2 })

  t.is(cursor.expired_at, rows[rows.length - 1].expired_at)
  t.is(rows.length, 2)
  rows.forEach((row) => {
    t.is(row.application_id, application_id)
    t.is(row.account_id, account_id)
  })
})
