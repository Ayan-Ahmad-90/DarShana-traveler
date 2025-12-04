/**
 * AR Guide Controller
 * Handles AR overlay requests and mood analysis
 */

import type { Request, Response } from 'express';
import type { ARResult, ARDestination } from '../types/arGuide.js';

// Mock Data for AR Destinations
const AR_DESTINATIONS: ARDestination[] = [
  {
    id: 'ar-1',
    title: 'Taj Mahal, Agra',
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    label: 'Wonder',
    tags: ['History', 'Romance', 'Architecture'],
    mood: [0, 1, 5], // Happy, Neutral, Thoughtful
    energy: [1, 6],
    social: [1, 10],
    adventure: [1, 4],
    matchScore: 98,
    pricePerDay: 5000
  },
  {
    id: 'ar-2',
    title: 'Goa Beaches',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    label: 'Party',
    tags: ['Beach', 'Party', 'Relax'],
    mood: [0, 4], // Happy, Energetic
    energy: [7, 10],
    social: [7, 10],
    adventure: [5, 8],
    matchScore: 95,
    pricePerDay: 4500
  },
  {
    id: 'ar-3',
    title: 'Rishikesh',
    img: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=800&q=80',
    label: 'Adventure',
    tags: ['Yoga', 'Rafting', 'Spiritual'],
    mood: [1, 5], // Neutral, Thoughtful
    energy: [4, 9],
    social: [1, 6],
    adventure: [7, 10],
    matchScore: 92,
    pricePerDay: 3000
  }
];

export async function analyzeARScene(req: Request, res: Response): Promise<void> {
  try {
    console.log('\n🕶️ ===== AR GUIDE REQUEST =====');
    const { imageData } = req.body;

    if (!imageData) {
      res.status(400).json({ success: false, error: 'No image data provided' });
      return;
    }

    // Mock Analysis Logic (In production, use face-api.js or external AI)
    // Randomize mood for demo purposes
    const moods = ['Happy', 'Excited', 'Peaceful', 'Adventurous'];
    const detectedMood = moods[Math.floor(Math.random() * moods.length)];
    
    const energyLevel = Math.floor(Math.random() * 5) + 5; // 5-10
    const socialScore = Math.floor(Math.random() * 10) + 1;
    const adventureScore = Math.floor(Math.random() * 10) + 1;

    // Filter recommendations based on mock scores
    const recommendations = AR_DESTINATIONS.map(d => ({
      ...d,
      matchScore: Math.floor(Math.random() * 15) + 85 // Mock high match scores
    })).sort((a, b) => b.matchScore - a.matchScore);

    const result: ARResult = {
      detectedMood,
      confidence: 0.92,
      emotions: {
        happy: 0.8,
        sad: 0.0,
        angry: 0.0,
        surprised: 0.1,
        neutral: 0.1,
        fear: 0.0,
        disgust: 0.0
      },
      energyLevel,
      socialScore,
      adventureScore,
      recommendations,
      reasoning: `Your expression suggests you are feeling ${detectedMood}. We recommend these destinations to match your vibe.`
    };

    console.log(`✅ AR Analysis Complete: ${detectedMood}`);
    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ AR Guide Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
