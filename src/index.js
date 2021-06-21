import Logger from './logger.js'
import { build } from './server.js'
import config from './config.js'
import pg from './pg/index.js'
import grpc from './grpc.js'

const logger = Logger.create().withScope('application').withTag('start')
const server = await build()

await pg.raw('select 1+1 as result')
await server.listen(config.port, '0.0.0.0')
logger.success(`Application booted on port=${config.port}`)

grpc.start(`0.0.0.0:${config.grpc_port}`)
logger.success(`GRPC application booted on port=${config.grpc_port}`)
