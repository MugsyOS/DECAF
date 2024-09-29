import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function generateTestToken() {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const userPayload = { id: 'test-user-id' }; // Match the expected structure

  return jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });
}
