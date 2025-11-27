import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';
import { registerSchema, loginSchema } from '../utils/validators.js';
import { AuthRequest } from '../middleware/auth.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const result = await AuthService.register(value);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const result = await AuthService.login(value.email, value.password);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await AuthService.getUserById(req.userId!);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          dob: user.dob,
          profileImage: user.profileImage,
          address: user.address,
          city: user.city,
          country: user.country,
          preferredLanguage: user.preferredLanguage,
          travelInterests: user.travelInterests,
          notificationPreferences: user.notificationPreferences
        }
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getMe(req: AuthRequest, res: Response) {
    try {
      const user = await AuthService.getUserById(req.userId!);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          dob: user.dob,
          profileImage: user.profileImage,
          address: user.address,
          preferredLanguage: user.preferredLanguage,
          travelInterests: user.travelInterests
        }
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const user = await AuthService.updateProfile(req.userId!, req.body);
      res.status(200).json({ message: 'Profile updated', user });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
