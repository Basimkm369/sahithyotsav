import mysql from 'mysql2/promise';
import { RowDataPacket, OkPacket } from 'mysql2';
import {
  LOCAL_DB_HOST,
  LOCAL_DB_PORT,
  LOCAL_DB_NAME,
  LOCAL_DB_PASSWORD,
  LOCAL_DB_USER,
} from 'src/config/env';

const pool = mysql.createPool({
  host: LOCAL_DB_HOST,
  port: LOCAL_DB_PORT ? parseInt(LOCAL_DB_PORT, 10) : undefined,
  user: LOCAL_DB_USER,
  password: LOCAL_DB_PASSWORD,
  database: LOCAL_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function runSelectQuery<T = any>(
  query: string,
  params?: any[]
): Promise<T[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(query, params);
  return rows as T[];
}

export async function runWriteQuery(
  query: string,
  params?: any[]
): Promise<OkPacket> {
  const [result] = await pool.execute<OkPacket>(query, params);
  return result;
}
export async function closePool() {
  await pool.end();
  console.log('MySQL pool closed.');
}
