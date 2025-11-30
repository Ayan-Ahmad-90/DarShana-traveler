import { Request, Response, NextFunction } from 'express';
import { generateTicketForBooking, listTickets } from './ticket.service.js';

export const createTicketHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = await generateTicketForBooking(req.body.bookingId);
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

export const listTicketsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tickets = await listTickets(req.query);
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};
