import { randomUUID } from 'crypto'

import grpc from '@grpc/grpc-js'
import ajvBase64 from '@socketkit/ajv-base64'
import ajvCurrency from '@socketkit/ajv-currency-code'
import ajvLocale from '@socketkit/ajv-locale-code'
import ajvSemver from '@socketkit/ajv-semver'
import ajvUuid from '@socketkit/ajv-uuid'
import tracer from 'cls-rtracer'
import f from 'fastify'
import auth from 'fastify-auth'
import compress from 'fastify-compress'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import metrics from 'fastify-metrics'
import rawBody from 'fastify-raw-body'
import sensible from 'fastify-sensible'
import swagger from 'fastify-swagger'
import pressure from 'under-pressure'

import config from './config.js'
import logger from './logger.js'
import { validateAccess, validateSignature } from './middlewares.js'
import pg from './pg/index.js'

import pkg from './pkg.js'
import routes from './routes/index.js'
import { add as addSchemas } from './schemas/index.js'

export async function build() {
  const server = f({
    ajv: {
      customOptions: { allErrors: false, jsonPointers: true },
      plugins: [ajvSemver, ajvCurrency, ajvLocale, ajvUuid, ajvBase64],
    },
    disableRequestLogging: true,
    logger: false,
    trustProxy: true,
  })

  server.setErrorHandler(async (error) => {
    if (error.code) {
      // Handle grpc related error codes.
      switch (error.code) {
        case grpc.status.NOT_FOUND:
          throw server.httpErrors.notFound(error.message)
        case grpc.status.PERMISSION_DENIED:
          throw server.httpErrors.unauthorized(error.message)
        case grpc.status.RESOURCE_EXHAUSTED:
          throw server.httpErrors.serviceUnavailable(error.message)
        default:
          logger.fatal(error)
          throw server.httpErrors.internalServerError('Something went wrong')
      }
    } else if (error.statusCode) {
      // Handle custom error codes
      throw error
    } else if (error.validation) {
      // Handle validation errors
      throw error
    } else {
      // Handle uncaught errors due to runtime issues
      logger.error(error)
      throw server.httpErrors.internalServerError('Something went wrong')
    }
  })

  await server.register(auth)

  addSchemas(server)

  server.register(swagger, {
    exposeRoute: true,
    openapi: {
      components: {
        securitySchemes: {
          ClientId: {
            description: 'Client id of the user',
            example: randomUUID(),
            in: 'header',
            name: 'x-client-id',
            type: 'apiKey',
          },
          SocketkitKey: {
            description: 'Socketkit API Token gathered through the private API',
            in: 'header',
            name: 'x-socketkit-key',
            type: 'apiKey',
          },
        },
      },
      consumes: ['application/json'],
      externalDocs: {
        description: 'Awacs official documentation',
        url: 'https://awacs.socketkit.com',
      },
      info: {
        description: 'Next-gen user behavior analysis server',
        title: 'Awacs',
        version: pkg.version,
      },
      produces: ['application/json'],
      schemes: ['https'],
    },
    routePrefix: '/docs',
  })

  server.register(rawBody, {
    encoding: 'utf8',
    field: 'rawBody',
    global: false,
    runFirst: true,
  })
  server.register(cors)

  if (!config.isCI) {
    server.register(pressure, {
      exposeStatusRoute: {
        routeSchemaOpts: {
          hide: true,
        },
        url: '/health',
      },
      healthCheck: async function () {
        await pg.raw('select 1+1 as result')
        return true
      },
      healthCheckInterval: 60000,
    })
    server.register(metrics, { endpoint: '/metrics' })
  }
  server.register(tracer.fastifyPlugin, {
    echoHeader: true,
    useFastifyRequestId: true,
    useHeader: true,
  })
  server.register(sensible, { errorHandler: false })
  server.register(compress)
  server.register(helmet, (instance) => {
    return {
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'form-action': ["'self'"],
          'img-src': ["'self'", 'data:', 'validator.swagger.io'],
          'script-src': ["'self'"].concat(instance.swaggerCSP.script),
          'style-src': ["'self'", 'https:'].concat(instance.swaggerCSP.style),
        },
      },
    }
  })

  server.addHook('preHandler', (req, res, next) => {
    if (!req.routerPath?.startsWith('/v1/')) {
      return next()
    }
    return server.auth([validateAccess, validateSignature], {
      relation: 'and',
      run: 'all',
    })(req, res, next)
  })

  server.register(routes, { prefix: '/v1' })
  server.get('/', { schema: { hide: true } }, async () => ({
    status: 'up',
  }))

  return server
}
