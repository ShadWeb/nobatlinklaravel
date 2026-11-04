import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { otpChallenges, users } from '@/lib/server/schema';
import { eq, and, gt, desc } from 'drizzle-orm';
import { normalizePhone, isValidIranianMobile, generateOtp, hashOtp, AUTH_CONFIG, type OtpPurpose } from '@/lib/auth/utils';
import { sendOtp } from '@/lib/sms/melipayamak';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, purpose } = body;

    if (!phone || !purpose) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Phone and purpose are required', fieldErrors: { phone: ['Required'], purpose: ['Required'] } } },
        { status: 400 }
      );
    }

    const validPurposes: OtpPurpose[] = ['owner_login', 'customer_login', 'owner_register'];
    if (!validPurposes.includes(purpose)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid purpose', fieldErrors: { purpose: ['Invalid purpose'] } } },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);
    if (!isValidIranianMobile(normalizedPhone)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid Iranian mobile number', fieldErrors: { phone: ['شماره موبایل معتبر وارد کنید'] } } },
        { status: 400 }
      );
    }

    const now = new Date();
    const existingChallenge = await db
      .select()
      .from(otpChallenges)
      .where(and(eq(otpChallenges.phoneNormalized, normalizedPhone), eq(otpChallenges.purpose, purpose)))
      .orderBy(desc(otpChallenges.createdAt))
      .limit(1);

    if (existingChallenge.length > 0) {
      const challenge = existingChallenge[0];
      
      if (challenge.resendAfter && challenge.resendAfter > now) {
        const waitSeconds = Math.ceil((challenge.resendAfter.getTime() - now.getTime()) / 1000);
        return NextResponse.json(
          { error: { code: 'RATE_LIMITED', message: `Please wait ${waitSeconds} seconds before requesting again`, fieldErrors: { phone: [`${waitSeconds} ثانیه صبر کنید`] } } },
          { status: 429 }
        );
      }

      if (challenge.attemptCount >= AUTH_CONFIG.maxAttempts) {
        return NextResponse.json(
          { error: { code: 'RATE_LIMITED', message: 'Too many attempts. Please try again later', fieldErrors: { phone: ['تعداد تلاش‌ها بیش از حد مجاز است'] } } },
          { status: 429 }
        );
      }
    }

    const otp = generateOtp();
    const codeHash = hashOtp(otp);
    const expiresAt = new Date(now.getTime() + AUTH_CONFIG.otpExpiryMs);
    const resendAfter = new Date(now.getTime() + AUTH_CONFIG.resendCooldownMs);

    const newChallenge = await db
      .insert(otpChallenges)
      .values({
        phoneNormalized: normalizedPhone,
        purpose,
        codeHash,
        expiresAt,
        attemptCount: 0,
        resendAfter,
      })
      .returning({ id: otpChallenges.id });

    const challengeId = newChallenge[0].id;

    const smsResult = await sendOtp(normalizedPhone, otp);
    
    if (!smsResult.success) {
      await db.delete(otpChallenges).where(eq(otpChallenges.id, challengeId));
      return NextResponse.json(
        { error: { code: 'SERVICE_UNAVAILABLE', message: 'Failed to send SMS. Please try again later' } },
        { status: 503 }
      );
    }

    return NextResponse.json({
      data: {
        challengeId,
        expiresAt: expiresAt.toISOString(),
        resendAt: resendAfter.toISOString(),
      },
    });
  } catch (error) {
    console.error('OTP request error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An error occurred' } },
      { status: 500 }
    );
  }
}