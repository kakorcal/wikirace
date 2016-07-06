exports.up = function(knex, Promise) {
  return knex.schema.createTable('scores', table=>{
    table.increments();
    table.integer('user_id').index().unsigned().references('users.id').onDelete('CASCADE');
    table.integer('opponent_id');
    table.integer('path_id');
    table.boolean('win');
    table.integer('clicks');
    table.time('time');
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('scores');  
};
