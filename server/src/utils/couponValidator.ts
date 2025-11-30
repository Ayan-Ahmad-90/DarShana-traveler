import Coupon, { CouponDocument } from '../models/Coupon.js';

interface ValidationResult {
  isValid: boolean;
  discountAmount: number;
  coupon?: CouponDocument;
  reason?: string;
}

export const validateCoupon = async (
  code: string,
  orderAmount: number,
  userId?: string
): Promise<ValidationResult> => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) return { isValid: false, discountAmount: 0, reason: 'Coupon not found' };

  const now = new Date();
  if (coupon.startDate > now || coupon.endDate < now) {
    return { isValid: false, discountAmount: 0, reason: 'Coupon expired' };
  }
  if (!coupon.isActive) {
    return { isValid: false, discountAmount: 0, reason: 'Coupon disabled' };
  }
  if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
    return { isValid: false, discountAmount: 0, reason: 'Amount below minimum' };
  }
  if (coupon.usageLimit && coupon.redemptions >= coupon.usageLimit) {
    return { isValid: false, discountAmount: 0, reason: 'Usage limit reached' };
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  return { isValid: true, discountAmount, coupon };
};
