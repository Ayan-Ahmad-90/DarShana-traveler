import { Router } from 'express';
import { authenticate, requireRoles } from '../../middlewares/authMiddleware.js';
import { getWallet, adjustUserWallet } from './wallet.controller.js';

const router = Router();

router.get('/', authenticate, getWallet);
router.post('/adjust', authenticate, requireRoles('SuperAdmin', 'Manager', 'Finance'), adjustUserWallet);

export default router;
