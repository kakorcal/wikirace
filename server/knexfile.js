module.exports = {
  development: {
    client: 'pg',
    debug: true,
    connection: {database: 'wikirace'},
    migrations: {directory: './db/migrations'},
    seeds: {directory: './db/seeds'}
  }
};