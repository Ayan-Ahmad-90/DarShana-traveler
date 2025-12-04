import { Schema, model, Document } from 'mongoose';

export type DiscountType = 'percentage' | 'flat';

export interface CouponDocument extends Document {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  usagePerUser?: number;
  isActive: boolean;
  redemptions: number;
}

const couponSchema = new Schema<CouponDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    description: String,
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      default: 'percentage'
    },
    discountValue: { type: Number, required: true },
    maxDiscount: Number,
    minOrderAmount: Number,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: Number,
    usagePerUser: Number,
    isActive: { type: Boolean, default: true },
    redemptions: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default model<CouponDocument>('Coupon', couponSchema);
