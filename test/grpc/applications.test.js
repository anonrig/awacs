import test from 'ava'
import { getRandomPort, getGrpcClients } from '../helper.js'
import { createApplication } from '../actions.js'

test('should create an application', async (t) => {
  t.truthy(await createApplication(t, getRandomPort()))
})

test('should find all applications', async (t) => {
  const port = getRandomPort()
  const { Applications } = getGrpcClients(port)

  const { account_id, application_id, application_title } =
    await createApplication(t, port)

  const response = await Applications.findAll({ account_id })

  t.is(response.rows.length, 1)
  t.falsy(response.cursor)

  response.rows.forEach((row) => {
    t.is(row.account_id, account_id)
    t.is(row.application_id, application_id)
    t.is(row.title, application_title)
    t.is(row.session_timeout, 30)
  })
})

test('should count all applications', async (t) => {
  const port = getRandomPort()
  const { Applications } = getGrpcClients(port)
  const { account_id } = await createApplication(t, port)

  const { count } = await Applications.count({ account_id })

  t.is(count, 1)
})

test('should find one application', async (t) => {
  const port = getRandomPort()
  const { Applications } = getGrpcClients(port)
  const { account_id, application_id, application_title } =
    await createApplication(t, port)
  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })

  t.is(application.account_id, account_id)
  t.is(application.application_id, application_id)
  t.is(application.title, application_title)
  t.is(application.session_timeout, 30)
})

test('should update an application', async (t) => {
  const port = getRandomPort()
  const { Applications } = getGrpcClients(port)
  const { account_id, application_id } = await createApplication(t, port)

  await Applications.update({
    account_id,
    application_id,
    title: 'Updated title',
    session_timeout: 50,
  })

  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })

  t.is(application.account_id, account_id)
  t.is(application.application_id, application_id)
  t.is(application.title, 'Updated title')
  t.is(application.session_timeout, 50)
})
