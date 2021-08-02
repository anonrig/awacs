import * as Events from '../pg/event.js'

export async function findAll(ctx) {
  ctx.res = await Events.findAll(ctx.req)
}

export async function count(ctx) {
  ctx.res = await Events.count(ctx.req)
}
