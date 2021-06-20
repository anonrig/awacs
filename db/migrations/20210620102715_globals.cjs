exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE EXTENSION IF NOT EXISTS btree_gist;
  `)
}

exports.down = function (knex) {
  return knex.schema.raw(`
    DROP EXTENSION IF EXISTS btree_gist;
  `)
}
