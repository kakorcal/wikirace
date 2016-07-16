module.exports = {
  development: {
    client: 'pg',
    debug: true,
    connection: {database: 'wikirace'},
    migrations: {directory: './db/migrations'},
    seeds: {directory: './db/seeds'}
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'      
    }
  }
};