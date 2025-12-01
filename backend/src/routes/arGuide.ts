import { Router } from 'express';
import { analyzeARScene } from '../controllers/arGuideController';

const router = Router();

router.post('/', analyzeARScene);

export default router;
