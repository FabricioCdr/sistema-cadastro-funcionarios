import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'empresa_funcionarios',
  password: '123',
  port: 5432,
});
