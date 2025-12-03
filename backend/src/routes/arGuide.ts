import { Router } from 'express';
import { analyzeARScene } from '../controllers/arGuideController.js';

const router = Router();

router.post('/', analyzeARScene);

export default router;
