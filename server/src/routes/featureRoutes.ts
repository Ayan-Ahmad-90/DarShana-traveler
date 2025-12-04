import { Router } from 'express';
import Joi from 'joi';
import { analyzeMood, calculateGreenRoute, estimateBudget } from '../controllers/featureController.js';
import { validateBody } from '../middlewares/requestValidator.js';

const router = Router();

router.post('/mood', validateBody(Joi.object({ mood: Joi.string().required() })), analyzeMood);
router.post(
  '/green-route',
  validateBody(
    Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
      distanceKm: Joi.number().min(10).default(500)
    })
  ),
  calculateGreenRoute
);
router.post(
  '/budget',
  validateBody(
    Joi.object({
      nights: Joi.number().integer().min(1).default(4),
      travelers: Joi.number().integer().min(1).default(2),
      comfort: Joi.string().valid('backpacker', 'comfort', 'premium').default('premium')
    })
  ),
  estimateBudget
);

export default router;
