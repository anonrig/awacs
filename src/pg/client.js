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

export function create(payload, trx) {
  return pg
    .queryBuilder()
    .insert(payload)
    .into('clients')
    .transacting(trx)
    .returning('*')
}

export function update(client, trx) {
  const primary_keys = new Map([
    ['account_id', 'application_id', 'client_id'].map((key) => [
      key,
      client.key,
    ]),
  ])

  return pg
    .queryBuilder()
    .update(client)
    .from('clients')
    .where(primary_keys)
    .transacting(trx)
}
