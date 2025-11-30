import { Request, Response } from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { successResponse } from '../utils/response.js';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  const message = await ContactMessage.create(req.body);
  res.status(201).json(successResponse({
    referenceId: message._id,
    message: 'Support team will reach out within 2 hours'
  }));
};
