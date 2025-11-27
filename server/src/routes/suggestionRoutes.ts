import express from 'express';
import { SuggestionController } from '../controllers/suggestionController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/festivals', authMiddleware, SuggestionController.getFestivals);
router.get('/sightseeing', authMiddleware, SuggestionController.getSightseeing);
router.get('/budget-options', authMiddleware, SuggestionController.getBudgetOptions);
router.get('/complete', authMiddleware, SuggestionController.getCompleteSuggestions);

export default router;
