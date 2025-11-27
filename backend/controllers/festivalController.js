// backend/controllers/festivalController.js
const Festival = require('../models/Festival');
const Notification = require('../models/Notification');
const FestivalReminder = require('../models/FestivalReminder');

// Get all festivals
exports.getAllFestivals = async (req, res) => {
  try {
    const festivals = await Festival.find().sort({ startDate: 1 });
    res.json(festivals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch festivals', error: error.message });
  }
};

// Get festivals by location
exports.getFestivalsByLocation = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: 'Location parameter required' });
    }

    const festivals = await Festival.find({
      location: { $regex: location, $options: 'i' },
    }).sort({ startDate: 1 });

    res.json(festivals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch festivals', error: error.message });
  }
};

// Get upcoming festivals
exports.getUpcomingFestivals = async (req, res) => {
  try {
    const now = new Date();
    const festivals = await Festival.find({
      startDate: { $gte: now },
    }).sort({ startDate: 1 });

    res.json(festivals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch upcoming festivals', error: error.message });
  }
};

// Create festival reminder
exports.createReminder = async (req, res) => {
  try {
    const { festivalId, location } = req.body;

    if (!festivalId || !location) {
      return res.status(400).json({ message: 'Festival ID and location required' });
    }

    const festival = await Festival.findById(festivalId);
    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }

    // Check if reminder already exists
    const existingReminder = await FestivalReminder.findOne({
      userId: req.userId,
      festivalId,
    });

    if (existingReminder) {
      return res.status(409).json({ message: 'Reminder already set for this festival' });
    }

    const reminder = new FestivalReminder({
      userId: req.userId,
      festivalId,
      location,
      status: 'active',
    });

    await reminder.save();

    // Create notification
    const notification = new Notification({
      userId: req.userId,
      type: 'festival_alert',
      title: `Reminder Set: ${festival.name}`,
      message: `You'll receive alerts for ${festival.name} in ${location}`,
      relatedId: festivalId,
      read: false,
    });

    await notification.save();

    res.status(201).json({
      id: reminder._id,
      festivalId,
      status: 'active',
      message: 'Festival reminder set successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create reminder', error: error.message });
  }
};

// Get user's festival reminders
exports.getUserReminders = async (req, res) => {
  try {
    const reminders = await FestivalReminder.find({ userId: req.userId })
      .populate('festivalId')
      .sort({ createdAt: -1 });

    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reminders', error: error.message });
  }
};

// Delete reminder
exports.deleteReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;

    await FestivalReminder.findByIdAndDelete(reminderId);

    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete reminder', error: error.message });
  }
};

// Add festival (admin only)
exports.addFestival = async (req, res) => {
  try {
    const { name, location, startDate, endDate, description, image, significance } = req.body;

    const festival = new Festival({
      name,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description,
      image,
      significance,
    });

    await festival.save();

    res.status(201).json({
      id: festival._id,
      message: 'Festival added successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add festival', error: error.message });
  }
};
