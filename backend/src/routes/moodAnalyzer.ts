/**
 * Mood Analyzer Routes
 * API endpoints for AI mood analysis
 */

import { Router } from 'express';
import { analyzeMood, moodAnalyzerHealth } from '../controllers/moodAnalyzerController.js';

const router = Router();

/**
 * POST /api/mood-analyze
 */
router.post('/', analyzeMood);

/**
 * GET /api/mood-analyze/health
 */
router.get('/health', moodAnalyzerHealth);

export default router;
