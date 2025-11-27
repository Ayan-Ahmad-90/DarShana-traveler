/**
 * Guide Registration Routes
 * Handles guide registration, profile management, and request handling
 */

const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideRegistrationController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/uploads/guides/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Public routes
router.get('/', guideController.getAllGuides); // GET all verified guides
router.get('/search', guideController.getAllGuides); // Search guides
router.get('/:guideId', guideController.getGuideById); // GET guide by ID
router.get('/:guideId/availability', guideController.getGuideAvailability); // Check availability

// Protected routes - Guide specific
router.post('/register', auth, upload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'backgroundCheck', maxCount: 1 },
]), guideController.registerGuide); // Register as guide

router.get('/me', auth, guideController.getMyGuideProfile); // Get my profile
router.put('/me', auth, guideController.updateGuideProfile); // Update my profile
router.get('/stats', auth, guideController.getGuideStats); // Get my statistics

// Request management
router.get('/requests', auth, guideController.getGuideRequests); // Get my requests
router.put('/requests/:requestId/accept', auth, guideController.acceptGuideRequest); // Accept request
router.put('/requests/:requestId/reject', auth, guideController.rejectGuideRequest); // Reject request
router.put('/requests/:requestId/complete', auth, guideController.completeTrip); // Mark trip complete

// Rating
router.put('/:guideId/rate', auth, guideController.rateGuide); // Rate guide

module.exports = router;
