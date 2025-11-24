import express from 'express';
import * as chatController from '../controllers/chatController.js';

const router = express.Router();

router.post('/save', chatController.saveChatHistory);
router.get('/history/:userId', chatController.getChatHistory);
router.post('/feedback', chatController.saveFeedback);
router.get('/feedback/:userId', chatController.getFeedback);
router.get('/stats/analytics', chatController.getStats);

export default router;
