import Ajv from 'ajv'
import grpc from '@grpc/grpc-js'
import loader from '@grpc/proto-loader'
import path from 'path'

import config from '../src/config.js'

import AjvCurrencyCode from '../src/validators/ajv-currency-code.js'
import AjvSemver from '../src/validators/ajv-semver.js'
import AjvLocale from '../src/validators/ajv-locale-code.js'
import AjvUuid from '../src/validators/ajv-uuid.js'

const formatter = new Ajv.default({ allErrors: false, strict: false })

AjvUuid(formatter)
AjvLocale(formatter)
AjvSemver(formatter)
AjvCurrencyCode(formatter)

export const ajv = formatter

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

  const { Applications, Events } = grpc.loadPackageDefinition(
    loader.loadSync(path.join('.', 'protofiles/tracking.proto'), defaults),
  )

  return {
    Applications: new Applications(url, grpc.credentials.createInsecure()),
    Events: new Events(url, grpc.credentials.createInsecure()),
  }
}
