import grpc from '@grpc/grpc-js'

import * as Validate from '../validators/validate.js'
import pg from '../pg/index.js'
import * as Application from '../pg/application.js'

export async function findAll(ctx) {
  const { account_id } = ctx.req

  if (!Validate.uuid(account_id)) {
    const error = new Error('Invalid account_id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  ctx.res = { rows: await Application.findAll({ account_id }) }
}

export async function findOne(ctx) {
  const { account_id, application_id } = ctx.req

  if (!Validate.uuid(account_id)) {
    const error = new Error('Invalid account_id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  ctx.res = { row: await Application.findOne({ account_id, application_id }) }
}

export async function create(ctx) {
  if (!Validate.uuid(ctx.req.account_id)) {
    const error = new Error('Invalid account_id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  await pg.transaction((trx) => Application.create(ctx.req, trx))

  ctx.res = {}
}

export async function update(ctx) {
  if (!Validate.uuid(ctx.req.account_id)) {
    const error = new Error('Invalid account_id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  await Application.update(ctx.req)

  ctx.res = {}
}

export async function destroy(ctx) {
  const { account_id, application_id } = ctx.req

  if (!Validate.uuid(account_id)) {
    const error = new Error('Invalid account_id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  await Application.destroy({ account_id, application_id })

  ctx.res = {}
}
