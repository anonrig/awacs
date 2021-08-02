import faker from 'faker'
import { randomUUID } from 'crypto'
import { getGrpcClients } from './helper.js'

/**
 * @function createApplication
 * @param {any} t Ava test
 * @param {number} port Port number
 * @returns {Promise<{
 *   account_id: string,
 *   application_id: string,
 *   application_title: string
 * }>} Account with application id.
 */
export async function createApplication(t, port) {
  const { Applications } = getGrpcClients(port)
  const { default: server } = await import('../src/grpc.js')
  await server.start(`0.0.0.0:${port}`)

  const account_id = randomUUID()
  const application_id = randomUUID()
  const application_title = faker.company.companyName()

  await Applications.create({
    account_id,
    application_id,
    title: application_title,
    session_timeout: 30,
  })

  const { row: application } = await Applications.findOne({
    account_id,
    application_id,
  })

  t.is(application.account_id, account_id)
  t.is(application.application_id, application_id)
  t.is(application.title, application_title)
  t.is(application.session_timeout, 30)

  t.teardown(async () => {
    await Applications.destroy({ account_id, application_id })
  })

  return { account_id, application_id, application_title }
}
