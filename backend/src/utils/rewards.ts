/**
 * Reward Points Algorithm
 * Rewards users for choosing sustainable transportation
 */

interface RewardCalculationInput {
  mode: string;
  distanceKm: number;
  sustainabilityScore: number;
  emissionsCO2: number;
}

/**
 * Calculate reward points based on sustainability choices
 * Base points: 1 point per km
 * Bonus multipliers based on sustainability
 */
export const calculateRewardPoints = (input: RewardCalculationInput): number => {
  const { mode, distanceKm, sustainabilityScore, emissionsCO2 } = input;
  
  // Base points: 1 point per km
  const basePoints = Math.round(distanceKm);
  
  // Sustainability bonus (up to 2x multiplier)
  const sustainabilityMultiplier = 1 + (sustainabilityScore / 10);
  
  // Emission reduction bonus (lower emissions = more points)
  const emissionBonus = Math.max(0, 100 - emissionsCO2) / 50;
  
  // Mode-specific bonuses
  const modeBonus: { [key: string]: number } = {
    'electric-car': 0.5,
    metro: 0.4,
    train: 0.35,
    bus: 0.3,
    bike: 0.6,
    car: -0.2,
    cab: -0.1,
    flight: -0.5,
  };
  
  const modeMultiplier = 1 + (modeBonus[mode.toLowerCase()] || 0);
  
  // Final calculation
  const totalPoints = Math.round(
    basePoints * sustainabilityMultiplier * emissionBonus * modeMultiplier
  );
  
  return Math.max(0, totalPoints);
};

/**
 * Get reward tier based on points
 */
export const getRewardTier = (points: number): 'bronze' | 'silver' | 'gold' | 'platinum' => {
  if (points >= 10000) return 'platinum';
  if (points >= 5000) return 'gold';
  if (points >= 1000) return 'silver';
  return 'bronze';
};

/**
 * Calculate cumulative rewards for a user
 */
export const calculateCumulativeRewards = (journeyRewards: number[]) => {
  const total = journeyRewards.reduce((sum, points) => sum + points, 0);
  const tier = getRewardTier(total);
  const nextTierPoints = tier === 'platinum' ? 10000 : { bronze: 1000, silver: 5000, gold: 10000 }[tier];
  
  return {
    totalPoints: total,
    tier,
    nextTierPoints,
    pointsUntilNextTier: Math.max(0, nextTierPoints - total),
  };
};

/**
 * Generate reward summary message
 */
export const generateRewardMessage = (points: number, emissionSaved: number): string => {
  if (points >= 100) {
    return `🌟 Amazing! You earned ${points} points and saved ${Math.round(emissionSaved)} kg CO₂!`;
  }
  if (points >= 50) {
    return `👍 Great choice! You earned ${points} points and saved ${Math.round(emissionSaved)} kg CO₂.`;
  }
  return `✅ You earned ${points} points for your journey.`;
};
