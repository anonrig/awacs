export function up(knex) {
  return knex.schema.raw(`CREATE EXTENSION IF NOT EXISTS btree_gist;`)
}

export function down(knex) {
  return knex.schema.raw(`DROP EXTENSION IF EXISTS btree_gist;`)
}
