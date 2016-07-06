exports.up = function(knex, Promise) {
  return knex.schema.table('paths', table=>{
    table.integer('score_id').index().unsigned().references('scores.id').onDelete('CASCADE');
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.table('paths', table=>{
    table.dropColumn('score_id');
  });  
};
