export interface ARDestination {
  id: string;
  title: string;
  img: string;
  label: string;
  tags: string[];
  mood: number[];
  energy: number[];
  social: number[];
  adventure: number[];
  matchScore: number;
  pricePerDay: number;
}

export interface ARResult {
  detectedMood: string;
  confidence: number;
  emotions: {
    happy: number;
    sad: number;
    angry: number;
    surprised: number;
    neutral: number;
    fear: number;
    disgust: number;
  };
  energyLevel: number;
  socialScore: number;
  adventureScore: number;
  recommendations: ARDestination[];
  reasoning: string;
}
