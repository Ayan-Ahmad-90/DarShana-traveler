import { Router } from 'express';
import { SmartPlannerController } from '../controllers/smartPlannerController.js';

const router = Router();

router.get('/suggestions', SmartPlannerController.getSuggestions);

export default router;
