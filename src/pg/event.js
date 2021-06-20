import dayjs from 'dayjs'

import pg from './index.js'

export function create(
  {
    account_id,
    application_id,
    client_id,
    title,
    properties,
    created_at,
    session_started_at,
  },
  trx,
) {
  return pg
    .queryBuilder()
    .insert({
      account_id,
      application_id,
      client_id,
      title,
      properties,
      created_at: dayjs(created_at),
      session_started_at,
    })
    .into('events')
    .transacting(trx)
    .onConflict(['account_id', 'created_at'])
    .ignore()
}

export async function findAll(
  { account_id, application_id, client_id },
  { limit = 100, cursor, start_date, end_date },
) {
  const rows = await pg
    .queryBuilder()
    .select('*')
    .from('events')
    .where({ account_id })
    .andWhere(function () {
      if (application_id) {
        this.where({ application_id })
      }

      if (client_id) {
        this.where({ client_id })
      }

      if (start_date) {
        this.where('created_at', '>', start_date)
      }

      if (end_date) {
        this.where('created_at', '<=', end_date)
      }

      if (cursor) {
        const { created_at } = cursor

        if (!created_at) {
          throw new Error(`Invalid cursor for pagination`)
        }

        this.where('created_at', '<', created_at)
      }
    })
    .limit(limit)
    .orderBy('created_at', 'desc')

  return {
    rows: rows.map((row) => ({
      ...row,
      properties: Object.entries(row.properties).map(([key, value]) => ({
        key,
        value,
      })),
    })),
    cursor:
      rows.length > 0 ? { created_at: rows[rows.length - 1].created_at } : null,
  }
}
