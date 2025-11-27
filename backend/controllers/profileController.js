// backend/controllers/profileController.js
const User = require('../models/User');
const Trip = require('../models/Trip');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's trips
    const upcomingTrips = await Trip.find({
      userId: req.userId,
      startDate: { $gt: new Date() },
    }).sort({ startDate: 1 });

    const pastTrips = await Trip.find({
      userId: req.userId,
      endDate: { $lt: new Date() },
    }).sort({ endDate: -1 });

    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      preferences: user.preferences,
      upcomingTrips,
      pastTrips,
      savedDestinations: user.savedDestinations || [],
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone, profileImage, preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        fullName: fullName || undefined,
        email: email || undefined,
        phone: phone || undefined,
        profileImage: profileImage || undefined,
        preferences: preferences || undefined,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// Save destination to user profile
exports.saveDestination = async (req, res) => {
  try {
    const { destination } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $push: { savedDestinations: destination } },
      { new: true }
    );

    res.json({ message: 'Destination saved', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save destination', error: error.message });
  }
};
