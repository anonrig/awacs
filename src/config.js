/* c8 ignore start */
export default {
  grpcOptions: {
    defaults: true,
    enums: String,
    keepCase: true,
    longs: String,
    oneofs: true,
  },
  grpc_port: process.env.GRPC_PORT ? parseInt(process.env.GRPC_PORT) : 4001,
  isCI: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  knex: {
    asyncStackTraces: true,
    client: 'pg',
    connection: {
      database: process.env.PGDATABASE || 'tracking',
      host: process.env.PGHOST || '0.0.0.0',
      password: process.env.PGPASSWORD || '',
      port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
      user: process.env.PGUSER || 'postgres',
    },
    migrations: {
      directory: './migrations',
      loadExtensions: ['.js'],
      tableName: 'migrations',
    },
    useNullAsDefault: false,
    version: '13',
  },
  port: process.env.PORT ? parseInt(process.env.PORT) : 3002,
}
