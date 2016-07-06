exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table=>{
    table.increments();
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.text('thumbnail_url');
    table.bigInteger('1p_score');
    table.bigInteger('2p_score');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
