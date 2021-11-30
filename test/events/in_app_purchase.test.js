import { randomUUID } from 'crypto'

import test from 'ava'
import dayjs from 'dayjs'

import { createApplication } from '../actions.js'
import { getRandomPort, getGrpcClients, sendEventRequest } from '../helper.js'
import { app_open } from '../seeds.js'

test('should accept in_app_purchase requests', async (t) => {
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
      timestamp: dayjs().subtract(1, 'days').toISOString(),
      ...app_open,
    },
    {
      name: 'in_app_purchase',
      product_currency: 'USD',
      product_name: 'Weekly Package',
      product_price: 4.99,
      product_quantity: 1,
      timestamp: dayjs().subtract(12, 'hours').toISOString(),
    },
  ]

  const request_response = await sendEventRequest(application, client_id, payload)
  t.not(request_response, 500, `Request should not fail but got ${request_response.body}`)

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
