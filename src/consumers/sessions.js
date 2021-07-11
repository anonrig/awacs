import { uuid } from '@socketkit/ajv-uuid'
import grpc from '@grpc/grpc-js'
import * as Sessions from '../pg/session.js'

export async function findAll(ctx) {
  const { limit, cursor } = ctx.req

  if (!uuid(ctx.req.account_id)) {
    const error = new Error('Invalid account_id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  ctx.res = await Sessions.findAll(ctx.req, {
    limit: limit ?? 100,
    cursor,
  })
}
