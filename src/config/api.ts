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
    // Production: Use environment variable for deployed backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      console.warn('⚠️ VITE_BACKEND_URL not configured. Backend communication will fail.');
      console.warn('Set VITE_BACKEND_URL in .env.production to your deployed backend URL');
      console.warn('Example: https://your-backend.onrender.com or https://your-backend.railway.app');
    }
    return backendUrl || '';
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
