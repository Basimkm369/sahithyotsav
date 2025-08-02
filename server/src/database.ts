// import { Database } from './types.ts'; // this is the Database interface we defined earlier
// import { Pool } from 'pg';
// import { Kysely, PostgresDialect } from 'kysely';
// import { DB_URL } from './config/env.js';

// const dialect = new PostgresDialect({
//   pool: new Pool({
//     URL: DB_URL,
//   }),
// });

// // Database interface is passed to Kysely's constructor, and from now on, Kysely
// // knows your database structure.
// // Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// // to communicate with your database.
// export const db = new Kysely<Database>({
//   dialect,
// });
