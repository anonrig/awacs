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
