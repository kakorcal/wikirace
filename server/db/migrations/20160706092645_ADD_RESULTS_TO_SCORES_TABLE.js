exports.up = function(knex, Promise) {
  return knex.schema.table('scores', table=>{
    table.string('result');
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.table('scores', table=>{
    table.dropColumn('result');
  });  
};
