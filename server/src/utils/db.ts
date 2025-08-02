import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from 'src/config/env';
import sql from 'mssql';

const config = {
  user: DB_USER ?? '',
  password: DB_PASSWORD ?? '',
  server: DB_HOST ?? '',
  database: DB_NAME ?? '',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: any;
export async function connectToDatabase() {
  try {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('SQL Server connection pool established.');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit if connection fails
  }
}

export async function executeQuery(queryText: string) {
  try {
    if (!pool) {
      throw new Error('Database pool not initialized.');
    }
    const request = pool.request();
    const result = await request.query(queryText);
    return result.recordset;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
}

export async function closePool() {
  if (!!pool) {
    await pool.close();
    console.log('SQL Server connection pool closed.');
  }
}

// Call closePool() when your application is shutting down, e.g., on process exit.
// process.on('SIGINT', closePool);
// process.on('SIGTERM', closePool);
