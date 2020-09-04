import dotenv from 'dotenv';
dotenv.config();

import db from 'knex';

export default db({
    'client': 'mysql',
    version: '8.0',
    connection: {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: Number(process.env.DB_PORT)
    },
    migrations: {
        tableName: 'migrations'
    }
});