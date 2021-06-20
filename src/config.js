export default {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3002,
  grpc_port: process.env.GRPC_PORT ? parseInt(process.env.GRPC_PORT) : 4001,
  sentry: process.env.SENTRY_DSN,
  knex: {
    client: 'pg',
    version: '13',
    connection: {
      database: 'tracking',
      user: 'tracking-worker',
    },
    useNullAsDefault: false,
    asyncStackTraces: true,
  },
}
