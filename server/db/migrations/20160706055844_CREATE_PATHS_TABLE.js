exports.up = function(knex, Promise) {
  return knex.schema.createTable('paths', table=>{
    table.increments();
    table.integer('user_id').index().unsigned().references('users.id').onDelete('CASCADE');
    table.text('start');
    table.text('end');
    table.text('path');
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('paths');
};
