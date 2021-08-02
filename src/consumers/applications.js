import pg from '../pg/index.js'
import * as Application from '../pg/application.js'

export async function findAll(ctx) {
  ctx.res = { rows: await Application.findAll(ctx.req) }
}

export async function count(ctx) {
  ctx.res = await Application.count(ctx.req)
}

export async function findOne(ctx) {
  ctx.res = { row: await Application.findOne(ctx.req) }
}

export async function create(ctx) {
  await pg.transaction((trx) => Application.create(ctx.req, trx))
  ctx.res = {}
}

export async function update(ctx) {
  await Application.update(ctx.req)
  ctx.res = {}
}

export async function destroy(ctx) {
  await Application.destroy(ctx.req)
  ctx.res = {}
}
