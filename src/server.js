import grpcjs from '@grpc/grpc-js'
import { v4 } from 'uuid'
import ajvCurrency from './validators/ajv-currency-code.js'
import ajvSemver from './validators/ajv-semver.js'
import ajvLocale from './validators/ajv-locale-code.js'
import ajvUuid from './validators/ajv-uuid.js'
import f from 'fastify'
import auth from 'fastify-auth'
import rawBody from 'fastify-raw-body'
import compress from 'fastify-compress'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import metrics from 'fastify-metrics'
import sensible from 'fastify-sensible'
import swagger from 'fastify-swagger'
import tracer from 'cls-rtracer'
import pressure from 'under-pressure'
import logger from './logger.js'
import pg from './pg/index.js'
import routes from './routes/index.js'

import { add as addSchemas } from './schemas/index.js'

import { validateAccess, validateSignature } from './middlewares.js'

export async function build() {
  const server = f({
    trustProxy: true,
    disableRequestLogging: true,
    logger: false,
    ajv: {
      customOptions: { jsonPointers: true },
      plugins: [ajvSemver, ajvCurrency, ajvLocale, ajvUuid],
    },
  })

  server.setErrorHandler(async (error) => {
    if (error.code) {
      // Handle grpc related error codes.
      switch (error.code) {
        case grpcjs.status.NOT_FOUND:
          throw server.httpErrors.notFound(error.message)
        case grpcjs.status.PERMISSION_DENIED:
          throw server.httpErrors.unauthorized(error.message)
        case grpcjs.status.RESOURCE_EXHAUSTED:
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
    routePrefix: '/docs',
    openapi: {
      info: {
        title: 'Awacs',
        description: 'Next-gen user behavior analysis server',
        version: '1.0.0',
      },
      externalDocs: {
        url: 'https://awacs.socketkit.com',
        description: 'Awacs official documentation',
      },
      schemes: ['https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      components: {
        securitySchemes: {
          SocketkitKey: {
            type: 'apiKey',
            name: 'x-socketkit-key',
            in: 'header',
            description: 'Socketkit API Token gathered through the private API',
          },
          ClientId: {
            type: 'apiKey',
            name: 'x-client-id',
            in: 'header',
            description: 'Client id of the user',
            example: v4(),
          },
        },
      },
    },
    exposeRoute: true,
  })

  server.register(rawBody, {
    field: 'rawBody',
    global: false,
    encoding: 'utf8',
    runFirst: true,
  })
  server.register(cors)

  if (!process.env.CI) {
    server.register(pressure, {
      exposeStatusRoute: {
        routeOpts: {
          logLevel: 'debug',
        },
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
    useHeader: true,
    useFastifyRequestId: true,
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
