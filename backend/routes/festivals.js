// backend/routes/festivals.js
const express = require('express');
const router = express.Router();
const festivalController = require('../controllers/festivalController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', festivalController.getAllFestivals);
router.get('/search', festivalController.getFestivalsByLocation);
router.get('/upcoming', festivalController.getUpcomingFestivals);

// Routes requiring authentication
router.use(auth);

// Create reminder
router.post('/reminders', festivalController.createReminder);

// Get user's reminders
router.get('/user/reminders', festivalController.getUserReminders);

// Delete reminder
router.delete('/reminders/:reminderId', festivalController.deleteReminder);

// Admin routes
router.post('/admin/add', festivalController.addFestival);

module.exports = router;
