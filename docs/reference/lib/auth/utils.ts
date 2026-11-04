import { createHash, randomBytes, timingSafeEqual } from 'crypto';

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 2;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 5;
const SESSION_EXPIRY_DAYS = 30;

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function hashOtp(otp: string): string {
  return createHash('sha256').update(otp).digest('hex');
}

export function verifyOtpHash(otp: string, hash: string): boolean {
  const hashed = hashOtp(otp);
  return timingSafeEqual(Buffer.from(hashed), Buffer.from(hash));
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function normalizePhone(phone: string): string {
  let normalized = phone.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  normalized = normalized.replace(/[^0-9]/g, '');
  if (normalized.startsWith('98')) {
    normalized = '0' + normalized.slice(2);
  } else if (normalized.startsWith('+98')) {
    normalized = '0' + normalized.slice(3);
  } else if (normalized.startsWith('0098')) {
    normalized = '0' + normalized.slice(4);
  }
  if (!normalized.startsWith('0')) {
    normalized = '0' + normalized;
  }
  return normalized;
}

export function isValidIranianMobile(phone: string): boolean {
  return /^09\d{9}$/.test(phone);
}

export function formatPhoneForDisplay(phone: string): string {
  if (!/^09\d{9}$/.test(phone)) return phone;
  return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
}

export const AUTH_CONFIG = {
  otpLength: OTP_LENGTH,
  otpExpiryMs: OTP_EXPIRY_MINUTES * 60 * 1000,
  resendCooldownMs: RESEND_COOLDOWN_SECONDS * 1000,
  maxAttempts: MAX_ATTEMPTS,
  sessionExpiryMs: SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  cookieName: 'nobt_session',
} as const;

export type OtpPurpose = 'owner_login' | 'customer_login' | 'owner_register';

export function getOtpPurposeLabel(purpose: OtpPurpose): string {
  switch (purpose) {
    case 'owner_login':
      return 'ورود مالک';
    case 'customer_login':
      return 'ورود مشتری';
    case 'owner_register':
      return 'ثبت‌نام مالک';
  }
}