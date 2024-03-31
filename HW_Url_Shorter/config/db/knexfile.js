import knex from 'knex';
import { Model } from 'objection';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const knexConfig = {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
  migrations: {
    directory: path.join(__dirname, '..', '..', 'migrations'),
    tableName: 'knex_migrations',
  },
  debug: true,
}

const client = knex(knexConfig);

Model.knex(client);

export default knexConfig;
