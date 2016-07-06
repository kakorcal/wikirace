exports.up = function(knex, Promise) {
  return knex.schema.table('scores', table=>{
    table.dropColumn('opponent_id');
    table.dropColumn('path_id');
    table.dropColumn('win');
    table.dropColumn('time');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('scores', table=>{
    table.integer('opponent_id');
    table.integer('path_id');
    table.boolean('win');
    table.time('time');
  });
};
