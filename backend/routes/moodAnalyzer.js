const express = require('express');
const router = express.Router();
const { analyzeMood, moodAnalyzerHealth } = require('../controllers/moodAnalyzerController');

/**
 * @route POST /api/mood-analyze
 * @desc Analyze mood from facial image
 * @access Public
 */
router.post('/', analyzeMood);

/**
 * @route GET /api/mood-analyze/health
 * @desc Health check for mood analyzer
 * @access Public
 */
router.get('/health', moodAnalyzerHealth);

module.exports = router;