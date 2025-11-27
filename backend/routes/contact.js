// backend/routes/contact.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Submit contact form (public)
router.post('/', contactController.submitContact);

// Admin routes (with auth middleware in production)
router.get('/', contactController.getContactMessages);
router.put('/:messageId/read', contactController.markAsRead);
router.put('/:messageId/resolve', contactController.markAsResolved);

module.exports = router;
