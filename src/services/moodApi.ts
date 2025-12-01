/**
 * Mood Analyzer API Client
 * Handles communication with backend /api/mood-analyze endpoint
 */

import { getBackendUrl } from '../config/api';
import type { MoodAnalyzeRequest, MoodAnalyzeResponse } from '../types/moodAnalyzer';

// Force correct backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const MOOD_ANALYZE_ENDPOINT = '/api/mood-analyze';

const buildEndpointUrl = (): string => {
  // Remove trailing slash from backend URL if present
  const baseUrl = BACKEND_URL.replace(/\/+$/, '');
  return `${baseUrl}${MOOD_ANALYZE_ENDPOINT}`;
};

export const getMoodAnalyzerUrl = (): string => buildEndpointUrl();

async function postMoodAnalysis(payload: { imageData?: string; imageUrl?: string }): Promise<MoodAnalyzeResponse> {
  const url = buildEndpointUrl();

  if (!payload.imageData && !payload.imageUrl) {
    throw new Error('Image data is required for mood analysis.');
  }

  const requestBody: MoodAnalyzeRequest = {
    ...(payload.imageData ? { imageData: payload.imageData } : {}),
    ...(payload.imageUrl ? { imageUrl: payload.imageUrl } : {}),
  };

  try {
    console.debug(' Calling mood analyzer endpoint:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error(' Failed to parse JSON:', text);
      throw new Error(`Invalid JSON response from server: ${text.substring(0, 100)}...`);
    }

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error(' Mood analyzer API error:', errorMessage);
      throw new Error(errorMessage);
    }

    if (!data) {
      throw new Error('Mood analyzer returned an empty response.');
    }

    console.debug(' Mood analyzer response received');
    return data as MoodAnalyzeResponse;
  } catch (error) {
    console.error(' Mood analyzer request failed:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(`Connection refused to ${url}. Is the backend running on port 3001?`);
    }
    throw error;
  }
}

export async function analyzeMoodWithImage(imageData: string): Promise<MoodAnalyzeResponse> {
  return postMoodAnalysis({ imageData });
}
