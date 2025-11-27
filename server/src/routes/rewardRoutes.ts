import express from 'express';
import { RewardController } from '../controllers/rewardController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/log-activity', authMiddleware, RewardController.logActivity);
router.get('/user-rewards', authMiddleware, RewardController.getUserRewards);
router.get('/leaderboard', authMiddleware, RewardController.getLeaderboard);
router.post('/redeem', authMiddleware, RewardController.redeemPoints);

export default router;
