import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import FestivalAlert from '../models/FestivalAlert';
import User from '../models/User';

export class FestivalController {
  static async getAlerts(req: AuthRequest, res: Response) {
    try {
      const { region } = req.query;
      
      let query: any = {};
      if (region) {
        query.region = region;
      }

      const alerts = await FestivalAlert.find(query).sort({ date: 1 });

      res.status(200).json({
        success: true,
        alerts
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async subscribeToFestival(req: AuthRequest, res: Response) {
    try {
      const { festivalId, region } = req.body;

      // Get user's current notification preferences
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user's notification preferences
      if (!user.notificationPreferences) {
        user.notificationPreferences = {
          emailNotifications: true,
          festivalAlerts: true,
          smsNotifications: false,
          region: region || ''
        };
      } else {
        user.notificationPreferences.festivalAlerts = true;
        if (region) {
          user.notificationPreferences.region = region;
        }
      }
      await user.save();

      // Add user to festival subscribers
      const festival = await FestivalAlert.findByIdAndUpdate(
        festivalId,
        { $addToSet: { subscribers: req.userId } },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Subscribed to festival alerts',
        festival
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async unsubscribeFromFestival(req: AuthRequest, res: Response) {
    try {
      const { festivalId } = req.body;

      const festival = await FestivalAlert.findByIdAndUpdate(
        festivalId,
        { $pull: { subscribers: req.userId } },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Unsubscribed from festival alerts',
        festival
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateNotificationPreferences(req: AuthRequest, res: Response) {
    try {
      const { emailNotifications, festivalAlerts, smsNotifications, region } = req.body;

      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          notificationPreferences: {
            emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
            festivalAlerts: festivalAlerts !== undefined ? festivalAlerts : true,
            smsNotifications: smsNotifications !== undefined ? smsNotifications : false,
            region: region || ''
          }
        },
        { new: true }
      ).select('-password');

      res.status(200).json({
        success: true,
        message: 'Notification preferences updated',
        user
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
