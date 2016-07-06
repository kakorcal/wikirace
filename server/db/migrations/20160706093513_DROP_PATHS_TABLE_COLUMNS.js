exports.up = function(knex, Promise) {
  return knex.schema.table('paths', table=>{
    table.dropColumn('user_id');
    table.dropColumn('start');
    table.dropColumn('end');
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.table('paths', table=>{
    table.integer('user_id').index().unsigned().references('users.id').onDelete('CASCADE');
    table.text('start');
    table.text('end');
  });  
};
