import { Router } from 'express';
import Joi from 'joi';
import { heroSearch, journeySearch } from '../controllers/searchController.js';
import { validateBody } from '../middlewares/requestValidator.js';

const router = Router();

const heroSchema = Joi.object({
  destination: Joi.string().allow('', null),
  checkIn: Joi.string().allow('', null),
  checkOut: Joi.string().allow('', null),
  budget: Joi.number().integer().min(5000).optional()
});

const journeySchema = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  date: Joi.string().required(),
  passengers: Joi.number().integer().min(1).default(1)
});

router.post('/hero', validateBody(heroSchema), heroSearch);
router.post('/journey', validateBody(journeySchema), journeySearch);

export default router;
