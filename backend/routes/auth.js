// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/signup', authLimiter, authController.signup);
router.post('/register', authLimiter, authController.signup); // Alias for frontend compatibility
router.post('/login', authLimiter, authController.login);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.put('/reset-password/:resetToken', authLimiter, authController.resetPassword);

// Protected routes
router.post('/logout', auth, authController.logout);

module.exports = router;
