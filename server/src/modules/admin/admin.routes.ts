import { Router } from 'express';
import { authenticate, requireRoles } from '../../middlewares/authMiddleware.js';
import { adminDashboardHandler } from './admin.controller.js';

const router = Router();

router.get('/dashboard', authenticate, requireRoles('SuperAdmin', 'Manager', 'Finance'), adminDashboardHandler);

export default router;
