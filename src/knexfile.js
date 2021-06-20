import config from './config.js'

export default {
  development: config.knex,
  staging: config.knex,
  production: config.knex,
}
