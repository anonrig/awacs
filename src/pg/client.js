import pg from './index.js'

export function findOne({ account_id, application_id, client_id }, trx) {
  return pg
    .queryBuilder()
    .select('*')
    .from('clients')
    .where({ account_id, client_id, application_id })
    .transacting(trx)
    .forUpdate()
    .first()
}

export async function create(payload, trx) {
  const { account_id, application_id, client_id } = payload

  await pg
    .queryBuilder()
    .insert(payload)
    .into('clients')
    .transacting(trx)
    .onConflict(['account_id', 'application_id', 'client_id'])
    .ignore()

  // TODO: returning('*') does not work in knexjs using with
  // onConflict and ignore. Fix this later.
  return pg
    .queryBuilder()
    .select('*')
    .from('clients')
    .where({ account_id, application_id, client_id })
    .transacting(trx)
    .first()
}

export function update(client, trx) {
  const { account_id, application_id, client_id, ...properties } = client

  return pg
    .queryBuilder()
    .update(properties)
    .from('clients')
    .where({ account_id, application_id, client_id })
    .transacting(trx)
}

export async function findAll(
  { account_id, application_id },
  { limit, cursor },
) {
  const rows = await pg
    .queryBuilder()
    .select('*')
    .from('clients')
    .where({ account_id })
    .andWhere(function () {
      if (application_id) {
        this.where({ application_id })
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
      additional_properties: Object.entries(row.additional_properties).map(
        ([key, value]) => ({
          key,
          value,
        }),
      ),
    })),
    cursor:
      rows.length === limit
        ? { created_at: rows[rows.length - 1].created_at }
        : null,
  }
}
