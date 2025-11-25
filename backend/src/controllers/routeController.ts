import { Request, Response } from 'express';
import { generateRouteOptions } from '../services/routeService.js';
import { Route } from '../models/Route.js';
import logger from '../utils/logger.js';

/**
 * POST /api/routes
 * Calculate sustainable route options
 */
export const calculateRoutes = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    
    // Validation
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: 'Origin and destination are required',
      });
    }
    
    if (from.toLowerCase() === to.toLowerCase()) {
      return res.status(400).json({
        success: false,
        error: 'Origin and destination cannot be the same',
      });
    }
    
    logger.info(`🚗 Route calculation request: ${from} → ${to}`);
    
    // Generate route options
    const options = await generateRouteOptions(from, to);
    
    if (options.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No routes found for the given locations',
      });
    }
    
    // Calculate distance from first option
    const distance = options[0].distance;
    
    // Save to database
    const routeDoc = new Route({
      from,
      to,
      distance,
      options: options.map(opt => ({
        mode: opt.mode,
        time: opt.time,
        cost: opt.cost,
        co2: opt.co2,
        greenScore: opt.greenScore,
        rewards: opt.rewards,
        description: opt.description,
      })),
    });
    
    await routeDoc.save();
    
    return res.status(200).json({
      success: true,
      data: {
        from,
        to,
        distance: Math.round(distance * 10) / 10,
        options,
      },
    });
  } catch (error) {
    logger.error('Error calculating routes:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate routes',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/routes/history
 * Get route calculation history
 */
export const getRouteHistory = async (req: Request, res: Response) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    
    const routes = await Route.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string));
    
    const total = await Route.countDocuments();
    
    return res.status(200).json({
      success: true,
      data: routes,
      pagination: {
        total,
        limit: parseInt(limit as string),
        skip: parseInt(skip as string),
      },
    });
  } catch (error) {
    logger.error('Error fetching route history:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch route history',
    });
  }
};

/**
 * GET /api/routes/:id
 * Get specific route details
 */
export const getRouteDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const route = await Route.findById(id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: route,
    });
  } catch (error) {
    logger.error('Error fetching route details:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch route details',
    });
  }
};

/**
 * GET /api/routes/stats/summary
 * Get route planning statistics
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    const totalRoutes = await Route.countDocuments();
    
    const allRoutes = await Route.find();
    let totalEmissionsSaved = 0;
    let totalDistancePlanned = 0;
    
    allRoutes.forEach(route => {
      totalDistancePlanned += route.distance;
      if (route.options.length > 0) {
        const maxEmissions = Math.max(...route.options.map(o => o.co2));
        const minEmissions = Math.min(...route.options.map(o => o.co2));
        totalEmissionsSaved += (maxEmissions - minEmissions) * (route.distance / 100);
      }
    });
    
    return res.status(200).json({
      success: true,
      data: {
        totalRoutes,
        totalDistancePlanned: Math.round(totalDistancePlanned),
        totalEmissionsSaved: Math.round(totalEmissionsSaved),
        averageDistancePerRoute: Math.round(totalDistancePlanned / (totalRoutes || 1)),
      },
    });
  } catch (error) {
    logger.error('Error fetching stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
    });
  }
};
