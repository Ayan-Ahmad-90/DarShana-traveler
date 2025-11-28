const mongoose = require('mongoose');

const safetyResourceSchema = new mongoose.Schema({
  region: {
    type: String,
    required: true,
    unique: true,
  },
  police: String,
  ambulance: String,
  womenHelpline: String,
  touristHelpline: String,
  hospitals: [
    {
      name: String,
      address: String,
      phone: String,
    },
  ],
});

module.exports = mongoose.model('SafetyResource', safetyResourceSchema);
