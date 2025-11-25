/**
 * API Configuration
 * Automatically detects dev vs production environment
 */

export const getBackendUrl = (): string => {
  // Production Vercel domains
  const productionOrigins = [
    'dar-shana-traveler-seven.vercel.app',
    'darshana-traveler.vercel.app',
  ];

  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  // Use different backend URLs based on environment
  if (productionOrigins.includes(hostname)) {
    // Production: Use the deployed backend URL
    // You'll need to set a VITE_BACKEND_URL environment variable or deploy the backend
    return import.meta.env.VITE_BACKEND_URL || 'https://darshana-backend.onrender.com';
  }

  // Development: Use localhost
  return 'http://localhost:5000';
};

export const API_BASE_URL = getBackendUrl();

export const API_ENDPOINTS = {
  ROUTES: `${API_BASE_URL}/api/routes`,
  ROUTE_HISTORY: `${API_BASE_URL}/api/routes`,
  HEALTH: `${API_BASE_URL}/health`,
};
