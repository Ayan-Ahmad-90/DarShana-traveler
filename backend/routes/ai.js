import express from 'express';
import aiController from '../controllers/aiController.js';

const router = express.Router();

router.post('/plan', aiController.generateAIPlan);

export default router;