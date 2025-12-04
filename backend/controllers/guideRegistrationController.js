/**
 * Guide Registration & Management Controller
 * Handles guide registration, profile updates, request management, and statistics
 */

import LocalGuide from '../models/LocalGuide.js';
import GuideRequest from '../models/GuideRequest.js';
import User from '../models/User.js';

/**
 * Register a new guide
 * POST /api/guides/register
 */
export const registerGuide = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      fullName,
      email,
      phone,
      location,
      specialties,
      languages,
      bio,
      pricePerDay,
      experience,
      certifications,
      responseTime,
      availability,
    } = req.body;

    // Parse JSON strings if they come as such
    let parsedSpecialties = specialties;
    let parsedLanguages = languages;
    let parsedCertifications = certifications;

    if (typeof specialties === 'string') {
      parsedSpecialties = JSON.parse(specialties);
    }
    if (typeof languages === 'string') {
      parsedLanguages = JSON.parse(languages);
    }
    if (typeof certifications === 'string') {
      parsedCertifications = JSON.parse(certifications);
    }

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !location ||
      !parsedSpecialties ||
      !parsedLanguages ||
      !bio
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check if guide already exists for this user
    const existingGuide = await LocalGuide.findOne({ email });
    if (existingGuide) {
      return res.status(409).json({
        success: false,
        message: 'Guide profile with this email already exists',
      });
    }

    // Handle file uploads (if using multer for image/document uploads)
    const idProof = req.files?.idProof?.[0]?.path;
    const backgroundCheck = req.files?.backgroundCheck?.[0]?.path;

    if (!idProof || !backgroundCheck) {
      return res.status(400).json({
        success: false,
        message: 'ID proof and background check documents are required',
      });
    }

    // Create new guide profile
    const newGuide = new LocalGuide({
      name: fullName,
      email,
      phone,
      location,
      specialties: parsedSpecialties,
      languages: parsedLanguages,
      bio,
      pricePerDay: parseFloat(pricePerDay),
      experience: `${experience} years`,
      certifications: parsedCertifications || [],
      responseTime,
      availability,
      rating: 0,
      reviews: 0,
      profileImage: 'https://via.placeholder.com/150',
      verified: false, // Initially unverified, requires admin review
      totalTrips: 0,
    });

    await newGuide.save();

    res.status(201).json({
      success: true,
      message: 'Guide registration submitted. Please wait for verification.',
      guide: newGuide,
    });
  } catch (error) {
    console.error('Guide registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering guide',
      error: error.message,
    });
  }
};

/**
 * Get all verified guides with optional filtering
 * GET /api/guides?location=&specialty=&minRating=&verified=true
 */
export const getAllGuides = async (req, res) => {
  try {
    const { location, specialty, minRating = 0, verified = true } = req.query;

    let query = {};

    // Only show verified guides by default
    if (verified !== 'false') {
      query.verified = true;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (specialty) {
      query.specialties = specialty;
    }

    if (minRating && minRating > 0) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    const guides = await LocalGuide.find(query).sort({ rating: -1 });

    res.json({
      success: true,
      count: guides.length,
      guides,
    });
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching guides',
      error: error.message,
    });
  }
};

/**
 * Get guide by ID (for public viewing)
 * GET /api/guides/:guideId
 */
export const getGuideById = async (req, res) => {
  try {
    const { guideId } = req.params;

    const guide = await LocalGuide.findById(guideId);

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found',
      });
    }

    res.json(guide);
  } catch (error) {
    console.error('Error fetching guide:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching guide',
      error: error.message,
    });
  }
};

/**
 * Get current user's guide profile
 * GET /api/guides/me
 */
export const getMyGuideProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const guide = await LocalGuide.findOne({ userId });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide profile not found',
      });
    }

    res.json(guide);
  } catch (error) {
    console.error('Error fetching guide profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching guide profile',
      error: error.message,
    });
  }
};

/**
 * Update guide profile
 * PUT /api/guides/me
 */
export const updateGuideProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const updates = req.body;

    // Don't allow updates to verified status or rating from user
    delete updates.verified;
    delete updates.rating;
    delete updates.reviews;

    const guide = await LocalGuide.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide profile not found',
      });
    }

    res.json({
      success: true,
      message: 'Guide profile updated successfully',
      guide,
    });
  } catch (error) {
    console.error('Error updating guide profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating guide profile',
      error: error.message,
    });
  }
};

/**
 * Get guide statistics
 * GET /api/guides/stats
 */
