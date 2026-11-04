import { AUTH_CONFIG } from '@/lib/auth/utils';

export interface MelipayamakConfig {
  username: string;
  password: string;
  sender?: string;
  templateOtp?: string;
}

export interface SendOtpResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

let melipayamakConfig: MelipayamakConfig | null = null;

export function getMelipayamakConfig(): MelipayamakConfig | null {
  if (melipayamakConfig) return melipayamakConfig;

  const username = process.env.MELIPAYAMAK_USERNAME;
  const password = process.env.MELIPAYAMAK_PASSWORD;

  if (!username || !password) {
    return null;
  }

  melipayamakConfig = {
    username,
    password,
    sender: process.env.MELIPAYAMAK_SENDER,
    templateOtp: process.env.MELIPAYAMAK_TEMPLATE_OTP,
  };

  return melipayamakConfig;
}

export async function sendOtpViaMelipayamak(phone: string, otp: string): Promise<SendOtpResult> {
  const config = getMelipayamakConfig();

  if (!config) {
    return { success: false, error: 'Melipayamak not configured' };
  }

  const normalizedPhone = phone.startsWith('0') ? phone.slice(1) : phone;
  const fullPhone = `98${normalizedPhone}`;

  try {
    const params = new URLSearchParams({
      username: config.username,
      password: config.password,
      to: fullPhone,
      text: config.templateOtp 
        ? `${config.templateOtp} ${otp}`
        : `کد تأیید نوبت‌لینک: ${otp}`,
    });

    if (config.sender) {
      params.set('from', config.sender);
    }

    const response = await fetch('https://api.melipayamak.ir/post/send.asmx/SendSimpleSMS2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const text = await response.text();

    if (text.includes('<int>') && text.includes('</int>')) {
      const match = text.match(/<int>(-?\d+)<\/int>/);
      const code = match ? parseInt(match[1], 10) : NaN;
      
      if (code > 0) {
        return { success: true, messageId: String(code) };
      }
      
      return { success: false, error: `Melipayamak error code: ${code}` };
    }

    return { success: false, error: 'Unexpected response format' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendOtpDevMock(phone: string, otp: string): Promise<SendOtpResult> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Mock SMS not allowed in production');
  }
  
  console.log(`[DEV MOCK SMS] To: ${phone}, OTP: ${otp}`);
  return { success: true, messageId: 'dev-mock-' + Date.now() };
}

export async function sendOtp(phone: string, otp: string): Promise<SendOtpResult> {
  if (process.env.NODE_ENV === 'production') {
    return sendOtpViaMelipayamak(phone, otp);
  }

  const config = getMelipayamakConfig();
  if (config) {
    return sendOtpViaMelipayamak(phone, otp);
  }

  return sendOtpDevMock(phone, otp);
}