import { Request, Response } from 'express';
import { successResponse } from '../utils/response.js';
import { specialFeatureAbilities } from '../utils/mockData.js';

export const analyzeMood = (req: Request, res: Response): void => {
  const { mood = 'Curious' } = req.body;
  const destinations = {
    Joyful: ['Goa beach shacks', 'Jazz nights in Kolkata'],
    Stressed: ['Ayurveda retreat in Kerala', 'Mindfulness camp in Bir'],
    Adventurous: ['Spiti winter drive', 'Dzukou valley trek']
  };

  res.json(
    successResponse({
      detectedMood: mood,
      suggestions: destinations[mood as keyof typeof destinations] || destinations.Joyful,
      nextSteps: ['Schedule guide call', 'Lock indicative budget', 'Share itinerary with friends']
    })
  );
};

export const calculateGreenRoute = (req: Request, res: Response): void => {
  const { from, to, distanceKm = 600 } = req.body;
  const modes = [
    { type: 'train', co2PerKm: 0.041, rewardPoints: 120 },
    { type: 'bus', co2PerKm: 0.068, rewardPoints: 80 },
    { type: 'flight', co2PerKm: 0.155, rewardPoints: 30 }
  ];

  const calculations = modes.map((mode) => ({
    ...mode,
    totalCo2: +(mode.co2PerKm * distanceKm).toFixed(2),
    badge: mode.co2PerKm < 0.07 ? 'Green Choice' : 'Fastest'
  }));

  res.json(successResponse({ from, to, distanceKm, options: calculations }));
};

export const estimateBudget = (req: Request, res: Response): void => {
  const { nights = 4, travelers = 2, comfort = 'premium' } = req.body;
  const multipliers: Record<string, number> = { backpacker: 2500, comfort: 4200, premium: 6200 };
  const perPerson = multipliers[comfort] || multipliers.premium;
  const total = perPerson * nights * travelers;

  res.json(
    successResponse({
      totalInr: total,
      breakdown: {
        stay: total * 0.45,
        transport: total * 0.25,
        food: total * 0.18,
        experiences: total * 0.12
      },
      tips: specialFeatureAbilities.planners
    })
  );
};
