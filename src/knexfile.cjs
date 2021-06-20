module.exports = {
  development: {
    client: 'pg',
    version: '13',
    connection: {
      database: 'tracking',
      user: 'postgres',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: '../db/migrations',
    },
  },

  staging: {
    client: 'pg',
    version: '13',
    connection: {
      database: 'tracking',
      user: 'tracking-worker',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: '../db/migrations',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: 'pg',
    version: '13',
    connection: {
      database: 'tracking',
      user: 'tracking-worker',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: '../db/migrations',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
}
