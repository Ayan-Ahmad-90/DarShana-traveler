/**
 * Mood Analyzer Controller
 * Handles POST /api/mood-analyze requests
 */

import type { Request, Response } from 'express';
import type { MoodAnalyzeRequest, MoodAnalyzeResponse, EmotionScores } from '../types/moodAnalyzer';

/**
 * Mock emotion detection
 */
function generateMockEmotions(): EmotionScores {
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
 * POST /api/mood-analyze
 */
export async function analyzeMood(req: Request, res: Response): Promise<void> {
  try {
    console.log('\n ===== MOOD ANALYZER REQUEST RECEIVED =====');
    
    const { imageData, imageUrl } = req.body as MoodAnalyzeRequest;

    if (!imageData && !imageUrl) {
      res.status(400).json({ error: 'Missing imageData or imageUrl' });
      return;
    }

    // Mock Analysis
    const emotions = generateMockEmotions();
    
    // Determine dominant emotion
    let dominantEmotion = 'neutral';
    let maxScore = 0;
    for (const [emotion, score] of Object.entries(emotions)) {
      if (score > maxScore) {
        maxScore = score;
        dominantEmotion = emotion;
      }
    }

    // Calculate scores
    const energyLevel = Math.min(10, Math.round((emotions.happy + emotions.surprised + emotions.angry) * 10));
    const socialScore = Math.min(10, Math.round((emotions.happy + emotions.neutral) * 10));
    const adventureScore = Math.min(10, Math.round((emotions.surprised + emotions.fear) * 10));

    // Recommendations based on mood
    const recommendations: Record<string, string[]> = {
      happy: ['beach', 'party', 'festival'],
      sad: ['nature', 'quiet', 'retreat'],
      angry: ['adventure', 'hiking', 'sports'],
      surprised: ['city', 'exploration', 'museum'],
      neutral: ['park', 'cafe', 'library'],
      fear: ['home', 'safe', 'guided'],
      disgust: ['clean', 'luxury', 'spa']
    };

    const response: MoodAnalyzeResponse = {
      detectedMood: dominantEmotion,
      confidence: maxScore,
      emotions,
      energyLevel,
      socialScore,
      adventureScore,
      reasoning: `Based on your ${dominantEmotion} expression, we recommend these destinations.`,
      recommendedKeys: recommendations[dominantEmotion] || ['general']
    };

    console.log(' Analysis complete:', dominantEmotion);
    res.json(response);

  } catch (error) {
    console.error(' Mood analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze mood',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function moodAnalyzerHealth(req: Request, res: Response): Promise<void> {
  res.json({ status: 'Mood Analyzer is running', timestamp: new Date().toISOString() });
}
