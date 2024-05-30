/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('role').notNullable();
    table.string('name').notNullable();
    table.string('surname').notNullable();
    table.string('email').unique().notNullable();
    table.string('hashedPassword').unique().notNullable();
    table.timestamp('created_at', { useTz: false }).defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('users');
}
