const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'postgres',
  password: '123abc!@#',
  port: 5432, // PostgreSQL default port
});

module.exports = pool;