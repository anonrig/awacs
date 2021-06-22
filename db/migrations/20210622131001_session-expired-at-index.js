export function up(knex) {
  return knex.schema.alterTable('sessions', function (t) {
    t.index(['account_id', 'expired_at'], 'sessions_expired_at_idx')
  })
}

export function down(knex) {
  return knex.schema.alterTable('sessions', function (t) {
    t.dropIndex(['account_id', 'expired_at'], 'sessions_expired_at_idx')
  })
}
