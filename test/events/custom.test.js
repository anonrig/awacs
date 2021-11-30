import { randomUUID } from 'crypto'

import test from 'ava'
import dayjs from 'dayjs'

import { createApplication } from '../actions.js'
import { getRandomPort, getGrpcClients, sendEventRequest } from '../helper.js'
import { app_open } from '../seeds.js'

test('should accept custom requests', async (t) => {
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
      message: 'hello from the other side',
      name: 'custom',
      timestamp: dayjs().subtract(12, 'hours').toISOString(),
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
