import { TaxConfigDocument } from '../models/TaxConfig.js';

interface FareInput {
  baseFare: number;
  couponDiscount?: number;
  walletAmount?: number;
  currency?: string;
  taxConfig?: TaxConfigDocument | null;
}

export const calculateFareBreakdown = ({
  baseFare,
  couponDiscount = 0,
  walletAmount = 0,
  currency = 'INR',
  taxConfig
}: FareInput) => {
  const gstRate = taxConfig?.gstPercentage ?? 5;
  const serviceCharge = taxConfig?.serviceCharge ?? 0;
  const peakSurcharge = taxConfig?.peakSurcharge ?? 0;
  const insuranceFee = taxConfig?.insuranceFee ?? 0;

  const gstAmount = (baseFare * gstRate) / 100;
  const totalFees = serviceCharge + peakSurcharge + insuranceFee;
  const gross = baseFare + gstAmount + totalFees;
  const discount = Math.min(couponDiscount, gross);
  const subtotal = gross - discount;
  const payableAmount = Math.max(subtotal - walletAmount, 0);

  return {
    baseFare,
    taxes: Number(gstAmount.toFixed(2)),
    fees: Number(totalFees.toFixed(2)),
    discounts: Number(discount.toFixed(2)),
    total: Number(subtotal.toFixed(2)),
    currency,
    walletAmount: Number(walletAmount.toFixed(2)),
    payableAmount: Number(payableAmount.toFixed(2)),
    gstAmount: Number(gstAmount.toFixed(2))
  };
};
