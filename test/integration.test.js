import test from 'ava'
import { v4 } from 'uuid'
import dayjs from 'dayjs'

import {
  getRandomPort,
  getGrpcClients,
  promisifyAll,
  sendEventRequest,
} from './helper.js'
import private_server from '../src/grpc.js'
import { app_open } from './seeds.js'

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

test('public api should accept first_app_open requests', async (t) => {
  const client_id = v4()
  const Events = promisifyAll(t.context.clients.Events)
  const { application, account_id } = t.context
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
  const client_id = v4()
  const { application, account_id } = t.context
  const payload = [
    {
      name: 'app_open',
      timestamp: dayjs().subtract(1, 'days').unix() * 1000,
      ...app_open,
    },
  ]

  await sendEventRequest(application, client_id, payload)

  const Clients = promisifyAll(t.context.clients.Clients)
  const client = await Clients.findOne({
    account_id,
    application_id: application.application_id,
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
  const client_id = v4()
  const { application, account_id } = t.context
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

  const Events = promisifyAll(t.context.clients.Events)
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
  const client_id = v4()
  const { application, account_id } = t.context
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

  const Events = promisifyAll(t.context.clients.Events)
  const events = await Events.findAll({ account_id, client_id })
  t.truthy(
    events.rows[0].properties.find(
      (r) => r.key === 'message' && r.value === 'hello from the other side',
    ),
  )
})