export const getGuideStats = async (req, res) => {
  try {
    const userId = req.userId;

    const guide = await LocalGuide.findOne({ userId });
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide profile not found',
      });
    }

    const requests = await GuideRequest.find({ guideId: guide._id });
    const acceptedRequests = requests.filter((r) => r.status === 'accepted');
    const completedTrips = requests.filter((r) => r.status === 'completed');

    // Calculate response rate
    const totalRequests = requests.length;
    const responseRate =
      totalRequests > 0
        ? Math.round(
            ((acceptedRequests.length + completedTrips.length) / totalRequests) * 100
          )
        : 0;

    // Calculate total earnings (assuming ₹ per day rate)
    const totalEarnings = completedTrips.length * (guide.pricePerDay || 0);

    const stats = {
      totalRequests,
      acceptedRequests: acceptedRequests.length,
      completedTrips: completedTrips.length,
      totalEarnings,
      rating: guide.rating,
      reviewCount: guide.reviews,
      responseRate,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching guide stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching guide statistics',
      error: error.message,
    });
  }
};

/**
 * Get requests for current guide
 * GET /api/guides/requests
 */
export const getGuideRequests = async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    const guide = await LocalGuide.findOne({ userId });
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide profile not found',
      });
    }

    let query = { guideId: guide._id };
    if (status) {
      query.status = status;
    }

    const requests = await GuideRequest.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('Error fetching guide requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching requests',
      error: error.message,
    });
  }
};

/**
 * Accept a guide request
 * PUT /api/guides/requests/:requestId/accept
 */
export const acceptGuideRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { requestId } = req.params;

    const request = await GuideRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Verify guide ownership
    const guide = await LocalGuide.findOne({ userId });
    if (!guide || guide._id.toString() !== request.guideId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this request',
      });
    }

    request.status = 'accepted';
    await request.save();

    // TODO: Send notification to traveler

    res.json({
      success: true,
      message: 'Request accepted',
      request,
    });
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting request',
      error: error.message,
    });
  }
};

/**
 * Reject a guide request
 * PUT /api/guides/requests/:requestId/reject
 */
export const rejectGuideRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { requestId } = req.params;
    const { reason } = req.body;

    const request = await GuideRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Verify guide ownership
    const guide = await LocalGuide.findOne({ userId });
    if (!guide || guide._id.toString() !== request.guideId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this request',
      });
    }

    request.status = 'rejected';
    if (reason) {
      request.rejectionReason = reason;
    }
    await request.save();

    // TODO: Send notification to traveler

    res.json({
      success: true,
      message: 'Request rejected',
      request,
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting request',
      error: error.message,
    });
  }
};

/**
 * Mark trip as completed
 * PUT /api/guides/requests/:requestId/complete
 */
export const completeTrip = async (req, res) => {
  try {
    const userId = req.userId;
    const { requestId } = req.params;

    const request = await GuideRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Verify guide ownership
    const guide = await LocalGuide.findOne({ userId });
    if (!guide || guide._id.toString() !== request.guideId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this trip',
      });
    }

    request.status = 'completed';
    request.resolvedAt = new Date();
    await request.save();

    // Increment total trips
    guide.totalTrips = (guide.totalTrips || 0) + 1;
    await guide.save();

    res.json({
      success: true,
      message: 'Trip marked as completed',
      request,
    });
  } catch (error) {
    console.error('Error completing trip:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing trip',
      error: error.message,
    });
  }
};

/**
 * Update guide rating (called after trip completion)
 * PUT /api/guides/:guideId/rate
 */
export const rateGuide = async (req, res) => {
  try {
    const { guideId } = req.params;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const guide = await LocalGuide.findById(guideId);
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found',
      });
    }

    // Calculate new average rating
    const totalRatings = guide.reviews + 1;
    const newRating = ((guide.rating * guide.reviews) + rating) / totalRatings;

    guide.rating = Math.round(newRating * 10) / 10; // Round to 1 decimal
    guide.reviews = totalRatings;

    // Store review if provided
    if (review) {
      guide.recentReviews = guide.recentReviews || [];
      guide.recentReviews.push({
        rating,
        review,
        date: new Date(),
      });
    }

    await guide.save();

    res.json({
      success: true,
      message: 'Guide rating updated',
      guide: {
        rating: guide.rating,
        reviews: guide.reviews,
      },
    });
  } catch (error) {
    console.error('Error rating guide:', error);
    res.status(500).json({
      success: false,
      message: 'Error rating guide',
      error: error.message,
    });
  }
};

/**
 * Get guide availability
 * GET /api/guides/:guideId/availability
 */
export const getGuideAvailability = async (req, res) => {
  try {
    const { guideId } = req.params;
    const { startDate, endDate } = req.query;

    const guide = await LocalGuide.findById(guideId);
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found',
      });
    }

    // Get booked dates
    const bookedDates = await GuideRequest.find({
      guideId,
      status: { $in: ['accepted', 'completed'] },
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
    });

    const available =
      guide.availability === 'available' && bookedDates.length === 0;

    res.json({
      available,
      bookedDates: bookedDates.map((r) => ({
        startDate: r.startDate,
        endDate: r.endDate,
      })),
    });
  } catch (error) {
    console.error('Error checking guide availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message,
    });
  }
};

export default { registerGuide, getAllGuides, getGuideById, getMyGuideProfile, updateGuideProfile, getGuideStats, getGuideRequests, acceptGuideRequest, rejectGuideRequest, completeTrip, rateGuide, getGuideAvailability };

