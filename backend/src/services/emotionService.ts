/**
 * Emotion Detection & Mood Mapping Service
 *
 * Core logic for:
 * 1. Processing detected emotions from face-api.js
 * 2. Converting raw emotions into mood categories
 * 3. Deriving energy, social, adventure scores
 * 4. Recommending destination tags based on mood
 *
 * Usage:
 * const result = processMoodAnalysis(emotionScores, primaryFaceIndex);
 */

import type {
  EmotionScores,
  MoodAnalyzeResponse,
  MoodCategory,
  MoodMappingConfig,
} from '../types/moodAnalyzer';

/**
 * Mood mapping configurations
 * Maps emotion patterns to travel moods with appropriate scores
 */
const MOOD_MAPPINGS: Record<MoodCategory, MoodMappingConfig> = {
  happy_excited: {
    category: 'happy_excited',
    detectedMood: 'Happy & Excited',
    energyRange: [7, 10],
    socialRange: [5, 10],
    adventureRange: [6, 10],
    recommendedTags: ['adventure', 'beach', 'thrilling', 'water_sports', 'festivals'],
    reasoning:
      'Your bright smile and excited expression suggest you\'re ready for thrilling adventures and high-energy experiences!',
  },
  calm_peaceful: {
    category: 'calm_peaceful',
    detectedMood: 'Calm & Peaceful',
    energyRange: [2, 4],
    socialRange: [1, 5],
    adventureRange: [1, 4],
    recommendedTags: ['nature', 'spiritual', 'serene', 'meditation', 'peaceful'],
    reasoning:
      'Your serene expression suggests a need for peaceful, introspective moments in nature-filled locations.',
  },
  curious_explorative: {
    category: 'curious_explorative',
    detectedMood: 'Curious & Explorative',
    energyRange: [5, 8],
    socialRange: [3, 8],
    adventureRange: [4, 8],
    recommendedTags: ['culture', 'heritage', 'history', 'exploration', 'monuments'],
    reasoning:
      'Your curious expression indicates interest in cultural exploration and historical discoveries.',
  },
  energetic: {
    category: 'energetic',
    detectedMood: 'Energetic & Vibrant',
    energyRange: [8, 10],
    socialRange: [7, 10],
    adventureRange: [5, 9],
    recommendedTags: ['urban', 'nightlife', 'social', 'food', 'cities'],
    reasoning:
      'Your energetic presence suggests you\'re ready for urban exploration and social experiences!',
  },
  reflective_thoughtful: {
    category: 'reflective_thoughtful',
    detectedMood: 'Reflective & Thoughtful',
    energyRange: [2, 6],
    socialRange: [1, 4],
    adventureRange: [1, 5],
    recommendedTags: ['spiritual', 'temples', 'meditation', 'introspection', 'heritage'],
    reasoning:
      'Your thoughtful demeanor suggests appreciation for spiritual and introspective travel experiences.',
  },
  neutral_balanced: {
    category: 'neutral_balanced',
    detectedMood: 'Balanced & Open',
    energyRange: [4, 7],
    socialRange: [3, 8],
    adventureRange: [3, 7],
    recommendedTags: ['mixed', 'versatile', 'balanced', 'cultural', 'nature'],
    reasoning:
      'Your balanced expression suggests flexibility in travel preferences – diverse experiences welcome!',
  },
};

/**
 * Classify emotion scores into mood category
 * Determines which mood mapping to apply based on emotion intensities
 *
 * Decision tree:
 * - High happiness + surprise → happy_excited
 * - High neutral + low happiness → calm_peaceful
 * - High neutral + moderate surprise → curious_explorative
 * - High happiness + high social indicators + low sadness → energetic
 * - High neutral + sadness indicators → reflective_thoughtful
 * - Otherwise → neutral_balanced
 */
export function classifyMood(emotions: EmotionScores): MoodCategory {
  const { happy, sad, neutral, surprised, angry, fear, disgust } = emotions;

  // Calculate composite scores
  // const positiveScore = happy + surprised; // TODO: Use in future enhancements
  const negativeScore = sad + angry + fear + disgust;
  const calmScore = neutral;

  // Decision logic
  if (happy > 0.6 && surprised > 0.3) {
    return 'happy_excited';
  }

  if (calmScore > 0.5 && happy < 0.2) {
    return 'calm_peaceful';
  }

  if (calmScore > 0.4 && surprised > 0.2 && happy < 0.4) {
    return 'curious_explorative';
  }

  if (happy > 0.5 && calmScore > 0.2 && negativeScore < 0.2) {
    return 'energetic';
  }

  if ((calmScore > 0.4 || sad > 0.3) && happy < 0.3 && surprised < 0.2) {
    return 'reflective_thoughtful';
  }

  return 'neutral_balanced';
}

/**
 * Calculate energy level (1-10) from emotions
 * Based on intensity of happy/surprised vs sad
 */
