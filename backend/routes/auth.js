// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
console.log('DEBUG: authController keys:', Object.keys(authController));
console.log('DEBUG: authController.signup type:', typeof authController.signup);
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

console.log('DEBUG: authLimiter type:', typeof authLimiter);
console.log('DEBUG: authLimiter is:', authLimiter);
// Public routes
router.post('/signup', authLimiter, authController.signup);
router.post('/register', authLimiter, authController.signup); // Alias for frontend compatibility
router.post('/login', authLimiter, authController.login);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.put('/reset-password/:resetToken', authLimiter, authController.resetPassword);

// Protected routes
router.post('/logout', auth, authController.logout);
router.get('/me', auth, authController.getMe);
router.put('/update-profile', auth, authController.updateProfile);

module.exports = router;
