import TaxConfig from '../../models/TaxConfig.js';

export const listTaxConfigs = () => TaxConfig.find().sort({ effectiveFrom: -1 });
export const createTaxConfig = (payload: Record<string, unknown>) => TaxConfig.create(payload);
export const updateTaxConfig = (id: string, payload: Record<string, unknown>) =>
  TaxConfig.findByIdAndUpdate(id, payload, { new: true });
