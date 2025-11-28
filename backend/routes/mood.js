import express from 'express';
import { analyzeMood } from '../controllers/moodController.js';

const router = express.Router();

// POST /api/mood-analyze
// Public route (or protected if you prefer, but usually public for this feature)
router.post('/', analyzeMood);

export default router;
