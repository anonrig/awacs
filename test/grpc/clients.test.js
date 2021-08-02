import test from 'ava'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'
import { getRandomPort, getGrpcClients, sendEventRequest } from '../helper.js'
import { createApplication } from '../actions.js'
import { app_open } from '../seeds.js'

test('should find all clients', async (t) => {
  const port = getRandomPort()
  const { Applications, Clients } = getGrpcClients(port)
  const { account_id, application_id } = await createApplication(t, port)

  const payload = [{ name: 'app_open', timestamp: Date.now(), ...app_open }]
  const client_id = randomUUID()
  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })

  await sendEventRequest(application, client_id, payload)
  await sendEventRequest(application, client_id, payload)

  const response = await Clients.findAll({ account_id, application_id })
  t.truthy(response.rows)
  response.rows.forEach((row) => {
    t.is(row.application_id, application_id)
    t.is(row.account_id, account_id)
    t.is(row.client_id, client_id)
  })
})

test('should count all clients', async (t) => {
  const port = getRandomPort()
  const { Applications, Clients } = getGrpcClients(port)
  const { account_id, application_id } = await createApplication(t, port)
  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })

  const payload = [{ name: 'app_open', timestamp: Date.now(), ...app_open }]
  const client_id = randomUUID()

  await sendEventRequest(application, client_id, payload)
  await sendEventRequest(application, client_id, payload)

  const count_response = await Clients.count({ account_id, application_id })
  t.truthy(count_response.count)
  t.is(count_response.count, 1)
})

test('should find a single client', async (t) => {
  const port = getRandomPort()
  const { Applications, Clients } = getGrpcClients(port)
  const { account_id, application_id } = await createApplication(t, port)
  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })
  const payload = [{ name: 'app_open', timestamp: Date.now(), ...app_open }]
  const client_id = randomUUID()

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
  t.deepEqual(response.row.additional_properties, [])
})

test('should find a client with additional properties', async (t) => {
  const port = getRandomPort()
  const { Applications, Clients } = getGrpcClients(port)
  const { account_id, application_id } = await createApplication(t, port)
  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })
  const payload = [
    {
      name: 'app_open',
      timestamp: dayjs().subtract(1, 'second').unix() * 1000,
      ...app_open,
    },
    {
      name: 'set_client',
      timestamp: dayjs().unix() * 1000,
      additional_properties: {
        is_additional: true,
      },
    },
  ]
  const client_id = randomUUID()

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
  t.deepEqual(response.row.additional_properties, [
    { key: 'is_additional', value: 'true' },
  ])
})

test('should not find a missing client', async (t) => {
  const port = getRandomPort()
  const { Clients } = getGrpcClients(port)
  const { account_id, application_id } = await createApplication(t, port)
  t.deepEqual(
    await Clients.findOne({
      account_id,
      application_id,
      client_id: randomUUID(),
    }),
    { row: null },
  )
})
