/**
 * Route Generation Service
 * Generates multiple sustainable travel options for a given origin and destination
 */

import {
  calculateEmissions,
  calculateSustainabilityScore,
  calculateEmissionComparison,
} from '../utils/emissions.js';
import { calculateRewardPoints } from '../utils/rewards.js';
import { getRoadDistance, getFlightDistance, getTrainDistance } from '../utils/routing.js';
import logger from '../utils/logger.js';

export interface RouteOption {
  mode: string;
  time: string; // e.g., "4 hours"
  distance: number;
  cost: number;
  co2: number;
  greenScore: number;
  rewards: number;
  description: string;
}

/**
 * Cost estimation for different transport modes in India
 * Based on 2024 rates
 */
const estimateCost = (mode: string, distance: number): number => {
  const costPerKm: { [key: string]: number } = {
    flight: 3, // ₹3 per km (average)
    train: 0.5, // ₹0.5 per km (sleeper class)
    bus: 0.4, // ₹0.4 per km (AC bus)
    car: 1.5, // ₹1.5 per km (fuel + maintenance)
    'electric-car': 0.8, // ₹0.8 per km (charging)
    metro: 0.3, // ₹0.3 per km (average)
    bike: 0.6, // ₹0.6 per km (fuel)
    cab: 2.0, // ₹2 per km (Uber/Ola estimate)
  };
  
  const rate = costPerKm[mode.toLowerCase()] || 1;
  return Math.round(distance * rate);
};

/**
 * Time estimation for different transport modes
 */
