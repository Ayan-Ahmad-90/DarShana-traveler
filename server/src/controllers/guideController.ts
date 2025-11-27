import { Request, Response } from 'express';
import LocalGuide from '../models/LocalGuide';
import GuideInteraction from '../models/GuideInteraction';
import { AuthRequest } from '../middleware/auth';

export class GuideController {
  // Register as local guide
  static async registerGuide(req: AuthRequest, res: Response) {
    try {
      const { name, email, phone, location, languages, specialization, bio, pricePerDay, availability } = req.body;

      // Check if already registered
      const existingGuide = await LocalGuide.findOne({ userId: req.userId });
      if (existingGuide) {
        return res.status(400).json({ success: false, message: 'Already registered as guide' });
      }

      const guide = await LocalGuide.create({
        userId: req.userId,
        name,
        email,
        phone,
        location,
        languages,
        specialization,
        bio,
        pricePerDay,
        availability
      });

      res.status(201).json({
        success: true,
        message: 'Guide registration successful',
        guide
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get guide profile
  static async getGuideProfile(req: AuthRequest, res: Response) {
    try {
      const guide = await LocalGuide.findOne({ userId: req.userId });
      
      if (!guide) {
        return res.status(404).json({ success: false, message: 'Guide profile not found' });
      }

      res.status(200).json({
        success: true,
        guide
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Update guide profile
  static async updateGuideProfile(req: AuthRequest, res: Response) {
    try {
      const { name, bio, pricePerDay, specialization, languages, availability } = req.body;

      const guide = await LocalGuide.findOneAndUpdate(
        { userId: req.userId },
        { name, bio, pricePerDay, specialization, languages, availability },
        { new: true }
      );

      if (!guide) {
        return res.status(404).json({ success: false, message: 'Guide profile not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Guide profile updated',
        guide
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get guides by location
  static async getGuidesByLocation(req: Request, res: Response) {
    try {
      const { location, specialization } = req.query;

      let query: any = {};
      if (location) query.location = new RegExp(location as string, 'i');
      if (specialization) query.specialization = specialization;
      query.verified = true;

      const guides = await LocalGuide.find(query)
        .sort({ rating: -1 })
        .populate('userId', 'name email profileImage');

      res.status(200).json({
        success: true,
        count: guides.length,
        guides
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get single guide
  static async getSingleGuide(req: Request, res: Response) {
    try {
      const { guideId } = req.params;

      const guide = await LocalGuide.findById(guideId).populate('userId', 'name email profileImage');
      
      if (!guide) {
        return res.status(404).json({ success: false, message: 'Guide not found' });
      }

      // Get guide's interactions/reviews
      const interactions = await GuideInteraction.find({ 
        guideId, 
        interactionType: 'review'
      }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        guide,
        reviews: interactions
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Interact with guide (inquiry/booking/review)
  static async interactWithGuide(req: AuthRequest, res: Response) {
    try {
      const { guideId, interactionType, message, tripDate, rating, reviewText } = req.body;

      const interaction = await GuideInteraction.create({
        userId: req.userId,
        guideId,
        interactionType,
        message,
        tripDate: tripDate || null,
        rating: rating || null,
        reviewText: reviewText || null,
        status: interactionType === 'review' ? 'completed' : 'pending'
      });

      // If it's a review, update guide's rating
      if (interactionType === 'review') {
        const guide = await LocalGuide.findById(guideId);
        if (guide) {
          const allReviews = await GuideInteraction.find({ 
            guideId, 
            interactionType: 'review' 
          });
          
          const totalRating = allReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
          guide.rating = totalRating / allReviews.length;
          guide.totalReviews = allReviews.length;
          await guide.save();
        }
      }

      res.status(201).json({
        success: true,
        message: 'Interaction recorded',
        interaction
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get guide's interactions
  static async getGuideInteractions(req: AuthRequest, res: Response) {
    try {
      const interactions = await GuideInteraction.find({ guideId: req.params.guideId })
        .populate('userId', 'name email profileImage')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: interactions.length,
        interactions
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get my interactions (for user)
  static async getMyInteractions(req: AuthRequest, res: Response) {
    try {
      const interactions = await GuideInteraction.find({ userId: req.userId })
        .populate('guideId')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: interactions.length,
        interactions
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
