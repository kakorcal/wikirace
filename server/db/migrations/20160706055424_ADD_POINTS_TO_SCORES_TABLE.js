exports.up = function(knex, Promise) {
  return knex.schema.table('scores', table=>{
    table.bigInteger('points');
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.table('scores', table=>{
    table.dropColumn('points');
  });  
};
