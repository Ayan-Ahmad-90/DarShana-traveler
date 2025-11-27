/**
 * Mood Analyzer Routes
 * API endpoints for AI mood analysis
 */

import { Router } from 'express';
import { analyzeMood, moodAnalyzerHealth } from '../controllers/moodAnalyzerController';

const router = Router();

/**
 * POST /api/mood-analyze
 * Analyzes facial emotions from image and recommends destinations
 *
 * Request body:
 * {
 *   imageData: "base64 encoded image",
 *   imageUrl: "optional image URL"
 * }
 *
 * Response:
 * {
 *   detectedMood: string,
 *   confidence: number 0-1,
 *   emotions: { happy, sad, angry, surprised, neutral, fear, disgust },
 *   energyLevel: 1-10,
 *   socialScore: 1-10,
 *   adventureScore: 1-10,
 *   reasoning: string,
 *   recommendedKeys: string[]
 * }
 */
router.post('/', analyzeMood);

/**
 * GET /api/mood-analyze/health
 * Health check endpoint
 */
router.get('/health', moodAnalyzerHealth);

export default router;
