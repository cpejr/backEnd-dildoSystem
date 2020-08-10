
exports.up = function (knex) {
  return knex.schema.createTable('orders', function (table) {
    table.increments();
    table.integer('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('payment_type').nullable();
    table.enu('status', ['pending', 'paid', 'mailed']).notNullable().defaultTo('pending');
  })
    .createTable('orders_products', function (table) {
      table.integer('order_id').notNullable();
      table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');
      table.integer('product_id').nullable();
      table.foreign('product_id').references('id').inTable('products').onDelete('SET NULL');
      table.integer('product_quantity').unsigned().notNullable();
      table.integer('subproduct_id').nullable();
      table.foreign('subproduct_id').references('id').inTable('subproducts').onDelete('SET NULL');
      table.float('price').notNullable().defaultTo(1);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('orders_products')
    .dropTable('orders');
};
