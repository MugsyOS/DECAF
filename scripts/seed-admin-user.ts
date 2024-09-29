import dotenv from 'dotenv';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { users } from '../src/conf/schema'; // Import your Drizzle schema
import { eq } from 'drizzle-orm';
import { hashPassword } from '../src/middleware/auth/authorizer';

dotenv.config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword';
const ADMIN_PIN_CODE = process.env.ADMIN_PIN_CODE || '1234';

async function seedAdminUser() {
  const dbPath = process.env.DB_PATH || 'database.sqlite';
  const sqlite = new Database(dbPath);
  const db: BetterSQLite3Database = drizzle(sqlite);

  try {
    const existingAdmin = await db.select().from(users).where(eq(users.username, ADMIN_USERNAME)).get();

    if (existingAdmin) {
      console.log('Admin user already exists. Skipping seeding.');
      return;
    }

    const hashedPassword = await hashPassword(ADMIN_PASSWORD);

    await db
      .insert(users)
      .values({
        username: ADMIN_USERNAME,
        password: hashedPassword,
        pinCode: ADMIN_PIN_CODE,
        isAdmin: true,
      })
      .run();

    console.log('Admin user seeded successfully.');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await sqlite.close();
  }
}

seedAdminUser().catch(console.error);
