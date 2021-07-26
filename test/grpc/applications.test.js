import test from 'ava'
import { randomUUID } from 'crypto'
import { getRandomPort, getGrpcClients } from '../helper.js'
import server from '../../src/grpc.js'

test.before(async (t) => {
  t.context.server = server
  const port = getRandomPort()
  await server.start(`0.0.0.0:${port}`)
  t.context.server = server
  t.context.clients = getGrpcClients(port)
  t.context.port = port
})

test.after.always(async (t) => {
  await t.context.server.close()
})

test.cb('should create an application', (t) => {
  t.plan(7)

  const { Applications } = t.context.clients
  const account_id = randomUUID()
  const application_id = randomUUID()

  Applications.create(
    {
      account_id,
      application_id,
      title: 'Test Application',
      session_timeout: 60,
    },
    (error) => {
      t.is(error, null)

      Applications.findOne(
        { account_id, application_id },
        (error, response) => {
          t.is(error, null)
          t.is(response.row.account_id, account_id)
          t.is(response.row.application_id, application_id)
          t.is(response.row.title, 'Test Application')
          t.is(response.row.session_timeout, 60)

          Applications.destroy({ account_id, application_id }, (error) => {
            t.is(error, null)
            t.end()
          })
        },
      )
    },
  )
})

test.cb('should find all applications', (t) => {
  t.plan(6)

  const { Applications } = t.context.clients
  const account_id = randomUUID()
  const application_id = randomUUID()

  Applications.create(
    {
      account_id,
      application_id,
      title: 'Testing findAll',
      session_timeout: 30,
    },
    (error) => {
      t.falsy(error)

      Applications.findAll({ account_id }, (error, response) => {
        t.falsy(error)
        t.truthy(Array.isArray(response.rows))
        response.rows.forEach((row) => {
          t.is(row.account_id, account_id)
          t.is(row.application_id, application_id)
        })

        Applications.destroy({ account_id, application_id }, (error) => {
          t.falsy(error)
          t.end()
        })
      })
    },
  )
})

test.cb('should find one application', (t) => {
  t.plan(11)

  const { Applications } = t.context.clients
  const account_id = randomUUID()
  const application_id = randomUUID()

  Applications.findOne({ account_id, application_id }, (error, response) => {
    t.falsy(error)
    t.truthy(response)
    t.is(response.row, null)

    Applications.create(
      {
        account_id,
        application_id,
        title: 'Testing findOne',
        session_timeout: 70,
      },
      (error, response) => {
        t.falsy(error)
        t.truthy(response)

        Applications.findOne(
          { account_id, application_id },
          (error, response) => {
            t.falsy(error)
            t.truthy(response)
            t.truthy(response.row)
            t.is(response.row.account_id, account_id)
            t.is(response.row.application_id, application_id)

            Applications.destroy({ account_id, application_id }, (error) => {
              t.falsy(error)
              t.end()
            })
          },
        )
      },
    )
  })
})

test.cb('should update an application', (t) => {
  t.plan(8)

  const { Applications } = t.context.clients
  const account_id = randomUUID()
  const application_id = randomUUID()

  Applications.create(
    {
      account_id,
      application_id,
      title: 'Update title 1',
      session_timeout: 40,
    },
    (error) => {
      t.falsy(error)

      Applications.update(
        {
          account_id,
          application_id,
          title: 'Update title 2',
          session_timeout: 50,
        },
        (error) => {
          t.falsy(error)

          Applications.findOne(
            { account_id, application_id },
            (error, response) => {
              t.falsy(error)
              t.is(response.row.account_id, account_id)
              t.is(response.row.application_id, application_id)
              t.is(response.row.title, 'Update title 2')
              t.is(response.row.session_timeout, 50)

              Applications.destroy({ account_id, application_id }, (error) => {
                t.falsy(error)
                t.end()
              })
            },
          )
        },
      )
    },
  )
})
