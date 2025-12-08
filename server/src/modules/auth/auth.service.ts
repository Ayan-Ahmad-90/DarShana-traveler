import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User, { UserDocument, UserRole } from '../../models/User.js';
import { environment } from '../../config/environment.js';
import { sendMail } from '../../config/mailer.js';

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

const buildTokens = (user: UserDocument): AuthTokens => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    roles: user.roles,
    primaryRole: user.primaryRole
  };
  const accessToken = jwt.sign(payload, environment.jwt.accessSecret as any, {
    expiresIn: environment.jwt.accessExpiresIn as any
  });
  const refreshToken = jwt.sign(
    { ...payload, version: user.security?.refreshTokenVersion ?? 0 },
    environment.jwt.refreshSecret as any,
    { expiresIn: environment.jwt.refreshExpiresIn as any }
  );
  return {
    accessToken,
    refreshToken,
    expiresIn: environment.jwt.accessExpiresIn
  };
};

const sanitizeUser = (user: UserDocument) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, security, __v, ...rest } = user.toObject();
  return rest;
};

export const registerUser = async (payload: RegisterPayload) => {
  const existing = await User.findOne({ email: payload.email.toLowerCase() });
  if (existing) {
    throw new Error('An account already exists for this email');
  }
  const roles = payload.role ? [payload.role] : undefined;
  const user = await User.create({
    ...payload,
    roles,
    primaryRole: payload.role ?? 'Traveler'
  });
  const tokens = buildTokens(user);
  return { user: sanitizeUser(user), tokens };
};

export const loginUser = async ({ email, password }: LoginPayload) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error('Invalid credentials');
  const valid = await user.comparePassword(password);
  if (!valid) throw new Error('Invalid credentials');

  user.lastLoginAt = new Date();
  await user.save();
  const tokens = buildTokens(user);
  return { user: sanitizeUser(user), tokens };
};

export const refreshTokens = async (token: string) => {
  const decoded = jwt.verify(token, environment.jwt.refreshSecret) as {
    id: string;
    version: number;
  };
  const user = await User.findById(decoded.id);
  if (!user) throw new Error('User not found');
  if ((user.security?.refreshTokenVersion ?? 0) !== decoded.version) {
    throw new Error('Token revoked');
  }
  const tokens = buildTokens(user);
  return { user: sanitizeUser(user), tokens };
};

export const logoutUser = async (userId: string) => {
  await User.findByIdAndUpdate(userId, {
    $inc: { 'security.refreshTokenVersion': 1 }
  });
};

export const requestPasswordReset = async (email: string) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return;
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 15 * 60 * 1000);
  user.security = {
    ...user.security,
    passwordResetToken: token,
    passwordResetExpires: expires
  };
  await user.save();

  await sendMail({
    to: user.email,
    subject: 'DarShana Password Reset',
    html: `<p>Use this OTP to reset your password: <strong>${token}</strong></p>`
  });
};

export const resetPassword = async (token: string, password: string) => {
  const user = await User.findOne({
    'security.passwordResetToken': token,
    'security.passwordResetExpires': { $gt: new Date() }
  });
  if (!user) throw new Error('Invalid or expired token');

  user.password = password;
  user.security = {
    ...user.security,
    passwordResetToken: undefined,
    passwordResetExpires: undefined,
    refreshTokenVersion: (user.security?.refreshTokenVersion ?? 0) + 1
  };
  await user.save();
};
