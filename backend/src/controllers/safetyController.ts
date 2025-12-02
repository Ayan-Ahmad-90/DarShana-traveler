import { Request, Response } from 'express';
// @ts-ignore
import SafetyResource from '../../models/SafetyResource.js';

// In-memory storage for demo purposes
const activeEmergencies: any[] = [];
const liveLocations = new Map();

export const getSafetyResources = async (req: Request, res: Response) => {
  try {
    const { region } = req.query;
    
    // Mock response if DB not connected or empty
    // @ts-ignore
    if (!SafetyResource) {
       return res.json({
        region: region || 'National',
        police: '100',
        ambulance: '102',
        womenHelpline: '1091',
        touristHelpline: '1363',
      });
    }

    const resources = await SafetyResource.findOne({ region: new RegExp(region as string, 'i') });
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

export const logEmergency = async (req: Request, res: Response) => {
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
    
    res.status(201).json({ success: true, message: 'Emergency logged', emergencyId: emergency.id });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to log emergency', error: error.message });
  }
};

export const updateLiveLocation = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { location } = req.body;
    
    liveLocations.set(userId, {
      location,
      lastUpdate: new Date()
    });
    
    console.log(`📍 Location updated for ${userId}:`, location);
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update location', error: error.message });
  }
};
