export function up(knex) {
  return knex.schema.raw('ALTER TABLE applications DROP COLUMN IF EXISTS server_key;')
}

export function down(knex) {
  return knex.schema.raw(
    'ALTER TABLE applications ADD COLUMN IF NOT EXISTS server_key bytea NOT NULL;',
  )
}
