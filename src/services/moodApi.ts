/**
 * Mood Analyzer API Client
 * Handles communication with backend /api/mood-analyze endpoint
 */

import { getBackendUrl } from '../config/api';
import type { MoodAnalyzeRequest, MoodAnalyzeResponse } from '../types/moodAnalyzer';

const DEFAULT_BACKEND_URL = 'http://localhost:3001';
const MOOD_ANALYZE_ENDPOINT = '/api/mood-analyze';

const normalizeBaseUrl = (value: string): string => value.replace(/\/+$/, '');

const resolveBackendOrigin = (): string => {
  const candidates = [
    import.meta.env.VITE_BACKEND_URL?.trim(),
    getBackendUrl(),
    DEFAULT_BACKEND_URL,
  ].filter((candidate): candidate is string => Boolean(candidate && candidate.trim()));

  const origin = candidates[0] ?? DEFAULT_BACKEND_URL;
  return normalizeBaseUrl(origin);
};

const buildEndpointUrl = (): string => `${resolveBackendOrigin()}${MOOD_ANALYZE_ENDPOINT}`;

const parseJsonSafely = async (response: Response): Promise<any> => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('❌ Failed to parse JSON from mood analyzer response:', error);
    return null;
  }
};

const throwForErrorResponse = (response: Response, body: any): never => {
  const statusMessage = `HTTP ${response.status}: ${response.statusText}`;
  const errorMessage = body?.error || body?.message || statusMessage;
  console.error('❌ Mood analyzer API error:', errorMessage);
  throw new Error(errorMessage);
};

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
    console.debug('📨 Calling mood analyzer endpoint:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await parseJsonSafely(response);

    if (!response.ok) {
      throwForErrorResponse(response, data);
    }

    if (!data) {
      console.error('❌ Mood analyzer returned empty response body');
      throw new Error('Mood analyzer returned an empty response.');
    }

    console.debug('✅ Mood analyzer response received');
    return data as MoodAnalyzeResponse;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('❌ Network error while reaching mood analyzer at', url);
      throw new Error(`Failed to reach mood analyzer service at ${url}. Is the backend running?`);
    }

    console.error('❌ Unexpected mood analyzer client error:', error);
    throw error instanceof Error ? error : new Error('Unknown error during mood analysis request.');
  }
}

export const getMoodAnalyzerUrl = (): string => buildEndpointUrl();

export async function analyzeMoodWithImage(imageData: string): Promise<MoodAnalyzeResponse> {
  return postMoodAnalysis({ imageData });
}

export async function analyzeMoodWithURL(imageUrl: string): Promise<MoodAnalyzeResponse> {
  return postMoodAnalysis({ imageUrl });
}
