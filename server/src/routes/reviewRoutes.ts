import { Router } from 'express';
import Joi from 'joi';
import { listReviews, createReview } from '../controllers/reviewController.js';
import { validateBody } from '../middlewares/requestValidator.js';

const router = Router();

const reviewSchema = Joi.object({
  user: Joi.string().required(),
  destination: Joi.string().optional(),
  title: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().required()
});

router.get('/', listReviews);
router.post('/', validateBody(reviewSchema), createReview);

export default router;
