// backend/controllers/guideController.js
const LocalGuide = require('../models/LocalGuide');
const GuideRequest = require('../models/GuideRequest');
const Notification = require('../models/Notification');

// Get all guides (with optional location filter)
exports.getGuides = async (req, res) => {
  try {
    const { location } = req.query;

    let query = {};
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const guides = await LocalGuide.find(query).sort({ rating: -1 });
    res.json(guides);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch guides', error: error.message });
  }
};

// Get guide by ID
exports.getGuideById = async (req, res) => {
  try {
    const { guideId } = req.params;

    const guide = await LocalGuide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    res.json(guide);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch guide', error: error.message });
  }
};

// Submit guide request
exports.submitGuideRequest = async (req, res) => {
  try {
    const { guideId, requestType, message } = req.body;

    if (!guideId || !requestType || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const guideRequest = new GuideRequest({
      userId: req.userId,
      guideId,
      requestType,
      message,
      status: 'pending',
    });

    await guideRequest.save();

    // Create notification for guide (in real scenario)
    const notification = new Notification({
      userId: guideId,
      type: 'guide_response',
      title: 'New Request from Traveler',
      message: `You have a new ${requestType.replace('_', ' ')} request from a traveler.`,
      relatedId: guideRequest._id,
      read: false,
    });

    await notification.save();

    res.status(201).json({
      id: guideRequest._id,
      status: 'pending',
      createdAt: guideRequest.createdAt,
      message: 'Request sent to guide. They will respond shortly.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit request', error: error.message });
  }
};

// Get user's guide requests
exports.getUserGuideRequests = async (req, res) => {
  try {
    const requests = await GuideRequest.find({ userId: req.userId })
      .populate('guideId', 'name email phone location specialties')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
  }
};

// Get guide's requests (guide endpoint)
exports.getGuideRequests = async (req, res) => {
  try {
    const { guideId } = req.params;

    const requests = await GuideRequest.find({ guideId })
      .populate('userId', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch guide requests', error: error.message });
  }
};

// Update guide request status
exports.updateGuideRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!['pending', 'accepted', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const guideRequest = await GuideRequest.findByIdAndUpdate(
      requestId,
      {
        status,
        resolvedAt: status === 'completed' ? new Date() : undefined,
      },
      { new: true }
    );

    if (!guideRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Request status updated', data: guideRequest });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update request', error: error.message });
  }
};
