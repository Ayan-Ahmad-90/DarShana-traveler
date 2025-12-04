import { Request, Response, NextFunction } from 'express';
import { createCoupon, updateCoupon, listCoupons, toggleCoupon } from './coupon.service.js';

export const createCouponHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await createCoupon(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

export const updateCouponHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await updateCoupon(req.params.id, req.body);
    res.json(coupon);
  } catch (error) {
    next(error);
  }
};

export const listCouponsHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await listCoupons();
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

export const toggleCouponHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await toggleCoupon(req.params.id, req.body.isActive);
    res.json(coupon);
  } catch (error) {
    next(error);
  }
};
