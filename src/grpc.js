import Mali from 'mali'
import path from 'path'

import performancePlugin from './grpc.performance.js'
import * as Applications from './consumers/applications.js'
import * as Clients from './consumers/clients.js'
import * as Events from './consumers/events.js'
import * as Sessions from './consumers/sessions.js'
import Logger from './logger.js'

const logger = Logger.create().withScope('grpc')
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}
const file = path.join(path.resolve(''), './src/protofiles/awacs.proto')
const health = path.join(path.resolve(''), './src/protofiles/health.proto')

const app = new Mali()

app.addService(file, ['Applications', 'Clients', 'Events', 'Sessions'], options)
app.addService(health, 'Health', options)

app.use(performancePlugin)

app.use({ Applications, Clients, Events, Sessions })
app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

app.on('error', (error) => {
  if (!error.code) {
    logger.fatal(error)
  }
})

export default app
