import { Request, Response } from 'express';
import EcoActivity from '../models/EcoActivity';
import Reward from '../models/Reward';
import { AuthRequest } from '../middleware/auth';

export class RewardController {
  // Log eco-friendly activity
  static async logActivity(req: AuthRequest, res: Response) {
    try {
      const { activityType, distance, location, description } = req.body;
      
      // Calculate points and carbon saved based on activity
      const pointsMap: any = {
        'walking': 10,
        'cycling': 15,
        'public_transport': 20,
        'carpool': 25,
        'electric_vehicle': 30
      };

      const carbonSavedMap: any = {
        'walking': 0,
        'cycling': 0.5,
        'public_transport': 2.5,
        'carpool': 1.5,
        'electric_vehicle': 3
      };

      const points = pointsMap[activityType] || 10;
      const carbonSaved = (carbonSavedMap[activityType] || 0) * (distance || 1);

      const activity = await EcoActivity.create({
        userId: req.userId,
        activityType,
        distance: distance || 0,
        carbonSaved,
        points,
        location,
        description
      });

      // Update user's reward
      let reward = await Reward.findOne({ userId: req.userId });
      
      if (!reward) {
        reward = await Reward.create({
          userId: req.userId,
          totalPoints: points,
          redeemablePoints: points,
          totalCarbonSaved: carbonSaved,
          activities: 1
        });
      } else {
        reward.totalPoints += points;
        reward.redeemablePoints += points;
        reward.totalCarbonSaved += carbonSaved;
        reward.activities += 1;

        // Update tier based on points
        if (reward.totalPoints >= 1000) reward.tier = 'platinum';
        else if (reward.totalPoints >= 500) reward.tier = 'gold';
        else if (reward.totalPoints >= 200) reward.tier = 'silver';
        else reward.tier = 'bronze';

        // Award badges
        const badges = [];
        if (reward.totalPoints >= 100 && !reward.badges.includes('carbon_warrior')) badges.push('carbon_warrior');
        if (reward.activities >= 10 && !reward.badges.includes('green_traveler')) badges.push('green_traveler');
        if (reward.tier === 'platinum' && !reward.badges.includes('eco_champion')) badges.push('eco_champion');
        if (reward.totalCarbonSaved >= 50 && !reward.badges.includes('nature_lover')) badges.push('nature_lover');
        if (reward.totalCarbonSaved >= 100 && !reward.badges.includes('sustainability_star')) badges.push('sustainability_star');

        if (badges.length > 0) {
          reward.badges = [...new Set([...reward.badges, ...badges])];
        }

        await reward.save();
      }

      res.status(201).json({
        success: true,
        message: 'Activity logged successfully',
        activity,
        reward
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get user rewards
  static async getUserRewards(req: AuthRequest, res: Response) {
    try {
      const reward = await Reward.findOne({ userId: req.userId }).populate('userId');
      
      if (!reward) {
        return res.status(404).json({ success: false, message: 'Rewards not found' });
      }

      const activities = await EcoActivity.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(10);

      res.status(200).json({
        success: true,
        reward,
        recentActivities: activities
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get leaderboard
  static async getLeaderboard(req: Request, res: Response) {
    try {
      const leaderboard = await Reward.find()
        .sort({ totalPoints: -1 })
        .limit(50)
        .populate('userId', 'name email profileImage');

      res.status(200).json({
        success: true,
        leaderboard
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Redeem points
  static async redeemPoints(req: AuthRequest, res: Response) {
    try {
      const { pointsToRedeem } = req.body;

      const reward = await Reward.findOne({ userId: req.userId });
      
      if (!reward) {
        return res.status(404).json({ success: false, message: 'Rewards not found' });
      }

      if (reward.redeemablePoints < pointsToRedeem) {
        return res.status(400).json({ success: false, message: 'Insufficient points' });
      }

      reward.redeemablePoints -= pointsToRedeem;
      await reward.save();

      res.status(200).json({
        success: true,
        message: `Successfully redeemed ${pointsToRedeem} points`,
        remainingPoints: reward.redeemablePoints,
        discount: Math.floor(pointsToRedeem / 10) // 1 point = 0.1 currency unit
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
