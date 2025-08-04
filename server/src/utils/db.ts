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

let pool: sql.ConnectionPool;
let connectingPromise: Promise<void> | null = null;

export async function connectToDatabase() {
  if (pool && pool.connected) return;
  if (connectingPromise) return connectingPromise;
  connectingPromise = (async () => {
    try {
      pool = new sql.ConnectionPool(config);
      await pool.connect();
      console.log('SQL Server connection pool established.');
    } catch (err) {
      console.error('Database connection failed:', err);
      process.exit(1);
    } finally {
      connectingPromise = null;
    }
  })();
  return connectingPromise;
}

export async function executeQuery(queryText: string) {
  if (!pool || !pool.connected) {
    await connectToDatabase();
  }
  try {
    const request = pool.request();
    const result = await request.query(queryText);
    return result.recordset;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
}

export async function executeStoredProcedure(
  procedureName: string,
  params: { [key: string]: any },
) {
  if (!pool || !pool.connected) {
    await connectToDatabase();
  }
  try {
    const request = pool.request();
    for (const key in params) {
      request.input(key, params[key]);
    }
    const result = await request.execute(procedureName);
    return result.recordset;
  } catch (err) {
    console.error('Error executing stored procedure:', err);
    throw err;
  }
}

export async function decryptId(text: string): Promise<string> {
  if (!text) throw new Error(`Empty ID`);
  const idRes = await executeStoredProcedure('Usp_DecryptIdKey', {
    EncryptedTxt: text.replaceAll(' ', '+'),
  });
  const id = idRes?.[0]?.ID;
  if (!id) throw new Error(`Invalid ID, Encr:${text} Decr:${id}`);
  return id;
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
