import { randomUUID } from 'crypto'

import test from 'ava'
import dayjs from 'dayjs'

import { createApplication } from '../actions.js'
import { getRandomPort, getGrpcClients, sendEventRequest } from '../helper.js'
import { app_open } from '../seeds.js'

test('should accept set_client requests', async (t) => {
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
      timestamp: dayjs().subtract(1, 'days').toISOString(),
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
      distinct_id: 'hello-world-from-integration-tests',
      name: 'set_client',
      timestamp: dayjs().subtract(3, 'days').toISOString(),
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
