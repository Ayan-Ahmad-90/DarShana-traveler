import { Schema, model, Document } from 'mongoose';

export interface TaxConfigDocument extends Document {
  name: string;
  gstPercentage: number;
  serviceCharge: number;
  peakSurcharge: number;
  insuranceFee: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  isActive: boolean;
}

const taxConfigSchema = new Schema<TaxConfigDocument>(
  {
    name: { type: String, required: true },
    gstPercentage: { type: Number, default: 5 },
    serviceCharge: { type: Number, default: 0 },
    peakSurcharge: { type: Number, default: 0 },
    insuranceFee: { type: Number, default: 0 },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: Date,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default model<TaxConfigDocument>('TaxConfig', taxConfigSchema);
