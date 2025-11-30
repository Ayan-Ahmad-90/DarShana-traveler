import { Request, Response, NextFunction } from 'express';
import { generateInvoiceForBooking, listInvoices } from './invoice.service.js';

export const createInvoiceHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = await generateInvoiceForBooking(req.body.bookingId);
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

export const listInvoicesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoices = await listInvoices(req.query);
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};
