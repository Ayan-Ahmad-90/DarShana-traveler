import Coupon from '../../models/Coupon.js';

export const createCoupon = async (payload: Record<string, unknown>) => {
  return Coupon.create(payload);
};

export const updateCoupon = async (id: string, payload: Record<string, unknown>) => {
  return Coupon.findByIdAndUpdate(id, payload, { new: true });
};

export const listCoupons = async () => {
  return Coupon.find().sort({ createdAt: -1 });
};

export const toggleCoupon = async (id: string, isActive: boolean) => {
  return Coupon.findByIdAndUpdate(id, { isActive }, { new: true });
};
