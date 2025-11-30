/**
 * Mood Analyzer Controller
 * Handles POST /api/mood-analyze requests
 *
 * Request format:
 * {
 *   imageData: "base64 encoded image or URL",
 *   imageUrl?: "optional URL alternative"
 * }
 *
 * Response format:
 * {
 *   detectedMood: string,
 *   confidence: number,
 *   emotions: {...},
 *   energyLevel: number,
 *   socialScore: number,
 *   adventureScore: number,
 *   reasoning: string,
 *   recommendedKeys: string[]
 * }
 */

import type { Request, Response } from 'express';
import type { MoodAnalyzeRequest, MoodAnalyzeResponse, EmotionScores } from '../types/moodAnalyzer';
import { processMoodAnalysis, validateEmotions } from '../services/emotionService';

/**
 * Mock emotion detection (for testing without GPU)
 * In production, replace with actual face-api.js or TensorFlow.js call
 */
function generateMockEmotions(): EmotionScores {
  // Generate realistic emotion variations
  const patterns = [
    { happy: 0.8, sad: 0.05, angry: 0, surprised: 0.1, neutral: 0.05, fear: 0, disgust: 0 },
    { happy: 0.3, sad: 0.1, angry: 0.1, surprised: 0.2, neutral: 0.3, fear: 0, disgust: 0 },
    { happy: 0.2, sad: 0.3, angry: 0.1, surprised: 0, neutral: 0.4, fear: 0, disgust: 0 },
    { happy: 0.6, sad: 0, angry: 0, surprised: 0.3, neutral: 0.1, fear: 0, disgust: 0 },
    { happy: 0.1, sad: 0.2, angry: 0, surprised: 0, neutral: 0.7, fear: 0, disgust: 0 },
  ];

  return patterns[Math.floor(Math.random() * patterns.length)];
}

/**
 * Mock emotion detection from image
 * Simulates face-api.js or TensorFlow analysis
 *
 * In production, implement actual emotion detection:
 * - Use face-api.js on server (requires models)
 * - Or use external API (Google Vision, AWS Rekognition, Microsoft Face API)
 * - Or send to client for detection and send results
 */
async function detectEmotionsFromImage(_imageData: string): Promise<EmotionScores> {
  // Placeholder for actual emotion detection
  // This would use face-api.js or external service

  // For now, return mock emotions for demonstration
  return generateMockEmotions();

  // Production implementation example:
  // const client = new vision.ImageAnnotatorClient();
  // const response = await client.faceDetection(imageData);
  // const faces = response[0].faceAnnotations;
  // return convertFaceAnnotationsToEmotions(faces);
}

/**
 * POST /api/mood-analyze
 * Analyzes facial emotions and recommends destinations
 */
export async function analyzeMood(req: Request, res: Response): Promise<void> {
  try {
    console.log('\n📥 ===== MOOD ANALYZER REQUEST RECEIVED =====');
    console.log('🌐 Headers:', req.headers);
    console.log('📦 Body keys:', Object.keys(req.body));
    
    const { imageData, imageUrl } = req.body as MoodAnalyzeRequest;

    // Validate input
    if (!imageData && !imageUrl) {
      console.warn('❌ Missing imageData or imageUrl');
      res.status(400).json({
        error: 'Missing imageData or imageUrl in request body',
      });
      return;
    }

    console.log('✅ Image data received');
    console.log(`📏 Data size: ${imageData ? imageData.length : 0} bytes`);

    // Limit image data size (5MB)
    if (imageData && imageData.length > 5 * 1024 * 1024) {
      console.warn('❌ Image too large');
      res.status(400).json({
        error: 'Image data too large (max 5MB)',
      });
      return;
    }

    // Detect emotions from image
    const imageToAnalyze = imageData || imageUrl;
    if (!imageToAnalyze) {
      console.warn('❌ No valid image data');
      res.status(400).json({
        error: 'Invalid image data provided',
      });
      return;
    }

    console.log('🔍 Detecting emotions...');
    let emotions: EmotionScores;
    try {
      emotions = await detectEmotionsFromImage(imageToAnalyze);
      console.log('✅ Emotions detected:', emotions);
    } catch (detectionError) {
      const errorMsg = detectionError instanceof Error ? detectionError.message : 'Unknown error';
      console.error('❌ Emotion detection error:', errorMsg);

      // Fallback to mock for demo
      console.log('📊 Using mock emotions for demo');
      emotions = generateMockEmotions();
      console.log('✅ Mock emotions:', emotions);
    }

    // Validate emotions
    if (!validateEmotions(emotions)) {
      console.warn('❌ Invalid emotion data');
      res.status(400).json({
        error: 'Invalid emotion data received from detector',
      });
      return;
    }

    // Process mood analysis
    console.log('🎯 Processing mood analysis...');
    const analysis = processMoodAnalysis(emotions);
    console.log('✅ Analysis complete:', analysis.detectedMood);

    // Return result
    console.log('📤 Sending response...\n');
    res.json(analysis);
  } catch (error) {
    console.error('❌ Mood analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze mood. Please try again.',
    });
  }
}

/**
 * GET /api/mood-analyze/health
 * Health check endpoint for mood analyzer service
 */
export async function moodAnalyzerHealth(_req: Request, res: Response): Promise<void> {
  try {
    // Check if emotion service is operational
    const testEmotions: EmotionScores = {
      happy: 0.5,
      sad: 0.1,
      angry: 0,
      surprised: 0.3,
      neutral: 0.1,
      fear: 0,
      disgust: 0,
    };

    const result = processMoodAnalysis(testEmotions);

    res.json({
      status: 'healthy',
      service: 'mood-analyzer',
      testResult: {
        detectedMood: result.detectedMood,
        confidence: result.confidence,
      },
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Mood analyzer service failed',
    });
  }
}
