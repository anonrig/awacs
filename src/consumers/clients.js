import * as Clients from '../pg/client.js'

export async function findAll(ctx) {
  const { limit, cursor } = ctx.req

  ctx.res = await Clients.findAll(ctx.req, {
    limit: limit ?? 100,
    cursor,
  })
}

export async function count(ctx) {
  ctx.res = await Clients.count(ctx.req)
}

export async function findOne(ctx) {
  const row = await Clients.findOne(ctx.req)

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
