import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/darshana-travel',
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hour
  
  // External APIs
  OPENROUTESERVICE_KEY: process.env.OPENROUTESERVICE_KEY || 'demo-key',
  AVIATIONSTACK_KEY: process.env.AVIATIONSTACK_KEY || 'demo-key',
  GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY || 'demo-key',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Feature flags
  ENABLE_EXTERNAL_APIS: process.env.ENABLE_EXTERNAL_APIS === 'true',
  USE_CACHE: process.env.USE_CACHE === 'true',
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`⚠️  Missing environment variables: ${missingEnvVars.join(', ')}`);
}
