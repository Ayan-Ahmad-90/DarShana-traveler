// backend/routes/profile.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

// All profile routes require authentication
router.use(auth);

// Get user profile
router.get('/', profileController.getProfile);

// Update user profile
router.put('/', profileController.updateProfile);

// Save destination
router.post('/saved-destinations', profileController.saveDestination);

module.exports = router;
