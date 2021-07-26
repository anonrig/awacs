import * as Events from '../pg/event.js'

export async function findAll(ctx) {
  const { limit, cursor, start_date, end_date } = ctx.req

  ctx.res = await Events.findAll(ctx.req, {
    limit: limit ?? 100,
    cursor,
    start_date,
    end_date,
  })
}
