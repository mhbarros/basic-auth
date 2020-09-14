import Knex from 'knex';

export const up = (knex: Knex) => {
    return knex.schema.createTable('users_tokens', (table) => {
        table.string('uuid', 36).notNullable();
        table.string('accessToken', 255).unique().notNullable().primary();
        table.string('refreshToken', 36).unique().notNullable();
    });
}

export const down = (knex: Knex) => {
    return knex.schema.dropTable('users_tokens');
}