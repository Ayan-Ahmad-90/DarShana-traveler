/**
 * CO2 Emissions Calculation Service
 * Based on real-world data for Indian transport modes
 * Source: Ministry of Road Transport & Highways, Indian Railways, ICAO
 */

interface EmissionFactors {
  [key: string]: number; // kg CO2 per km
}

// CO2 emission factors (kg per kilometer)
const EMISSION_FACTORS: EmissionFactors = {
  // Aviation: ~0.255 kg CO2 per km (including RFI multiplier)
  flight: 0.255,
  
  // Train: ~0.041 kg CO2 per km (Indian Railways average)
  train: 0.041,
  
  // Bus: ~0.089 kg CO2 per km (fully occupied)
  bus: 0.089,
  
  // Car (petrol): ~0.21 kg CO2 per km
  car: 0.21,
  
  // Electric Car: ~0.05 kg CO2 per km (grid electricity)
  'electric-car': 0.05,
  
  // Cab/Taxi: ~0.21 kg CO2 per km (petrol)
  cab: 0.21,
  
  // Metro: ~0.04 kg CO2 per km
  metro: 0.04,
  
  // Bike/Motorcycle: ~0.11 kg CO2 per km
  bike: 0.11,
};

/**
 * Calculate CO2 emissions for a journey
 */
export const calculateEmissions = (
  mode: string,
  distanceKm: number,
  passengers: number = 1
): number => {
  const factor = EMISSION_FACTORS[mode.toLowerCase()] || 0.15;
  const baseEmissions = distanceKm * factor;
  
  // For shared transport, divide by number of passengers
  if (['bus', 'metro', 'train', 'cab', 'car'].includes(mode.toLowerCase())) {
    return Math.round(baseEmissions / Math.max(passengers, 1) * 100) / 100;
  }
  
  return Math.round(baseEmissions * 100) / 100;
};

/**
 * Calculate sustainability score (1-10)
 * Based on CO2 emissions and mode type
 */
export const calculateSustainabilityScore = (
  mode: string,
  emissionsCO2: number,
  maxEmissions: number = 200
): number => {
  // Normalize emissions to 0-1 range
  const normalizedEmissions = Math.min(emissionsCO2 / maxEmissions, 1);
  
  // Base scores by mode
  const modeScores: { [key: string]: number } = {
    'electric-car': 9,
    metro: 8,
    train: 8,
    bus: 7,
    bike: 9,
    car: 3,
    cab: 3,
    flight: 2,
  };
  
  const baseScore = modeScores[mode.toLowerCase()] || 5;
  
  // Adjust based on emissions
  const emissionsPenalty = normalizedEmissions * 3;
  const finalScore = Math.max(1, Math.min(10, baseScore - emissionsPenalty));
  
  return Math.round(finalScore * 10) / 10;
};

/**
 * Get emission level description
 */
export const getEmissionLevel = (co2: number): 'low' | 'medium' | 'high' => {
  if (co2 < 50) return 'low';
  if (co2 < 150) return 'medium';
  return 'high';
};

/**
 * Calculate total emissions for a journey with comparison
 */
export const calculateEmissionComparison = (
  mode: string,
  distanceKm: number,
  passengers: number = 1
) => {
  const emissions = calculateEmissions(mode, distanceKm, passengers);
  const score = calculateSustainabilityScore(mode, emissions);
  const level = getEmissionLevel(emissions);
  
  // Calculate tree equivalents (1 tree absorbs ~21 kg CO2/year)
  const treesNeeded = Math.round(emissions / 21 * 100) / 100;
  
  return {
    emissions,
    score,
    level,
    treesNeeded,
  };
};
