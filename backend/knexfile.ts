// Update with your config settings.
import dotenv from 'dotenv';
dotenv.config();


module.exports = {
    client: "mysql",
    connection: {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: Number(process.env.DB_PORT)
    },
    migrations: {
        tableName: "knex_migrations",
        directory: "./src/db/migrations"
    }


};
