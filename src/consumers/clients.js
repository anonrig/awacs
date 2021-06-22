import { validate } from 'uuid'
import grpc from '@grpc/grpc-js'
import * as Clients from '../pg/client.js'

export async function findAll(ctx) {
  const { limit, cursor } = ctx.req

  if (!validate(ctx.req.account_id)) {
    const error = new Error('Invalid account_id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  ctx.res = await Clients.findAll(ctx.req, {
    limit: limit ?? 100,
    cursor,
  })
}
