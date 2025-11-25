/**
 * Routing and Distance Calculation Service
 * Integrates with OpenRouteService and includes fallback calculations
 */

import axios from 'axios';
import { env } from '../config/environment.js';
import logger from './logger.js';

interface RouteResult {
  distance: number; // in km
  duration: number; // in minutes
  source: 'api' | 'cached' | 'calculated';
}

/**
 * Calculate straight-line distance using Haversine formula
 * Useful as fallback when APIs are unavailable
 */
const calculateHaversineDistance = (
  from: { lat: number; lon: number },
  to: { lat: number; lon: number }
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLon = ((to.lon - from.lon) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Estimate road distance from straight-line distance
 * Multiplier based on route type (road is typically 1.2-1.4x straight line)
 */
const estimateRoadDistance = (straightLineDistance: number): number => {
  return straightLineDistance * 1.3; // Average road factor
};

/**
 * Get approximate coordinates for major Indian cities
 */
const getCityCoordinates = (city: string): { lat: number; lon: number } | null => {
  const cities: { [key: string]: { lat: number; lon: number } } = {
    // Major cities
    'new delhi': { lat: 28.7041, lon: 77.1025 },
    'mumbai': { lat: 19.076, lon: 72.8777 },
    'bangalore': { lat: 12.9716, lon: 77.5946 },
    'hyderabad': { lat: 17.3652, lon: 78.4744 },
    'pune': { lat: 18.5204, lon: 73.8567 },
    'jaipur': { lat: 26.9124, lon: 75.7873 },
    'ahmedabad': { lat: 23.0225, lon: 72.5714 },
    'kolkata': { lat: 22.5726, lon: 88.3639 },
    'chennai': { lat: 13.0827, lon: 80.2707 },
    'delhi': { lat: 28.7041, lon: 77.1025 },
    'agra': { lat: 27.1751, lon: 78.0421 },
    'varanasi': { lat: 25.3356, lon: 82.9997 },
    'goa': { lat: 15.2993, lon: 74.124 },
    'kerala': { lat: 10.8505, lon: 76.2711 },
    'rajasthan': { lat: 27.0238, lon: 74.2179 },
  };
  
  const key = city.toLowerCase().trim();
  return cities[key] || null;
};

/**
 * Get road distance between two cities
 * Uses OpenRouteService API with fallback to estimated distance
 */
export const getRoadDistance = async (from: string, to: string): Promise<RouteResult> => {
  try {
    const fromCoords = getCityCoordinates(from);
    const toCoords = getCityCoordinates(to);
    
    if (!fromCoords || !toCoords) {
      logger.warn(`City coordinates not found for: ${from} or ${to}`);
      throw new Error('City not found in database');
    }
    
    // Try OpenRouteService API if enabled
    if (env.ENABLE_EXTERNAL_APIS && env.OPENROUTESERVICE_KEY !== 'demo-key') {
      try {
        const response = await axios.get(
          `https://api.openrouteservice.org/v2/directions/driving`,
          {
            params: {
              api_key: env.OPENROUTESERVICE_KEY,
              start: `${fromCoords.lon},${fromCoords.lat}`,
              end: `${toCoords.lon},${toCoords.lat}`,
            },
            timeout: 5000,
          }
        );
        
        if (response.data?.routes?.[0]) {
          const distance = response.data.routes[0].distance / 1000; // Convert m to km
          const duration = response.data.routes[0].duration / 60; // Convert s to minutes
          
          logger.info(`✅ Got distance from OpenRouteService: ${distance} km`);
          return { distance, duration, source: 'api' };
        }
      } catch (apiError) {
        logger.warn(`⚠️  OpenRouteService API failed, using fallback`);
      }
    }
    
    // Fallback: Calculate using Haversine formula
    const straightDistance = calculateHaversineDistance(fromCoords, toCoords);
    const roadDistance = estimateRoadDistance(straightDistance);
    
    // Estimate duration (average speed: 60 km/h)
    const duration = (roadDistance / 60) * 60;
    
    logger.info(`📍 Using calculated distance: ${roadDistance} km`);
    return { distance: roadDistance, duration, source: 'calculated' };
  } catch (error) {
    logger.error('Error calculating distance:', error);
    
    // Final fallback: default distance
    return {
      distance: 250,
      duration: 300, // 5 hours
      source: 'calculated',
    };
  }
};

/**
 * Get flight distance (great circle distance)
 */
export const getFlightDistance = async (from: string, to: string): Promise<number> => {
  const fromCoords = getCityCoordinates(from);
  const toCoords = getCityCoordinates(to);
  
  if (!fromCoords || !toCoords) {
    return 500; // Default fallback
  }
  
  return calculateHaversineDistance(fromCoords, toCoords);
};

/**
 * Get train distance
 * In India, train routes may be longer than straight-line
 */
export const getTrainDistance = async (from: string, to: string): Promise<number> => {
  const roadResult = await getRoadDistance(from, to);
  // Train routes are typically 5-10% longer than road
  return roadResult.distance * 1.05;
};
