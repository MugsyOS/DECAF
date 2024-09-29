import express from 'express';
import { authenticateToken } from '../../../middleware/auth/authorizer';
import { getAllCats, getCatById, createCat, getCatByName } from './cats.service';

const router = express.Router();
router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const result = await getAllCats();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cats' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, type } = req.body;
    const result = await createCat(name, type);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error creating cat' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getCatById(id);
    if (!result) {
      res.status(404).json({ error: 'Cat not found' });
    } else {
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cat' });
  }
});

router.get('/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const result = await getCatByName(name);
    if (!result) {
      res.status(404).json({ error: 'Cat not found' });
    } else {
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cat' });
  }
});

export default router;
