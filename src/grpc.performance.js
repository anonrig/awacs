/* c8 ignore start */
import { PerformanceObserver, performance } from 'perf_hooks'

import config from './config.js'
import Logger from './logger.js'

const logger = Logger.create().withScope('grpc')
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    logger.withTag('performance').info(`${entry.name} took ${entry.duration.toFixed(2)} ms`)
  })
})
performanceObserver.observe({ buffered: true, entryTypes: ['measure'] })

export function measure(context) {
  performance.mark(`${context.fullName}-ended`)
  performance.measure(context.fullName, context.fullName, `${context.fullName}-ended`)
}

export default async function GrpcPerformance(context, next) {
  const isHealthRequest = context.fullName.includes('grpc.health')

  if (isHealthRequest) {
    return next()
  }

  performance.mark(context.fullName)

  return next()
    .then(() => measure(context))
    .catch((error) => {
      measure(context)
      throw error
    })
}
