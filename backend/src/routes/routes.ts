import express, { Request, Response } from 'express';
import {
  calculateRoutes,
  getRouteHistory,
  getRouteDetails,
  getStats,
} from '../controllers/routeController.js';

const router = express.Router();

/**
 * Route endpoints for sustainable travel planning
 */

// POST /api/routes - Calculate sustainable routes
router.post('/', calculateRoutes);

// GET /api/routes - Get route history
router.get('/', getRouteHistory);

// GET /api/routes/stats/summary - Get statistics
router.get('/stats/summary', getStats);

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'routes' });
});

// GET /api/routes/:id - Get specific route
router.get('/:id', getRouteDetails);

export default router;
