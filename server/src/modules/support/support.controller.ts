import { Request, Response, NextFunction } from 'express';
import {
  createSupportTicket,
  addSupportReply,
  listSupportTickets,
  updateSupportStatus
} from './support.service.js';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';

export const createSupportHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const ticket = await createSupportTicket({ ...req.body, user: req.user.id });
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

export const replySupportHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const ticket = await addSupportReply(req.params.id, {
      sender: req.user.id,
      body: req.body.body,
      attachments: req.body.attachments
    });
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

export const listSupportHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const filters = req.user?.roles?.includes('Support') ? req.query : { user: req.user?.id };
    const tickets = await listSupportTickets(filters as Record<string, unknown>);
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

export const updateSupportStatusHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const ticket = await updateSupportStatus(req.params.id, req.body.status, req.body.assignedTo);
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};
