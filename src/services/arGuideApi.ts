/**
 * AR Guide API Service
 * Handles communication with backend /api/ar-guide endpoint
 */

import type { ARGuideResponse, ARResult } from '../types/arGuide';

// Force correct backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const AR_GUIDE_ENDPOINT = '/api/ar-guide';

const buildEndpointUrl = (): string => {
  const baseUrl = BACKEND_URL.replace(/\/+$/, '');
  return `${baseUrl}${AR_GUIDE_ENDPOINT}`;
};

export const getARGuideUrl = (): string => buildEndpointUrl();

async function postARAnalysis(payload: { imageData?: string; imageUrl?: string; location?: { lat: number; lng: number } }): Promise<ARResult> {
  const url = buildEndpointUrl();

  if (!payload.imageData && !payload.imageUrl) {
    throw new Error('Image data is required for AR analysis.');
  }

  try {
    console.debug('📨 Calling AR Guide endpoint:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data: ARGuideResponse;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('❌ Failed to parse JSON:', text);
      throw new Error(`Invalid JSON response from server: ${text.substring(0, 100)}...`);
    }

    if (!response.ok) {
      const errorMessage = data?.error || `HTTP ${response.status}: ${response.statusText}`;
      console.error('❌ AR Guide API error:', errorMessage);
      throw new Error(errorMessage);
    }

    if (!data.data) {
      throw new Error('AR Guide returned an empty response.');
    }

    console.debug('✅ AR Guide response received');
    return data.data;
  } catch (error) {
    console.error('❌ AR Guide request failed:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(`Connection refused to ${url}. Is the backend running on port 3001?`);
    }
    throw error;
  }
}

export async function analyzeARScene(imageData: string, location?: { lat: number; lng: number }): Promise<ARResult> {
  return postARAnalysis({ imageData, location });
}
