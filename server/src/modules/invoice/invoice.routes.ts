import { Router } from 'express';
import { authenticate, requireRoles } from '../../middlewares/authMiddleware.js';
import { createInvoiceHandler, listInvoicesHandler } from './invoice.controller.js';

const router = Router();

router.get('/', authenticate, requireRoles('SuperAdmin', 'Finance', 'Manager'), listInvoicesHandler);
router.post('/', authenticate, requireRoles('SuperAdmin', 'Finance'), createInvoiceHandler);

export default router;
