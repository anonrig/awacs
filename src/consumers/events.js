import { validate } from 'uuid'
import grpc from '@grpc/grpc-js'
import * as Events from '../pg/event.js'

export async function findAll(ctx) {
  const { limit, cursor, start_date, end_date } = ctx.req

  if (!validate(ctx.req.account_id)) {
    const error = new Error('Invalid account_id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  ctx.res = await Events.findAll(ctx.req, {
    limit,
    cursor,
    start_date,
    end_date,
  })
}