const estimateTravelTime = (mode: string, distance: number): string => {
  const speedKmH: { [key: string]: number } = {
    flight: 800, // Average flight speed
    train: 60, // Average train speed in India
    bus: 50, // Average bus speed
    car: 70, // Average car speed
    'electric-car': 70,
    metro: 40, // Including wait times
    bike: 40,
    cab: 50, // Including traffic
  };
  
  const speed = speedKmH[mode.toLowerCase()] || 60;
  const hours = distance / speed;
  
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} mins`;
  }
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  return minutes === 0 ? `${wholeHours} hours` : `${wholeHours}h ${minutes}m`;
};

/**
 * Generate route description based on mode
 */
const generateDescription = (mode: string, distance: number, time: string): string => {
  const descriptions: { [key: string]: string } = {
    flight: `Direct or connecting flights with comfortable seating. Fastest option for long distances.`,
    train: `Comfortable journey with meals. Indian Railways offers multiple classes for different budgets.`,
    bus: `Affordable and eco-friendly. AC/non-AC options available. Most popular for medium distances.`,
    car: `Personal vehicle journey. Flexibility to stop anywhere. Best for groups.`,
    'electric-car': `Zero emissions journey using electric vehicles. Best for environment-conscious travelers.`,
    metro: `Fast urban transit using subway system. Available only in metro cities.`,
    bike: `Two-wheeler journey. Most economical option. Best for short distances.`,
    cab: `On-demand taxi service. Convenient door-to-door service.`,
  };
  
  return descriptions[mode.toLowerCase()] || 'Travel option';
};

/**
 * Main function to generate all route options
 */
export const generateRouteOptions = async (
  from: string,
  to: string,
  distance?: number,
): Promise<RouteOption[]> => {
  try {
    let roadDistance: number = distance || 0;
    
    // Get distance if not provided
    if (!roadDistance) {
      const result = await getRoadDistance(from, to);
      roadDistance = result?.distance || 100; // Default 100 km if calculation fails
    }
    
    // Ensure minimum realistic distance
    if (roadDistance < 5) {
      roadDistance = 5; // At least 5 km for nearby locations
    }
    
    logger.info(`📍 Generating routes for ${from} → ${to} (${roadDistance} km)`);
    
    const options: RouteOption[] = [];
    
    // 1. Flight (for distances > 400 km)
    if (roadDistance > 400) {
      const flightDistance = await getFlightDistance(from, to);
      const emissions = calculateEmissions('flight', flightDistance);
      const greenScore = calculateSustainabilityScore('flight', emissions);
      const time = estimateTravelTime('flight', flightDistance);
      const cost = estimateCost('flight', flightDistance);
      
      options.push({
        mode: 'Flight',
        time,
        distance: flightDistance,
        cost,
        co2: emissions,
        greenScore,
        rewards: calculateRewardPoints({ mode: 'flight', distanceKm: flightDistance, sustainabilityScore: greenScore, emissionsCO2: emissions }),
        description: generateDescription('flight', flightDistance, time),
      });
    }
    
    // 2. Train (for distances > 200 km and major routes)
    if (roadDistance > 200) {
      const trainDistance = await getTrainDistance(from, to);
      const emissions = calculateEmissions('train', trainDistance);
      const greenScore = calculateSustainabilityScore('train', emissions);
      const time = estimateTravelTime('train', trainDistance);
      const cost = estimateCost('train', trainDistance);
      
      options.push({
        mode: 'Train',
        time,
        distance: trainDistance,
        cost,
        co2: emissions,
        greenScore,
        rewards: calculateRewardPoints({ mode: 'train', distanceKm: trainDistance, sustainabilityScore: greenScore, emissionsCO2: emissions }),
        description: generateDescription('train', trainDistance, time),
      });
    }
    
    // 3. Bus (available for all distances)
    const busEmissions = calculateEmissions('bus', roadDistance, 40); // Assume 40 passengers
    const busGreenScore = calculateSustainabilityScore('bus', busEmissions);
    const busTime = estimateTravelTime('bus', roadDistance);
    const busCost = estimateCost('bus', roadDistance);
    
    options.push({
      mode: 'Bus',
      time: busTime,
      distance: roadDistance,
      cost: busCost,
      co2: busEmissions,
      greenScore: busGreenScore,
      rewards: calculateRewardPoints({ mode: 'bus', distanceKm: roadDistance, sustainabilityScore: busGreenScore, emissionsCO2: busEmissions }),
      description: generateDescription('bus', roadDistance, busTime),
    });
    
    // 4. Car
    const carEmissions = calculateEmissions('car', roadDistance);
    const carGreenScore = calculateSustainabilityScore('car', carEmissions);
    const carTime = estimateTravelTime('car', roadDistance);
    const carCost = estimateCost('car', roadDistance);
    
    options.push({
      mode: 'Car',
      time: carTime,
      distance: roadDistance,
      cost: carCost,
      co2: carEmissions,
      greenScore: carGreenScore,
      rewards: calculateRewardPoints({ mode: 'car', distanceKm: roadDistance, sustainabilityScore: carGreenScore, emissionsCO2: carEmissions }),
      description: generateDescription('car', roadDistance, carTime),
    });
    
    // 5. Electric Car
    const evEmissions = calculateEmissions('electric-car', roadDistance);
    const evGreenScore = calculateSustainabilityScore('electric-car', evEmissions);
    const evTime = estimateTravelTime('electric-car', roadDistance);
    const evCost = estimateCost('electric-car', roadDistance);
    
    options.push({
      mode: 'Electric Car',
      time: evTime,
      distance: roadDistance,
      cost: evCost,
      co2: evEmissions,
      greenScore: evGreenScore,
      rewards: calculateRewardPoints({ mode: 'electric-car', distanceKm: roadDistance, sustainabilityScore: evGreenScore, emissionsCO2: evEmissions }),
      description: generateDescription('electric-car', roadDistance, evTime),
    });
    
    // 6. Metro (for short distances in metro cities: Delhi, Mumbai, Bangalore, etc.)
    const metroAvailableCities = ['delhi', 'new delhi', 'mumbai', 'bangalore', 'hyderabad', 'kolkata', 'pune', 'ahmedabad', 'chennai'];
    const isInMetroCity = metroAvailableCities.some(city => from.toLowerCase().includes(city) || to.toLowerCase().includes(city));
    
    if (roadDistance < 150 && isInMetroCity) {
      const metroEmissions = calculateEmissions('metro', roadDistance, 100); // Assume full train
      const metroGreenScore = calculateSustainabilityScore('metro', metroEmissions);
      const metroTime = estimateTravelTime('metro', roadDistance);
      const metroCost = estimateCost('metro', roadDistance);
      
      options.push({
        mode: 'Metro',
        time: metroTime,
        distance: roadDistance,
        cost: metroCost,
        co2: metroEmissions,
        greenScore: metroGreenScore,
        rewards: calculateRewardPoints({ mode: 'metro', distanceKm: roadDistance, sustainabilityScore: metroGreenScore, emissionsCO2: metroEmissions }),
        description: generateDescription('metro', roadDistance, metroTime),
      });
    }
    
    // 7. Bike (for short distances < 100 km)
    if (roadDistance < 100) {
      const bikeEmissions = calculateEmissions('bike', roadDistance);
      const bikeGreenScore = calculateSustainabilityScore('bike', bikeEmissions);
      const bikeTime = estimateTravelTime('bike', roadDistance);
      const bikeCost = estimateCost('bike', roadDistance);
      
      options.push({
        mode: 'Bike',
        time: bikeTime,
        distance: roadDistance,
        cost: bikeCost,
        co2: bikeEmissions,
        greenScore: bikeGreenScore,
        rewards: calculateRewardPoints({ mode: 'bike', distanceKm: roadDistance, sustainabilityScore: bikeGreenScore, emissionsCO2: bikeEmissions }),
        description: generateDescription('bike', roadDistance, bikeTime),
      });
    }
    
    // 8. Cab (available for all distances)
    const cabEmissions = calculateEmissions('cab', roadDistance);
    const cabGreenScore = calculateSustainabilityScore('cab', cabEmissions);
    const cabTime = estimateTravelTime('cab', roadDistance);
    const cabCost = estimateCost('cab', roadDistance);
    
    options.push({
      mode: 'Cab',
      time: cabTime,
      distance: roadDistance,
      cost: cabCost,
      co2: cabEmissions,
      greenScore: cabGreenScore,
      rewards: calculateRewardPoints({ mode: 'cab', distanceKm: roadDistance, sustainabilityScore: cabGreenScore, emissionsCO2: cabEmissions }),
      description: generateDescription('cab', roadDistance, cabTime),
    });
    
    // Sort by sustainability score (best first) - Mark best option
    options.sort((a, b) => b.greenScore - a.greenScore);
    
    // Mark the most eco-friendly option
    if (options.length > 0) {
      options[0].description = `🌱 Eco Choice: ${options[0].description}`;
    }
    
    logger.info(`✅ Generated ${options.length} route options`);
    return options;
  } catch (error) {
    logger.error('Error generating route options:', error);
    throw error;
  }
};
