import dayjs from 'dayjs'

import pg from './index.js'

export async function findOrCreate(
  { account_id, application_id, client_id, timestamp },
  trx,
) {
  if (!application_id || !account_id) {
    throw new error(`Account or application id is missing`)
  }

  const application = await pg
    .queryBuilder()
    .select('session_timeout')
    .from('applications')
    .where({ application_id, account_id })
    .first()

  if (!application) {
    throw new Error(
      `Application ${application_id} on account ${account_id} not found`,
    )
  }

  const [session] = await pg
    .queryBuilder()
    .from('sessions')
    .where({ account_id, application_id, client_id })
    .andWhereRaw(`active_period @> ?::timestamptz`, [dayjs(timestamp).toDate()])
    .update({
      expired_at: dayjs(timestamp)
        .add(application.session_timeout ?? 30, 'minutes')
        .toDate(),
    })
    .transacting(trx)
    .returning('*')

  if (session) {
    return session
  }

  const [new_session] = await pg
    .queryBuilder()
    .insert({
      account_id,
      application_id,
      client_id,
      started_at: dayjs(timestamp).toDate(),
      expired_at: dayjs(timestamp)
        .add(application.session_timeout ?? 30, 'minutes')
        .toDate(),
    })
    .into('sessions')
    .transacting(trx)
    .returning('*')

  return new_session
}

export async function findAll(
  { account_id, application_id, client_id },
  { limit, cursor },
) {
  const rows = await pg
    .queryBuilder()
    .select('*')
    .from('sessions')
    .where({ account_id })
    .andWhere(function () {
      if (application_id) {
        this.where({ application_id })
      }

      if (client_id) {
        this.where({ client_id })
      }

      if (cursor) {
        const { expired_at } = cursor

        if (!expired_at) {
          throw new Error(`Invalid cursor for pagination`)
        }

        this.where('expired_at', '<', dayjs(expired_at).toDate())
      }
    })
    .limit(limit)
    .orderBy('expired_at', 'desc')

  return {
    rows,
    cursor:
      rows.length === limit
        ? { expired_at: rows[rows.length - 1].expired_at }
        : null,
  }
}
