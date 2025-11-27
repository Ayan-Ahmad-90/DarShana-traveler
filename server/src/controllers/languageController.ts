import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' }
];

export class LanguageController {
  static async getAvailableLanguages(req: AuthRequest, res: Response) {
    try {
      res.status(200).json({
        success: true,
        languages: SUPPORTED_LANGUAGES
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateUserLanguage(req: AuthRequest, res: Response) {
    try {
      const { language } = req.body;

      if (!language) {
        return res.status(400).json({ message: 'Language code is required' });
      }

      const isValidLanguage = SUPPORTED_LANGUAGES.some(lang => lang.code === language);
      if (!isValidLanguage) {
        return res.status(400).json({ message: 'Invalid language code' });
      }

      const user = await User.findByIdAndUpdate(
        req.userId,
        { preferredLanguage: language },
        { new: true }
      ).select('-password');

      res.status(200).json({
        success: true,
        message: 'Language preference updated',
        user
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getUserLanguage(req: AuthRequest, res: Response) {
    try {
      const user = await User.findById(req.userId).select('preferredLanguage');

      res.status(200).json({
        success: true,
        language: user?.preferredLanguage || 'en'
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
