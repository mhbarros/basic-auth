import Knex from 'knex';

export const up = (knex: Knex) => {
    return knex.schema.createTable('users_recover', table => {
        table.string('email', 80).notNullable();
        table.string('uuid', 36).notNullable();
        table.dateTime('created_at', {useTz: true}).defaultTo(knex.fn.now());
        table.dateTime('valid_until', {useTz: true}).notNullable();

    })
}

export const down = (knex:Knex) => {
    return knex.schema.dropTable('users_recover');
}