const SafetyResource = require('../models/SafetyResource');

exports.getSafetyResources = async (req, res) => {
  try {
    const { region } = req.query;
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
    res.status(500).json({ message: 'Failed to fetch safety resources', error: error.message });
  }
};
