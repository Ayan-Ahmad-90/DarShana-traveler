import { Request, Response, NextFunction } from 'express';
import { listTaxConfigs, createTaxConfig, updateTaxConfig } from './tax.service.js';

export const listTaxHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const configs = await listTaxConfigs();
    res.json(configs);
  } catch (error) {
    next(error);
  }
};

export const createTaxHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await createTaxConfig(req.body);
    res.status(201).json(config);
  } catch (error) {
    next(error);
  }
};

export const updateTaxHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await updateTaxConfig(req.params.id, req.body);
    res.json(config);
  } catch (error) {
    next(error);
  }
};
