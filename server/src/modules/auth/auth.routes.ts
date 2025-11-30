import { Router } from 'express';
import {
  handleRegister,
  handleLogin,
  handleRefresh,
  handleLogout,
  handleForgotPassword,
  handleResetPassword
} from './auth.controller.js';
import { authenticate } from '../../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/refresh', handleRefresh);
router.post('/logout', authenticate, handleLogout);
router.post('/forgot-password', handleForgotPassword);
router.post('/reset-password', handleResetPassword);

export default router;
