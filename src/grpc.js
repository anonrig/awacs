import Mali from 'mali'
import path from 'path'
import { PerformanceObserver, performance } from 'perf_hooks'

import * as Applications from './consumers/applications.js'
import * as Events from './consumers/events.js'
import Logger from './logger.js'

const logger = Logger.create().withScope('grpc')
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}
const file = path.join(path.resolve(''), 'protofiles/tracking.proto')
const health = path.join(path.resolve(''), 'protofiles/health.proto')
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    logger
      .withTag('performance')
      .info(`${entry.name} took ${entry.duration.toFixed(2)} ms`)
  })
})
performanceObserver.observe({ entryTypes: ['measure'], buffered: true })

const app = new Mali()

app.addService(file, ['Applications', 'Events'], options)
app.addService(health, 'Health', options)

app.use(async (context, next) => {
  const isHealthRequest = context.fullName.includes('grpc.health')

  if (isHealthRequest) {
    return next()
  }

  performance.mark(context.fullName)

  function measure() {
    performance.mark(`${context.fullName}-ended`)
    performance.measure(
      context.fullName,
      context.fullName,
      `${context.fullName}-ended`,
    )
  }

  return next()
    .then(() => measure())
    .catch((error) => {
      logger.fatal(error)
      measure()
      throw error
    })
})

app.use({ Applications, Events })
app.use('grpc.health.v1.Health', 'Check', (ctx) => (ctx.res = { status: 1 }))

app.on('error', (error) => {
  logger.fatal(error)
})

export default app
