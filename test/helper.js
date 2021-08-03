/* eslint-disable security/detect-object-injection */
import Ajv from 'ajv'
import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'
import path from 'path'
import { promisify } from 'util'

import config from '../src/config.js'
import * as Signing from '../src/signing.js'

import AjvFormats from 'ajv-formats'
import AjvCurrencyCode from '@socketkit/ajv-currency-code'
import AjvSemver from '@socketkit/ajv-semver'
import AjvLocale from '@socketkit/ajv-locale-code'

const formatter = new Ajv.default({ allErrors: false, strict: false })

AjvFormats(formatter)
AjvLocale(formatter)
AjvSemver(formatter)
AjvCurrencyCode(formatter)

export const ajv = formatter

export function promisifyAll(subscriber) {
  const to = {}
  for (const k in subscriber) {
    if (typeof subscriber[k] !== 'function') continue
    to[k] = promisify(subscriber[k].bind(subscriber))
  }
  return to
}

export async function sendEventRequest(application, client_id, payload) {
  const { build } = await import('../src/server.js')
  const server = await build()
  const { body, statusCode } = await server.inject({
    method: 'POST',
    url: '/v1/events',
    headers: {
      'x-socketkit-key': application.authorization_key.toString('base64'),
      'x-client-id': client_id,
      'x-signature': await Signing.sign(
        JSON.stringify(payload),
        application.application_key,
      ),
    },
    payload,
  })

  return { body, statusCode }
}

export const getRandomPort = (a = 1000, b = 65000) => {
  const lower = Math.ceil(Math.min(a, b))
  const upper = Math.floor(Math.max(a, b))
  return Math.floor(lower + Math.random() * (upper - lower + 1))
}

export function getGrpcClients(port = config.grpc_port) {
  const url = `0.0.0.0:${port}`
  const defaults = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }

  const { Applications, Clients, Events, Sessions } =
    grpc.loadPackageDefinition(
      loader.loadSync(path.join('.', 'src/protofiles/awacs.proto'), defaults),
    )

  return {
    Applications: promisifyAll(
      new Applications(url, grpc.credentials.createInsecure()),
    ),
    Clients: promisifyAll(new Clients(url, grpc.credentials.createInsecure())),
    Events: promisifyAll(new Events(url, grpc.credentials.createInsecure())),
    Sessions: promisifyAll(
      new Sessions(url, grpc.credentials.createInsecure()),
    ),
  }
}
