import { randomUUID } from 'node:crypto'

import * as Applications from './src/pg/application.js'
import pg from './src/pg/index.js'

await pg.transaction(async (trx) => {
  const { application_key, authorization_key, ...application } = await Applications.create(
    {
      account_id: randomUUID(),
      application_id: randomUUID(),
      session_timeout: 30,
      title: randomUUID(),
    },
    trx,
  )

  console.info('Application created')
  console.info(application)

  console.group('client keys')
  console.info('authorization_key', authorization_key.toString('base64'))
  console.info('application_key', application_key.toString('base64'))
  console.groupEnd()
})

process.exit(0)
