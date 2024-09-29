import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../../conf/db';
import { users } from '../../conf/schema';

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    isAdmin: boolean;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret is not defined' });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { id: string };
    const user = await db.select().from(users).where(eq(users.id, decoded.id)).get();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const generateToken = (userId: string): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT secret is not defined');
  }
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
