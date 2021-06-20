module.exports = {
  development: {
    client: 'pg',
    version: '13',
    connection: {
      database: 'tracking',
      user: 'postgres',
      password: 'tracking-password',
    },
    migrations: {
      extension: 'mjs',
      tableName: 'knex_migrations',
    },
  },

  staging: {
    client: 'pg',
    version: '13',
    connection: {
      database: 'tracking',
      user: 'postgres',
      password: 'tracking-password',
    },
    migrations: {
      tableName: 'knex_migrations',
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
      user: 'postgres',
      password: 'tracking-password',
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
}
