import { cookies } from 'next/headers';
import { db } from '@/lib/server/db';
import { sessions, users } from '@/lib/server/schema';
import { eq, and, gt } from 'drizzle-orm';
import { AUTH_CONFIG, hashSessionToken, generateSessionToken } from './utils';

export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + AUTH_CONFIG.sessionExpiryMs);

  await db.insert(sessions).values({
    tokenHash,
    userId,
    expiresAt,
  });

  return token;
}

export async function getSession(): Promise<{ user: typeof users.$inferSelect; session: typeof sessions.$inferSelect } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_CONFIG.cookieName)?.value;

  if (!token) return null;

  const tokenHash = hashSessionToken(token);

  const result = await db
    .select({
      session: sessions,
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0];
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_CONFIG.cookieName)?.value;

  if (token) {
    const tokenHash = hashSessionToken(token);
    await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
  }

  cookieStore.delete(AUTH_CONFIG.cookieName);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === 'production';

  cookieStore.set(AUTH_CONFIG.cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_CONFIG.sessionExpiryMs / 1000,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_CONFIG.cookieName);
}

export async function requireAuth(): Promise<{ user: typeof users.$inferSelect; session: typeof sessions.$inferSelect }> {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

export async function requireOwner(businessId?: string): Promise<{ user: typeof users.$inferSelect; session: typeof sessions.$inferSelect; business?: typeof import('@/lib/server/schema').Business }> {
  const session = await requireAuth();
  
  if (businessId) {
    const { businesses } = await import('@/lib/server/schema');
    const { eq } = await import('drizzle-orm');
    const business = await db.query.businesses.findFirst({
      where: and(eq(businesses.id, businessId), eq(businesses.ownerId, session.user.id)),
    });
    if (!business) {
      throw new Error('FORBIDDEN');
    }
    return { ...session, business };
  }
  
  return session;
}

export async function requireAdmin(): Promise<{ user: typeof users.$inferSelect; session: typeof sessions.$inferSelect }> {
  const session = await requireAuth();
  if (session.user.platformRole !== 'platform_admin') {
    throw new Error('FORBIDDEN');
  }
  return session;
}