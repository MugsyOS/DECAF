import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DB_PATH || 'database.sqlite';
const sqlite = new Database(dbPath);

export const db: BetterSQLite3Database = drizzle(sqlite);
