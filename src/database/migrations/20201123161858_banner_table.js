
exports.up = function(knex) {
  return knex.schema.createTable('banner', function (table) {
    table.string('id').primary().notNullable();
    table.string('image_id').notNullable();
    table.integer('position').notNullable();
    table.string('link').notNullable();
});
};

exports.down = function(knex) {
  return knex.schema.dropTable('banner');
};
