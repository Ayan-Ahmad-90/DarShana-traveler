/**
 * Mood Analyzer API Client
 * Handles communication with backend /api/mood-analyze endpoint
 *
 * Usage:
 * const result = await analyzeMoodWithImage(base64ImageData);
 */

import type { MoodAnalyzeRequest, MoodAnalyzeResponse } from '../types/moodAnalyzer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const MOOD_ANALYZE_ENDPOINT = '/api/mood-analyze';

/**
 * Send image to backend for mood analysis
 * @param imageData Base64 encoded image data
 * @returns Mood analysis result with emotion scores and recommendations
 */
export async function analyzeMoodWithImage(imageData: string): Promise<MoodAnalyzeResponse> {
  try {
    const request: MoodAnalyzeRequest = {
      imageData,
    };

    const response = await fetch(`${API_BASE_URL}${MOOD_ANALYZE_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result: MoodAnalyzeResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Mood analysis API error:', error);
    throw error;
  }
}

/**
 * Analyze mood with image URL (alternative to base64)
 * @param imageUrl URL of the image
 * @returns Mood analysis result with emotion scores and recommendations
 */
export async function analyzeMoodWithURL(imageUrl: string): Promise<MoodAnalyzeResponse> {
  try {
    const request: MoodAnalyzeRequest = {
      imageData: '',
      imageUrl,
    };

    const response = await fetch(`${API_BASE_URL}${MOOD_ANALYZE_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result: MoodAnalyzeResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Mood analysis API error:', error);
    throw error;
  }
}
