import Knex from 'knex';

export const up = (knex: Knex) => {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary().unique().notNullable();
        table.string('name', 60).notNullable();
        table.string('username', 60).notNullable().unique();
        table.string('password', 60).notNullable();
        table.string('email', 80).notNullable().unique();
        table.string('gender', 1);
        table.string('uuid', 36).notNullable().unique();
        table.timestamps();
    });
}

export const down = (knex: Knex) => {
    return knex.schema.dropTable('users');
}