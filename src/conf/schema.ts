import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex, check } from 'drizzle-orm/sqlite-core';

export const cats = sqliteTable('cats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const users = sqliteTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
    pinCode: text('pin_code'),
    isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
  },
  (table) => ({
    idIdx: uniqueIndex('user_id_idx').on(table.id),
    usernameIdx: uniqueIndex('user_username_idx').on(table.username),
    isAdminCheck: check('is_admin_check', sql`${table.isAdmin} IN (0, 1)`),
  }),
);
