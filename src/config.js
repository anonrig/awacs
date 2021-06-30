export default {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3002,
  grpc_port: process.env.GRPC_PORT ? parseInt(process.env.GRPC_PORT) : 4001,
  knex: {
    client: 'pg',
    version: '13',
    connection: {
      host: process.env.PGHOST || '0.0.0.0',
      database: process.env.PGDATABASE || 'tracking',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
      port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
    },
    migrations: {
      loadExtensions: ['.js'],
      tableName: 'migrations',
      directory: './migrations',
    },
    useNullAsDefault: false,
    asyncStackTraces: true,
  },
}
