import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { otpChallenges, users, sessions } from '@/lib/server/schema';
import { eq, and, gt } from 'drizzle-orm';
import { normalizePhone, verifyOtpHash, AUTH_CONFIG, type OtpPurpose } from '@/lib/auth/utils';
import { createSession, setSessionCookie } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challengeId, code } = body;

    if (!challengeId || !code) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Challenge ID and code are required', fieldErrors: { challengeId: ['Required'], code: ['Required'] } } },
        { status: 400 }
      );
    }

    const challenge = await db
      .select()
      .from(otpChallenges)
      .where(eq(otpChallenges.id, challengeId))
      .limit(1);

    if (challenge.length === 0) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid or expired code' } },
        { status: 400 }
      );
    }

    const c = challenge[0];
    const now = new Date();

    if (c.consumedAt) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Code already used' } },
        { status: 400 }
      );
    }

    if (c.expiresAt <= now) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Code expired' } },
        { status: 400 }
      );
    }

    if (c.attemptCount >= AUTH_CONFIG.maxAttempts) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Too many attempts' } },
        { status: 400 }
      );
    }

    const normalizedCode = code.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
    
    if (!verifyOtpHash(normalizedCode, c.codeHash)) {
      await db
        .update(otpChallenges)
        .set({ attemptCount: c.attemptCount + 1 })
        .where(eq(otpChallenges.id, challengeId));

      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid code' } },
        { status: 400 }
      );
    }

    await db
      .update(otpChallenges)
      .set({ consumedAt: now })
      .where(eq(otpChallenges.id, challengeId));

    let user = await db
      .select()
      .from(users)
      .where(eq(users.phoneNormalized, c.phoneNormalized))
      .limit(1);

    let platformRole = 'user';
    if (user.length === 0) {
      const newUser = await db
        .insert(users)
        .values({
          phoneNormalized: c.phoneNormalized,
          platformRole: c.purpose === 'owner_register' ? 'user' : 'user',
        })
        .returning();
      user = newUser;
    } else {
      platformRole = user[0].platformRole;
    }

    const sessionToken = await createSession(user[0].id);
    await setSessionCookie(sessionToken);

    let redirectTo = '/';
    if (c.purpose === 'owner_login' || c.purpose === 'owner_register') {
      const { businesses } = await import('@/lib/server/schema');
      const { eq } = await import('drizzle-orm');
      const business = await db.query.businesses.findFirst({
        where: eq(businesses.ownerId, user[0].id),
      });
      redirectTo = business ? '/dashboard' : '/start';
    } else {
      const { businesses } = await import('@/lib/server/schema');
      const { eq } = await import('drizzle-orm');
      const business = await db.query.businesses.findFirst({
        where: eq(businesses.ownerId, user[0].id),
      });
      redirectTo = business ? `/b/${business.slug}/appointments` : '/';
    }

    return NextResponse.json({
      data: {
        user: {
          id: user[0].id,
          phoneNormalized: user[0].phoneNormalized,
          platformRole,
        },
        redirectTo,
      },
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An error occurred' } },
      { status: 500 }
    );
  }
}