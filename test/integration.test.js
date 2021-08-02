import test from 'ava'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'

import { getRandomPort, getGrpcClients, sendEventRequest } from './helper.js'
import { app_open } from './seeds.js'
import { createApplication } from './actions.js'

test('public api should accept first_app_open requests', async (t) => {
  const port = getRandomPort()
  const { Applications, Events } = getGrpcClients(port)
  const { application_id, account_id } = await createApplication(t, port)
  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })
  const client_id = randomUUID()
  const payload = [{ name: 'app_open', timestamp: Date.now(), ...app_open }]

  await sendEventRequest(application, client_id, payload)

  const events = await Events.findAll({
    account_id,
    application_id: application.application_id,
    client_id,
  })

  t.falsy(events.cursor)
  t.truthy(events.rows)
  t.is(events.rows.length, 1)
  t.is(events.rows[0].account_id, account_id)
  t.is(events.rows[0].application_id, application.application_id)
  t.is(events.rows[0].title, 'first_app_open')
  t.is(events.rows[0].client_id, client_id)
})

test('public api should accept set_client requests', async (t) => {
  const port = getRandomPort()
  const { Applications, Clients } = getGrpcClients(port)
  const { application_id, account_id } = await createApplication(t, port)
  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })
  const client_id = randomUUID()
  const payload = [
    {
      name: 'app_open',
      timestamp: dayjs().subtract(1, 'days').unix() * 1000,
      ...app_open,
    },
  ]

  await sendEventRequest(application, client_id, payload)

  const client = await Clients.findOne({
    account_id,
    application_id,
    client_id,
  })

  t.is(client.row.account_id, account_id)
  t.is(client.row.application_id, application.application_id)
  t.is(client.row.client_id, client_id)

  await sendEventRequest(application, client_id, [
    {
      name: 'set_client',
      timestamp: dayjs().subtract(3, 'days').unix() * 1000,
      distinct_id: 'hello-world-from-integration-tests',
    },
  ])

  const updated_client = await Clients.findOne({
    account_id,
    application_id: application.application_id,
    client_id,
  })

  t.is(updated_client.row.account_id, account_id)
  t.is(updated_client.row.application_id, application.application_id)
  t.is(updated_client.row.client_id, client_id)
  t.is(updated_client.row.distinct_id, 'hello-world-from-integration-tests')
})

test('public api should accept in_app_purchase requests', async (t) => {
  const port = getRandomPort()
  const { Applications, Events } = getGrpcClients(port)
  const { application_id, account_id } = await createApplication(t, port)
  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })
  const client_id = randomUUID()
  const payload = [
    {
      name: 'app_open',
      timestamp: dayjs().subtract(1, 'days').unix() * 1000,
      ...app_open,
    },
    {
      name: 'in_app_purchase',
      timestamp: dayjs().subtract(12, 'hours').unix() * 1000,
      product_name: 'Weekly Package',
      product_quantity: 1,
      product_price: 4.99,
      product_currency: 'USD',
    },
  ]

  await sendEventRequest(application, client_id, payload)

  const events = await Events.findAll({ account_id, client_id })
  const event = events.rows.find((r) => r.title === 'in_app_purchase')
  t.truthy(event)
  t.deepEqual(event.properties, [
    { key: 'product_name', value: 'Weekly Package' },
    { key: 'product_price', value: '4.99' },
    { key: 'product_currency', value: 'USD' },
    { key: 'product_quantity', value: '1' },
  ])
})

test('public api should accept custom requests', async (t) => {
  const port = getRandomPort()
  const { Applications, Events } = getGrpcClients(port)
  const { application_id, account_id } = await createApplication(t, port)
  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })
  const client_id = randomUUID()
  const payload = [
    {
      name: 'app_open',
      timestamp: dayjs().subtract(1, 'days').unix() * 1000,
      ...app_open,
    },
    {
      name: 'custom',
      timestamp: dayjs().subtract(12, 'hours').unix() * 1000,
      message: 'hello from the other side',
    },
  ]

  await sendEventRequest(application, client_id, payload)

  const events = await Events.findAll({ account_id, client_id })
  t.truthy(
    events.rows[0].properties.find(
      (r) => r.key === 'message' && r.value === 'hello from the other side',
    ),
  )
})
