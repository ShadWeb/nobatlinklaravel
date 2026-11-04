import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'No active session' } },
      { status: 401 }
    );
  }

  const { businesses } = await import('@/lib/server/schema');
  const { eq } = await import('drizzle-orm');
  const { db } = await import('@/lib/server/db');

  let business = null;
  if (session.user.platformRole === 'user') {
    business = await db.query.businesses.findFirst({
      where: eq(businesses.ownerId, session.user.id),
      columns: { id: true, slug: true, name: true },
    });
  }

  return NextResponse.json({
    data: {
      user: {
        id: session.user.id,
        phoneNormalized: session.user.phoneNormalized,
        platformRole: session.user.platformRole,
      },
      business,
    },
  });
}