import { Request, Response, NextFunction } from 'express';
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  requestPasswordReset,
  resetPassword
} from './auth.service.js';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: 15 * 60 * 1000
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, tokens } = await registerUser(req.body);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.status(201).json({ user, tokens });
  } catch (error) {
    next(error);
  }
};

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, tokens } = await loginUser(req.body);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.json({ user, tokens });
  } catch (error) {
    next(error);
  }
};

export const handleRefresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token missing' });
    const { user, tokens } = await refreshTokens(token);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.json({ user, tokens });
  } catch (error) {
    next(error);
  }
};

export const handleLogout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      await logoutUser(req.user.id);
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (error) {
    next(error);
  }
};

export const handleForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await requestPasswordReset(req.body.email);
    res.json({ message: 'If an account exists, an email has been sent.' });
  } catch (error) {
    next(error);
  }
};

export const handleResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;
    await resetPassword(token, password);
    res.json({ message: 'Password updated' });
  } catch (error) {
    next(error);
  }
};
