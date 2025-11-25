/**
 * API Configuration
 * Automatically detects dev vs production environment
 */

export const getBackendUrl = (): string => {
  // Check if we're in production
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname.includes('vercel.app') || 
     window.location.hostname.includes('herokuapp.com') ||
     window.location.hostname.includes('railway.app') ||
     window.location.hostname.includes('onrender.com'));

  // Try to get backend URL from environment
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (isProduction) {
    if (backendUrl && backendUrl.trim()) {
      return backendUrl;
    }
    console.error('❌ VITE_BACKEND_URL not configured for production!');
    console.error('Please set VITE_BACKEND_URL in Vercel environment variables');
    console.error('Example value: https://darshana-backend.onrender.com');
    return '';
  }

  // Development: Use localhost or env variable
  return backendUrl || 'http://localhost:3000';
};

export const API_BASE_URL = getBackendUrl();

export const API_ENDPOINTS = {
  ROUTES: `${API_BASE_URL}/api/routes`,
  ROUTE_HISTORY: `${API_BASE_URL}/api/routes`,
  HEALTH: `${API_BASE_URL}/health`,
};
