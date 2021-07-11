import grpc from '@grpc/grpc-js'

import { uuid } from '@socketkit/ajv-uuid'
import * as Clients from '../pg/client.js'

export async function findAll(ctx) {
  const { limit, cursor } = ctx.req

  if (!uuid(ctx.req.account_id)) {
    const error = new Error('Invalid account_id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  ctx.res = await Clients.findAll(ctx.req, {
    limit: limit ?? 100,
    cursor,
  })
}

export async function findOne(ctx) {
  const { account_id, application_id, client_id } = ctx.req

  if (!uuid(account_id)) {
    const error = new Error('Invalid account_id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  const row = await Clients.findOne({ account_id, application_id, client_id })

  if (row) {
    ctx.res = {
      row: {
        ...row,
        additional_properties: Object.entries(row.additional_properties).map(
          ([key, value]) => ({
            key,
            value,
          }),
        ),
      },
    }
  } else {
    ctx.res = { row: null }
  }
}
