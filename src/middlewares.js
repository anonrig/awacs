import config from './config.js'
import { getByAuthorization } from './pg/application.js'
import * as Signing from './signing.js'

/**
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
export async function validateAccess(request, reply) {
  let country_id = request.headers['cf-ipcountry']?.toLowerCase()

  if (!config.isProduction && !country_id) {
    country_id = 'tr'
  }

  const authorization_key = request.headers['x-socketkit-key']
  const client_id = request.headers['x-client-id']

  const application = await getByAuthorization({
    authorization_key,
  })

  if (!application) {
    return reply.forbidden('Invalid authorization key')
  }

  request.application = application
  request.client_id = client_id
  request.country_id = country_id
  request.account_id = application.account_id
}

/**
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
export async function validateSignature(request, reply) {
  const signature = request.headers['x-signature']

  if (!signature) {
    return reply.internalServerError(
      'Signature is not available for signature validation',
    )
  }

  if (!request.application) {
    return reply.internalServerError(
      'Application is not available for signature validation',
    )
  }

  const isValid = await Signing.validate(
    request.rawBody,
    request.application.server_key,
    signature,
  )

  if (!isValid) {
    return reply.expectationFailed('Application signature does not match')
  }
}
