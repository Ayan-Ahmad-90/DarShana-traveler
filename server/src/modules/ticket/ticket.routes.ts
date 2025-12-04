import { Router } from 'express';
import { authenticate, requireRoles } from '../../middlewares/authMiddleware.js';
import { createTicketHandler, listTicketsHandler } from './ticket.controller.js';

const router = Router();

router.get('/', authenticate, requireRoles('SuperAdmin', 'Manager', 'Support'), listTicketsHandler);
router.post('/', authenticate, requireRoles('SuperAdmin', 'Manager'), createTicketHandler);

export default router;
