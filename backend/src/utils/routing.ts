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
    // DELHI & NCR - Historical Places
    'new delhi': { lat: 28.7041, lon: 77.1025 },
    'delhi': { lat: 28.7041, lon: 77.1025 },
    'red fort': { lat: 28.6562, lon: 77.2410 },
    'india gate': { lat: 28.6129, lon: 77.2295 },
    'qutb minar': { lat: 28.5244, lon: 77.1855 },
    'lal qila': { lat: 28.6562, lon: 77.2410 },
    'jama masjid': { lat: 28.6505, lon: 77.2303 },
    'humayun tomb': { lat: 28.5921, lon: 77.2499 },
    'rashtrapati bhavan': { lat: 28.6194, lon: 77.1999 },
    'gurgaon': { lat: 28.4595, lon: 77.0266 },
    'noida': { lat: 28.5355, lon: 77.3910 },
    'faridabad': { lat: 28.4089, lon: 77.3178 },
    
    // MAHARASHTRA
    'mumbai': { lat: 19.076, lon: 72.8777 },
    'taj mahal': { lat: 27.1751, lon: 78.0421 },
    'agra': { lat: 27.1751, lon: 78.0421 },
    'pune': { lat: 18.5204, lon: 73.8567 },
    'nagpur': { lat: 21.1458, lon: 79.0882 },
    'aurangabad': { lat: 19.8762, lon: 75.3433 },
    'ajanta caves': { lat: 20.5518, lon: 75.7030 },
    'ellora caves': { lat: 19.9024, lon: 75.4761 },
    
    // KARNATAKA
    'bangalore': { lat: 12.9716, lon: 77.5946 },
    'mysore': { lat: 12.2958, lon: 76.6394 },
    'hampi': { lat: 15.3350, lon: 76.4771 },
    
    // TELANGANA & ANDHRA PRADESH
    'hyderabad': { lat: 17.3652, lon: 78.4744 },
    'visakhapatnam': { lat: 17.6869, lon: 83.2185 },
    'tirupati': { lat: 13.1939, lon: 79.8245 },
    
    // TAMIL NADU
    'chennai': { lat: 13.0827, lon: 80.2707 },
    'madurai': { lat: 9.9252, lon: 78.1198 },
    'kanyakumari': { lat: 8.0883, lon: 77.5385 },
    'ooty': { lat: 11.4102, lon: 76.6955 },
    
    // KERALA
    'kochi': { lat: 9.9312, lon: 76.2673 },
    'cochin': { lat: 9.9312, lon: 76.2673 },
    'kerala': { lat: 10.8505, lon: 76.2711 },
    'kerela': { lat: 10.8505, lon: 76.2711 },
    'thiruvananthapuram': { lat: 8.5241, lon: 76.9366 },
    'munnar': { lat: 10.5892, lon: 77.0595 },
    
    // GOA
    'goa': { lat: 15.2993, lon: 74.124 },
    'panaji': { lat: 15.4909, lon: 73.8278 },
    
    // RAJASTHAN
    'jaipur': { lat: 26.9124, lon: 75.7873 },
    'jodhpur': { lat: 26.2389, lon: 73.0243 },
    'udaipur': { lat: 24.5854, lon: 73.7125 },
    'pushkar': { lat: 26.4894, lon: 74.5619 },
    'ajmer': { lat: 26.4499, lon: 74.6399 },
    'rajasthan': { lat: 27.0238, lon: 74.2179 },
    'mount abu': { lat: 24.5923, lon: 72.7156 },
    
    // UTTAR PRADESH
    'lucknow': { lat: 26.8467, lon: 80.9462 },
    'varanasi': { lat: 25.3356, lon: 82.9997 },
    'kanpur': { lat: 26.4499, lon: 80.3319 },
    'meerut': { lat: 28.9845, lon: 77.7064 },
    'ghaziabad': { lat: 28.6692, lon: 77.4538 },
    'ayodhya': { lat: 26.8047, lon: 82.1932 },
    'mathura': { lat: 27.4924, lon: 77.6737 },
    'vrindavan': { lat: 27.5794, lon: 77.6767 },
    
    // BIHAR
    'patna': { lat: 25.5941, lon: 85.1376 },
    'gaya': { lat: 24.7955, lon: 85.0032 },
    'bodh gaya': { lat: 24.6970, lon: 84.9882 },
    
    // JHARKHAND
    'ranchi': { lat: 23.3441, lon: 85.3096 },
    'jamshedpur': { lat: 22.8046, lon: 86.1827 },
    'dhanbad': { lat: 23.7957, lon: 86.4304 },
    
    // MADHYA PRADESH
    'bhopal': { lat: 23.1815, lon: 79.9864 },
    'indore': { lat: 22.7196, lon: 75.8577 },
    'gwalior': { lat: 26.2183, lon: 78.1629 },
    'khajuraho': { lat: 24.8318, lon: 79.9264 },
    'sanchi': { lat: 23.4837, lon: 77.7382 },
    
    // PAKISTAN & PUNJAB
    'amritsar': { lat: 31.634, lon: 74.8711 },
    'golden temple': { lat: 31.6200, lon: 74.8765 },
    'ludhiana': { lat: 30.9010, lon: 75.8573 },
    'chandigarh': { lat: 30.7333, lon: 76.7794 },
    'shimla': { lat: 31.7725, lon: 77.1739 },
    'manali': { lat: 32.2396, lon: 77.1887 },
    'dharamshala': { lat: 32.2206, lon: 76.3263 },
    
    // HIMACHAL & JAMMU KASHMIR
    'srinagar': { lat: 34.0837, lon: 74.7973 },
    'leh': { lat: 34.1526, lon: 77.5771 },
    'ladakh': { lat: 33.5731, lon: 77.5771 },
    
    // HARYANA & PUNJAB
    'hisar': { lat: 29.1492, lon: 75.7379 },
    'rohtak': { lat: 28.8996, lon: 76.5627 },
    'gurugram': { lat: 28.4595, lon: 77.0266 },
    
    // UTTARAKHAND
    'dehradun': { lat: 30.3165, lon: 78.0322 },
    'nainital': { lat: 29.3919, lon: 79.4504 },
    'rishikesh': { lat: 30.1868, lon: 78.4618 },
    'haridwar': { lat: 29.9457, lon: 78.1642 },
    
    // GUJARAT
    'ahmedabad': { lat: 23.0225, lon: 72.5714 },
    'surat': { lat: 21.1458, lon: 72.8336 },
    'vadodara': { lat: 22.3072, lon: 73.1812 },
    'rajkot': { lat: 22.3039, lon: 70.8022 },
    
    // WEST BENGAL
    'kolkata': { lat: 22.5726, lon: 88.3639 },
    'darjeeling': { lat: 27.0410, lon: 88.2663 },
    'sundarbans': { lat: 21.9497, lon: 88.4560 },
    
    // OTHER MAJOR CITIES
    'salem': { lat: 11.6643, lon: 78.1460 },
    'coimbatore': { lat: 11.0081, lon: 76.9955 },
    'thrissur': { lat: 10.5276, lon: 76.2144 },
    'guwahati': { lat: 26.1445, lon: 91.7362 },
    'shillong': { lat: 25.5788, lon: 91.8933 },
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