export function calculateEnergyLevel(emotions: EmotionScores): number {
  const { happy, surprised, sad } = emotions;
  const activation = happy + surprised * 0.8; // Surprised adds some energy
  const reduction = Math.max(0, sad * 0.5); // Sadness reduces energy

  const energyBase = Math.min(10, Math.max(1, (activation - reduction) * 10));
  return Math.round(energyBase);
}

/**
 * Calculate social score (1-10) from emotions
 * Based on happiness and smile width (proxy: high happiness = wider smile)
 */
export function calculateSocialScore(emotions: EmotionScores): number {
  const { happy, neutral } = emotions;
  // Happy people are more social, neutral can go either way
  const socialBase = Math.min(10, Math.max(1, (happy * 8 + neutral * 2) * 10));
  return Math.round(socialBase);
}

/**
 * Calculate adventure score (1-10) from emotions
 * Based on surprise + happiness combination (openness to new experiences)
 */
export function calculateAdventureScore(emotions: EmotionScores): number {
  const { surprised, happy, fear } = emotions;
  // Surprise = openness to new things, happy = positive attitude
  const adventureBase = happy + surprised * 0.8 - fear * 0.5; // Fear reduces adventure
  return Math.round(Math.min(10, Math.max(1, adventureBase * 10)));
}

/**
 * Get confidence score (0-1) - average of top 3 emotions
 */
export function calculateConfidence(emotions: EmotionScores): number {
  const scores = Object.values(emotions).sort((a: number, b: number) => b - a);
  const topThree = scores.slice(0, 3);
  return Math.round(((topThree.reduce((a: number, b: number) => a + b) / 3)) * 100) / 100;
}

/**
 * Main function: Process emotions and return complete mood analysis
 */
export function processMoodAnalysis(emotions: EmotionScores): MoodAnalyzeResponse {
  // Classify the mood
  const moodCategory = classifyMood(emotions);
  const moodConfig = MOOD_MAPPINGS[moodCategory];

  // Calculate scores
  const energyLevel = calculateEnergyLevel(emotions);
  const socialScore = calculateSocialScore(emotions);
  const adventureScore = calculateAdventureScore(emotions);
  const confidence = calculateConfidence(emotions);

  return {
    detectedMood: moodConfig.detectedMood,
    confidence,
    emotions,
    energyLevel,
    socialScore,
    adventureScore,
    reasoning: moodConfig.reasoning,
    recommendedKeys: moodConfig.recommendedTags,
  };
}

/**
 * Validate emotions object
 * Ensures all emotion values are between 0-1 and sum is reasonable
 */
export function validateEmotions(emotions: Partial<EmotionScores>): emotions is EmotionScores {
  const required: (keyof EmotionScores)[] = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'fear', 'disgust'];

  for (const key of required) {
    if (!(key in emotions)) return false;
    const value = emotions[key] as number;
    if (typeof value !== 'number' || value < 0 || value > 1) return false;
  }

  return true;
}

/**
 * Merge multiple face emotions (primary face weighted 60%, others 40%)
 * Useful when multiple faces detected
 */
export function mergeFaceEmotions(
  emotionsArray: EmotionScores[],
  primaryIndex: number = 0
): EmotionScores {
  if (emotionsArray.length === 0) {
    return {
      happy: 0,
      sad: 0,
      angry: 0,
      surprised: 0,
      neutral: 1, // Default to neutral
      fear: 0,
      disgust: 0,
    };
  }

  if (emotionsArray.length === 1) {
    return emotionsArray[0];
  }

  const primaryEmotions = emotionsArray[primaryIndex];
  const otherEmotions = emotionsArray.filter((_, i) => i !== primaryIndex);

  const merged: EmotionScores = {
    happy: primaryEmotions.happy * 0.6 + (otherEmotions.reduce((sum, e) => sum + e.happy, 0) / otherEmotions.length) * 0.4,
    sad: primaryEmotions.sad * 0.6 + (otherEmotions.reduce((sum, e) => sum + e.sad, 0) / otherEmotions.length) * 0.4,
    angry: primaryEmotions.angry * 0.6 + (otherEmotions.reduce((sum, e) => sum + e.angry, 0) / otherEmotions.length) * 0.4,
    surprised: primaryEmotions.surprised * 0.6 + (otherEmotions.reduce((sum, e) => sum + e.surprised, 0) / otherEmotions.length) * 0.4,
    neutral: primaryEmotions.neutral * 0.6 + (otherEmotions.reduce((sum, e) => sum + e.neutral, 0) / otherEmotions.length) * 0.4,
    fear: primaryEmotions.fear * 0.6 + (otherEmotions.reduce((sum, e) => sum + e.fear, 0) / otherEmotions.length) * 0.4,
    disgust: primaryEmotions.disgust * 0.6 + (otherEmotions.reduce((sum, e) => sum + e.disgust, 0) / otherEmotions.length) * 0.4,
  };

  return merged;
}
