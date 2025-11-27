import { Router } from 'express';
import { LanguageController } from '../controllers/languageController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Language routes
router.get('/list', authMiddleware, LanguageController.getAvailableLanguages);
router.get('/user-language', authMiddleware, LanguageController.getUserLanguage);
router.put('/user-language', authMiddleware, LanguageController.updateUserLanguage);

export default router;
