import express, { Request, Response, NextFunction } from 'express';
import { authenticateToken, requireAdmin } from '../../../middleware/auth/authorizer';
import { registerUser } from './users.service';

const router = express.Router();
router.use(authenticateToken, requireAdmin);

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ...userDetails } = req.body;
    const result = await registerUser(userDetails);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
