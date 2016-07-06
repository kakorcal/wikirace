exports.up = function(knex, Promise) {
  return knex.schema.table('scores', table=>{
    table.bigInteger('time');
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.table('scores', table=>{
    table.dropColumn('time');
  });  
};
