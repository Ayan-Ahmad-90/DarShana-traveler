import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// User profile routes
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, UserController.updateProfile);
router.put('/profile-image', authMiddleware, UserController.updateProfileImage);
router.delete('/account', authMiddleware, UserController.deleteAccount);

export default router;
