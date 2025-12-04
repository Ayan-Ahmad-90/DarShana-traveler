import { Request, Response } from 'express';
import { heroRecommendations, heroSeasonTips, journeyTransportOptions } from '../utils/mockData.js';
import { successResponse } from '../utils/response.js';

export const heroSearch = async (req: Request, res: Response): Promise<void> => {
  const { destination, budget } = req.body;
  const recommended = heroRecommendations.map((item) => ({
    ...item,
    matchScore: destination && item.destination.toLowerCase().includes(String(destination).toLowerCase()) ? 0.95 : 0.78
  }));

  const averageBudget = budget ? Number(budget) : Math.round(recommended.reduce((sum, r) => sum + r.idealBudgetInr, 0) / recommended.length);

  res.json(
    successResponse({
      recommendedDestinations: recommended,
      budgetEstimation: {
        currency: 'INR',
        suggestedMinimum: averageBudget - 5000,
        suggestedComfort: averageBudget,
        suggestedLuxury: averageBudget + 15000
      },
      seasonSuggestions: heroSeasonTips
    })
  );
};

export const journeySearch = async (req: Request, res: Response): Promise<void> => {
  const { from, to, date, passengers = 1 } = req.body;
  const options = journeyTransportOptions.map((option) => ({
    ...option,
    totalPriceInr: option.priceInr * passengers,
    summary: `${option.type} via ${option.provider}`
  }));

  const fastest = options.reduce((prev, curr) => (curr.durationHours < prev.durationHours ? curr : prev), options[0]);
  const greenest = options.reduce((prev, curr) => (curr.carbonKg < prev.carbonKg ? curr : prev), options[0]);
  const budgetFriendly = options.reduce((prev, curr) => (curr.priceInr < prev.priceInr ? curr : prev), options[0]);

  res.json(
    successResponse({
      route: { from, to, date },
      transportOptions: options,
      insights: {
        fastest,
        greenest,
        budgetFriendly
      }
    })
  );
};
