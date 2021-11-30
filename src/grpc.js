import path from 'path'

import AjvFormats from 'ajv-formats'
import Mali from 'mali'
import MaliAjv, { addSchemas } from 'mali-ajv'

import config from './config.js'
import * as Applications from './consumers/applications.js'

import * as applications from './consumers/applications.schema.js'
import * as Clients from './consumers/clients.js'
import * as clients from './consumers/clients.schema.js'
import * as Events from './consumers/events.js'
import * as events from './consumers/events.schema.js'
import * as Sessions from './consumers/sessions.js'
import * as sessions from './consumers/sessions.schema.js'
import performancePlugin from './grpc.performance.js'
import Logger from './logger.js'

AjvFormats(MaliAjv)

const logger = Logger.create().withScope('grpc')
const file = path.join(path.resolve(''), './src/protofiles/awacs.proto')
const health = path.join(path.resolve(''), './src/protofiles/health.proto')

const app = new Mali(file, ['Applications', 'Clients', 'Events', 'Sessions'], config.grpcOptions)

app.addService(health, 'Health', config.grpcOptions)

if (config.isDevelopment) {
  app.use(performancePlugin)
}

app.use(addSchemas(app, { applications, clients, events, sessions }))
app.use({ Applications, Clients, Events, Sessions })
app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

/* c8 ignore start */
app.on('error', (error) => {
  if (!error.code) {
    logger.fatal(error)
  }
})
/* c8 ignore end */

export default app
