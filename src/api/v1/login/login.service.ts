import { eq } from 'drizzle-orm';
import { db } from '../../../conf/db'; // Adjust the path as needed
import { users } from '../../../conf/schema'; // Adjust the path as needed
import { verifyPassword, generateToken } from '../../../middleware/auth/authorizer';

export const login = async (username: string, password: string) => {
  const user = await db.select().from(users).where(eq(users.username, username)).get();
  if (!user) {
    return { success: false, message: 'Invalid credentials' };
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    return { success: false, message: 'Invalid credentials' };
  }

  const token = generateToken(user.id);
  return { success: true, token };
};
