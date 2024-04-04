/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('urls', (table) => {
    table.increments('id').primary();
    table.string('code').unique().notNullable();
    table.string('name').unique().notNullable();
    table.string('originalUrl').notNullable();
    table.integer('visits').defaultTo(0);
    table.string('shortLink').notNullable();
    table.timestamp('created_at', { useTz: false }).defaultTo(knex.fn.now());
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('urls');
}
