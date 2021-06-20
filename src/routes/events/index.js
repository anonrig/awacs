import create from './create.js'

/**
 * @param {import('fastify').FastifyInstance} f
 */
export default (f, _opts, done) => {
  f.route(create)
  done()
}
