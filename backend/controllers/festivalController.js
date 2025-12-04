// backend/controllers/festivalController.js
const Festival = require('../models/Festival');
const Notification = require('../models/Notification');
const FestivalReminder = require('../models/FestivalReminder');

// Sample festivals data (used when DB is empty)
const sampleFestivals = [
  {
    _id: 'durga-puja-2025',
    name: 'Durga Puja',
    region: 'East India',
    date: '2025-10-21',
    description: 'The grand festival celebrating Goddess Durga with elaborate pandals, cultural performances, and community gatherings across Kolkata and Bengal.',
    subscribers: []
  },
  {
    _id: 'dussehra-2025',
    name: 'Dussehra / Vijayadashami',
    region: 'North India',
    date: '2025-10-23',
    description: 'Victory of good over evil celebrated with Ramlila performances and burning of Ravana effigies.',
    subscribers: []
  },
  {
    _id: 'diwali-2025',
    name: 'Diwali - Festival of Lights',
    region: 'North India',
    date: '2025-11-12',
    description: 'The biggest festival of India! Celebrate with diyas, fireworks, rangoli, sweets, and family gatherings.',
    subscribers: []
  },
  {
    _id: 'bhai-dooj-2025',
    name: 'Bhai Dooj',
    region: 'North India',
    date: '2025-11-14',
    description: 'A celebration of the bond between brothers and sisters, with tilak ceremonies and gift exchanges.',
    subscribers: []
  },
  {
    _id: 'chhath-puja-2025',
    name: 'Chhath Puja',
    region: 'East India',
    date: '2025-11-16',
    description: 'Ancient Hindu festival dedicated to Sun God. Devotees fast and offer prayers at riverbanks.',
    subscribers: []
  },
  {
    _id: 'kartik-purnima-2025',
    name: 'Kartik Purnima',
    region: 'Central India',
    date: '2025-11-27',
    description: 'Sacred full moon day with Dev Deepawali celebrations in Varanasi. Thousands of diyas light up the ghats.',
    subscribers: []
  },
  {
    _id: 'hornbill-2025',
    name: 'Hornbill Festival',
    region: 'North-East India',
    date: '2025-12-01',
    description: 'The "Festival of Festivals" in Nagaland showcasing tribal culture, traditional dances, and local cuisine.',
    subscribers: []
  },
  {
    _id: 'rann-utsav-2025',
    name: 'Rann Utsav',
    region: 'West India',
    date: '2025-12-10',
    description: 'Experience the magical white desert of Kutch under full moon. Folk music, handicrafts, and luxury tent stays.',
    subscribers: []
  },
  {
    _id: 'christmas-goa-2025',
    name: 'Christmas in Goa',
    region: 'West India',
    date: '2025-12-25',
    description: 'Celebrate Christmas with Portuguese-influenced traditions, midnight masses, and beach parties.',
    subscribers: []
  },
  {
    _id: 'konark-dance-2025',
    name: 'Konark Dance Festival',
    region: 'East India',
    date: '2025-12-20',
    description: 'Classical dance performances against the backdrop of the magnificent Sun Temple.',
    subscribers: []
  }
];

// Get festival alerts (for Festival Alerts page)
exports.getAlerts = async (req, res) => {
  try {
    const { region } = req.query;
    
    // Try to get from DB first
    let festivals = await Festival.find().sort({ startDate: 1 });
    
    // If DB is empty, use sample data
    if (!festivals || festivals.length === 0) {
      festivals = sampleFestivals;
    } else {
      // Map DB festivals to expected format
      festivals = festivals.map(f => ({
        _id: f._id.toString(),
        name: f.name,
        region: f.location || 'India',
        date: f.startDate || f.date,
        description: f.description,
        subscribers: f.subscribers || []
      }));
    }
    
    // Filter by region if specified
    if (region) {
      festivals = festivals.filter(f => 
        f.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    
    res.json({ 
      success: true,
      alerts: festivals 
    });
  } catch (error) {
    // Return sample data on error
    let festivals = sampleFestivals;
    const { region } = req.query;
    
    if (region) {
      festivals = festivals.filter(f => 
        f.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    
    res.json({ 
      success: true,
      alerts: festivals 
    });
  }
};

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
