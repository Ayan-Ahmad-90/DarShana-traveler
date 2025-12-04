const SafetyResource = require('../models/SafetyResource');

// In-memory storage for demo purposes (replace with DB in production)
const activeEmergencies = [];
const liveLocations = new Map();

exports.getSafetyResources = async (req, res) => {
  try {
    const { region } = req.query;
    // Mock response if DB not connected or empty
    if (!SafetyResource) {
       return res.json({
        region: region || 'National',
        police: '100',
        ambulance: '102',
        womenHelpline: '1091',
        touristHelpline: '1363',
      });
    }

    const resources = await SafetyResource.findOne({ region: new RegExp(region, 'i') });
    if (!resources) {
      // Return default/national numbers if region not found
      return res.json({
        region: 'National',
        police: '100',
        ambulance: '102',
        womenHelpline: '1091',
        touristHelpline: '1363',
      });
    }
    res.json(resources);
  } catch (error) {
    console.error('Safety resource error:', error);
    // Fallback
    res.json({
        region: 'National',
        police: '100',
        ambulance: '102',
        womenHelpline: '1091',
        touristHelpline: '1363',
    });
  }
};

export const logEmergency = async (req, res) => {
  try {
    const { type, location, timestamp } = req.body;
    const emergency = {
      id: Date.now(),
      type,
      location,
      timestamp,
      status: 'ACTIVE',
      ip: req.ip
    };
    
    activeEmergencies.push(emergency);
    console.log('🚨 EMERGENCY LOGGED:', emergency);
    
    // In a real app, trigger SMS/Email alerts here
    
    res.status(201).json({ success: true, message: 'Emergency logged', emergencyId: emergency.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to log emergency', error: error.message });
  }
};

export const updateLiveLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { location } = req.body;
    
    liveLocations.set(userId, {
      location,
      lastUpdate: new Date()
    });
    
    console.log(`📍 Location updated for ${userId}:`, location);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update location', error: error.message });
  }
};

