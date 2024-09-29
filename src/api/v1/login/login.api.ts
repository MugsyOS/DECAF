import express from 'express';
import { login } from './login.service';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await login(username, password);
    res.json({ ...token });
  } catch (err) {
    if ((err as Error).message === 'Invalid credentials') {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
});

// export const login = async (req: Request, res: Response) => {
//   const { username, password } = req.body;

//   try {
//     const user = await db.select().from(users).where(eq(users.username, username)).get();

//     if (!user || !(await verifyPassword(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = generateToken(user.id);
//     res.json({ token });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const createUser = async (req: Request, res: Response) => {
//   const { username, password, pinCode, isAdmin = false } = req.body;

//   try {
//     const existingUser = await db.select().from(users).where(eq(users.username, username)).get();
//     if (existingUser) {
//       return res.status(400).json({ message: 'Username already exists' });
//     }

//     const hashedPassword = await hashPassword(password);

//     const newUser = await db
//       .insert(users)
//       .values({
//         username,
//         password: hashedPassword,
//         pinCode,
//         isAdmin,
//       })
//       .returning()
//       .get();

//     const token = generateToken(newUser.id);
//     res.status(201).json({ message: 'User created successfully', token });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

export default router;
