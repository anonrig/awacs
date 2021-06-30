import * as Events from './events.js'
import * as Errors from './errors.js'
import * as Headers from './headers.js'

export function add(fastify) {
  Object.values(Errors).forEach((schema) => fastify.addSchema(schema))
  Object.values(Events).forEach((schema) => fastify.addSchema(schema))
  Object.values(Headers).forEach((schema) => fastify.addSchema(schema))
}
