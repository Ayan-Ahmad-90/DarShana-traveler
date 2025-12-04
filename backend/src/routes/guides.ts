import express, { Request, Response } from 'express';
import {
  registerGuide,
  getAllGuides,
  getGuideById,
  getGuideAvailability,
  getMyGuideProfile,
  updateGuideProfile,
  getGuideStats,
  getGuideRequests,
  acceptGuideRequest,
  rejectGuideRequest,
  completeTrip,
  rateGuide,
} from '../controllers/guideController.js';

const router = express.Router();

/**
 * Guide Registration & Management Routes
 */

// Public routes
router.get('/', getAllGuides); // GET all verified guides
router.get('/search', getAllGuides); // Search guides
router.get('/:guideId', getGuideById); // GET guide by ID
router.get('/:guideId/availability', getGuideAvailability); // Check availability

// Guide registration
router.post('/register', registerGuide); // Register as guide

// Protected routes - would require auth middleware in production
router.get('/me/profile', getMyGuideProfile); // Get my profile
router.put('/me/profile', updateGuideProfile); // Update my profile
router.get('/me/stats', getGuideStats); // Get my statistics

// Request management
router.get('/me/requests', getGuideRequests); // Get my requests
router.put('/requests/:requestId/accept', acceptGuideRequest); // Accept request
router.put('/requests/:requestId/reject', rejectGuideRequest); // Reject request
router.put('/requests/:requestId/complete', completeTrip); // Mark trip complete

// Rating
router.put('/:guideId/rate', rateGuide); // Rate guide

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'guides' });
});

export default router;
