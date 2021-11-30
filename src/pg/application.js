import { createHash, randomUUID } from 'crypto'

import grpc from '@grpc/grpc-js'

import { generateSigningKeys } from '../signing.js'

import pg from './index.js'

export function getByAuthorization({ authorization_key } = {}) {
  if (!authorization_key) {
    return Promise.reject(new Error('Missing authorization key'))
  }

  return pg.queryBuilder().select('*').from('applications').where({ authorization_key }).first()
}

export function findAll({ account_id }) {
  return pg.queryBuilder().select('*').from('applications').where({ account_id })
}

export function count({ account_id }) {
  return pg
    .queryBuilder()
    .countDistinct('application_id', { as: 'count' })
    .from('applications')
    .where({ account_id })
    .first()
}

export function findOne({ account_id, application_id }) {
  return pg
    .queryBuilder()
    .select('*')
    .from('applications')
    .where({ account_id, application_id })
    .first()
}

export function destroy({ account_id, application_id }) {
  return pg.transaction(async (trx) => {
    await pg
      .queryBuilder()
      .delete()
      .from('events')
      .where({ account_id, application_id })
      .transacting(trx)

    await pg
      .queryBuilder()
      .delete()
      .from('sessions')
      .where({ account_id, application_id })
      .transacting(trx)

    await pg
      .queryBuilder()
      .delete()
      .from('clients')
      .where({ account_id, application_id })
      .transacting(trx)

    await pg
      .queryBuilder()
      .delete()
      .from('applications')
      .where({ account_id, application_id })
      .transacting(trx)

    return {}
  })
}

export function update({ account_id, application_id, ...updated_properties }) {
  return pg
    .queryBuilder()
    .update(updated_properties)
    .from('applications')
    .where({ account_id, application_id })
}

export async function create({ account_id, application_id, title, session_timeout = 30 }, trx) {
  if (!trx) {
    throw new Error(`Missing transaction on Application.create. Postgresql transaction is required`)
  }

  if (session_timeout < 30) {
    const error = new Error(`Session timeout should be bigger than 30 seconds.`)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  const { application_key, server_key } = await generateSigningKeys()
  const authorization_key = generateAuthorizationKey()

  const [application] = await pg
    .queryBuilder()
    .insert({
      account_id,
      application_id,
      application_key,
      authorization_key,
      server_key,
      session_timeout,
      title,
    })
    .into('applications')
    .transacting(trx)
    .returning('*')

  return application
}

export function generateAuthorizationKey(random_string = randomUUID()) {
  return createHash('sha256').update(random_string).digest()
}
