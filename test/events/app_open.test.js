import { randomUUID } from 'crypto'

import test from 'ava'

import { createApplication } from '../actions.js'
import { getRandomPort, getGrpcClients, sendEventRequest } from '../helper.js'
import { app_open } from '../seeds.js'

test('should accept first_app_open requests', async (t) => {
  const port = getRandomPort()
  const { Applications, Events } = getGrpcClients(port)
  const { application_id, account_id } = await createApplication(t, port)
  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })
  const client_id = randomUUID()
  const payload = [{ name: 'app_open', timestamp: new Date().toISOString(), ...app_open }]

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
