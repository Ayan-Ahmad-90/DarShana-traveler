import Guide from '../../models/Guide.js';
import User from '../../models/User.js';

export const createGuideProfile = async (payload: Record<string, unknown>) => {
  const user = await User.findById(payload.user);
  if (!user) throw new Error('User not found');
  if (!user.roles.includes('Guide')) {
    user.roles.push('Guide');
    user.primaryRole = 'Guide';
    await user.save();
  }
  return Guide.create(payload);
};

export const updateGuideStatus = async (guideId: string, status: string) => {
  return Guide.findByIdAndUpdate(guideId, { status }, { new: true });
};

export const listGuides = async (filters: Record<string, unknown> = {}) => {
  return Guide.find(filters).populate('user').sort({ createdAt: -1 });
};

export const updateGuideAvailability = async (guideId: string, payload: Record<string, unknown>) => {
  return Guide.findByIdAndUpdate(guideId, { availability: payload.availability }, { new: true });
};
