import * as Sessions from '../pg/session.js'

export async function findAll(ctx) {
  const { limit, cursor } = ctx.req

  ctx.res = await Sessions.findAll(ctx.req, {
    limit: limit ?? 100,
    cursor,
  })
}
