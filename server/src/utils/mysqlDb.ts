import mysql from 'mysql2/promise';
import { RowDataPacket, OkPacket } from 'mysql2';
import {
  MYSQL_DB_HOST,
  MYSQL_DB_PORT,
  MYSQL_DB_NAME,
  MYSQL_DB_PASSWORD,
  MYSQL_DB_USER,
} from 'src/config/env';

const pool = mysql.createPool({
  host: MYSQL_DB_HOST,
  port: MYSQL_DB_PORT ? parseInt(MYSQL_DB_PORT, 10) : undefined,
  user: MYSQL_DB_USER,
  password: MYSQL_DB_PASSWORD,
  database: MYSQL_DB_NAME,
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
