/**
 * Mood Analyzer API Client
 * Handles communication with backend /api/mood-analyze endpoint
 *
 * Backend: http://localhost:3001/api/mood-analyze
 * Environment: VITE_API_URL (optional override)
 *
 * Usage:
 * const result = await analyzeMoodWithImage(base64ImageData);
 */

import type { MoodAnalyzeRequest, MoodAnalyzeResponse } from '../types/moodAnalyzer';

// Determine API base URL: env var > localhost:3001
const getAPIBaseURL = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    console.log('Using API URL from environment:', envUrl);
    return envUrl;
  }
  console.log('Using default API URL: http://localhost:3001');
  return 'http://localhost:3001';
};

const API_BASE_URL = getAPIBaseURL();
const MOOD_ANALYZE_ENDPOINT = '/api/mood-analyze';

/**
 * Send image to backend for mood analysis
 * @param imageData Base64 encoded image data
 * @returns Mood analysis result with emotion scores and recommendations
 * @throws Error if API request fails
 */
export async function analyzeMoodWithImage(imageData: string): Promise<MoodAnalyzeResponse> {
  const url = `${API_BASE_URL}${MOOD_ANALYZE_ENDPOINT}`;
  
  try {
    console.log('📤 Sending mood analysis request to:', url);

    const request: MoodAnalyzeRequest = {
      imageData,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // JSON parsing failed, use default error
      }
      
      console.error('❌ API Error:', errorMessage);
      throw new Error(errorMessage);
    }

    // Parse successful response
    const result: MoodAnalyzeResponse = await response.json();
    console.log('✅ Mood analysis successful:', result);
    return result;
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    
    // Log detailed error info for debugging
    if (errorMsg.includes('Failed to fetch')) {
      console.error('❌ Network Error: Cannot connect to backend at', url);
      console.error('   Make sure backend is running: npm run dev');
    } else {
      console.error('❌ Mood analysis API error:', errorMsg);
    }
    
    throw error;
  }
}

/**
 * Analyze mood with image URL (alternative to base64)
 * @param imageUrl URL of the image
 * @returns Mood analysis result with emotion scores and recommendations
 * @throws Error if API request fails
 */
export async function analyzeMoodWithURL(imageUrl: string): Promise<MoodAnalyzeResponse> {
  const url = `${API_BASE_URL}${MOOD_ANALYZE_ENDPOINT}`;
  
  try {
    console.log('📤 Sending mood analysis request (URL) to:', url);

    const request: MoodAnalyzeRequest = {
      imageData: '',
      imageUrl,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // JSON parsing failed, use default error
      }
      
      console.error('❌ API Error:', errorMessage);
      throw new Error(errorMessage);
    }

    // Parse successful response
    const result: MoodAnalyzeResponse = await response.json();
    console.log('✅ Mood analysis successful:', result);
    return result;
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    
    // Log detailed error info for debugging
    if (errorMsg.includes('Failed to fetch')) {
      console.error('❌ Network Error: Cannot connect to backend at', url);
      console.error('   Make sure backend is running: npm run dev');
    } else {
      console.error('❌ Mood analysis API error:', errorMsg);
    }
    
    throw error;
  }
}
