import * as Sessions from '../pg/session.js'

export async function findAll(ctx) {
  ctx.res = await Sessions.findAll(ctx.req)
}

export async function count(ctx) {
  ctx.res = await Sessions.count(ctx.req)
}
