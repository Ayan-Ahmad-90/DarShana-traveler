import { Router } from 'express';
import Joi from 'joi';
import { submitContact } from '../controllers/contactController.js';
import { validateBody } from '../middlewares/requestValidator.js';

const router = Router();

const contactSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  message: Joi.string().required(),
  source: Joi.string().optional()
});

router.post('/', validateBody(contactSchema), submitContact);

export default router;
