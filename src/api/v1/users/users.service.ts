import { eq } from 'drizzle-orm';
import { db } from '../../../conf/db'; // Adjust the path as needed
import { users } from '../../../conf/schema'; // Adjust the path as needed
import { hashPassword } from '../../../middleware/auth/authorizer';
import { ConflictError } from '../../../utils/errors/ConflictError';

export interface IUser {
  username: string;
  password: string;
  pinCode?: string;
}

export async function registerUser(userParams: IUser) {
  const { username, password, pinCode } = userParams;
  const existingUser = await db.select().from(users).where(eq(users.username, username)).get();

  if (existingUser) {
    throw new ConflictError('Username already exists');
  }

  const hashedPassword = await hashPassword(password);
  const hashedPinCode = pinCode ? await hashPassword(pinCode) : null;

  await db.insert(users).values({
    username,
    password: hashedPassword,
    pinCode: hashedPinCode,
    isAdmin: false,
  });

  return { message: 'User registered successfully' };
}
