import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

export class UserController {
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await User.findById(req.userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        success: true,
        user
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { name, phone, gender, dob, address, city, country, travelInterests, preferredLanguage } = req.body;

      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          name,
          phone,
          gender,
          dob,
          address,
          city,
          country,
          travelInterests,
          preferredLanguage
        },
        { new: true, runValidators: true }
      ).select('-password');

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateProfileImage(req: AuthRequest, res: Response) {
    try {
      const { profileImage } = req.body;

      if (!profileImage) {
        return res.status(400).json({ message: 'Profile image URL is required' });
      }

      const user = await User.findByIdAndUpdate(
        req.userId,
        { profileImage },
        { new: true }
      ).select('-password');

      res.status(200).json({
        success: true,
        message: 'Profile image updated successfully',
        user
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteAccount(req: AuthRequest, res: Response) {
    try {
      await User.findByIdAndDelete(req.userId);

      res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
