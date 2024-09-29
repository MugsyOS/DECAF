import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

function getEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not defined.`);
  }
  return value;
}

export default defineConfig({
  schema: 'src/conf/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: getEnvVariable('DB_PATH') || 'database.sqlite',
  },
});
