// backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// All notification routes require authentication
router.use(auth);

// Get user notifications
router.get('/', notificationController.getUserNotifications);

// Get unread count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark notification as read
router.put('/:notificationId/read', notificationController.markAsRead);

// Mark all as read
router.put('/all/read', notificationController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;
