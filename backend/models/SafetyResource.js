import mongoose from 'mongoose';

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

export default mongoose.model('SafetyResource', safetyResourceSchema);

