import * as Errors from './errors.js'
import * as Events from './events.js'
import * as Headers from './headers.js'
import * as Responses from './responses.js'

export function add(fastify) {
  for (const schemas of [Errors, Events, Headers, Responses]) {
    Object.values(schemas).forEach((schema) => fastify.addSchema(schema))
  }
}
