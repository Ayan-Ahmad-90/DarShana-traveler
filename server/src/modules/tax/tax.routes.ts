import { Router } from 'express';
import { authenticate, requireRoles } from '../../middlewares/authMiddleware.js';
import { listTaxHandler, createTaxHandler, updateTaxHandler } from './tax.controller.js';

const router = Router();

router.get('/', authenticate, requireRoles('SuperAdmin', 'Finance'), listTaxHandler);
router.post('/', authenticate, requireRoles('SuperAdmin', 'Finance'), createTaxHandler);
router.patch('/:id', authenticate, requireRoles('SuperAdmin', 'Finance'), updateTaxHandler);

export default router;
