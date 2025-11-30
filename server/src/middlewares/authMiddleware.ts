import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from '../config/environment.js';

export interface AuthenticatedUserPayload {
  id: string;
  email: string;
  roles: string[];
  primaryRole: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUserPayload;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    const bearerToken = header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;
    const token = req.cookies?.accessToken || bearerToken;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, environment.jwt.accessSecret) as AuthenticatedUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const optionalAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const bearerToken = header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;
  const token = req.cookies?.accessToken || bearerToken;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, environment.jwt.accessSecret) as AuthenticatedUserPayload;
    req.user = decoded;
  } catch (error) {
    // ignore invalid tokens for optional auth
  }
  next();
};

export const requireRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRoles = req.user?.roles || [];
    if (!userRoles.some((role) => roles.includes(role))) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};
