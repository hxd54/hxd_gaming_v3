import { NextRequest, NextResponse } from 'next/server';
import {
  checkLoginRateLimit,
  resetLoginRateLimit,
  verifyAdminCredentials,
  createSessionToken,
  SESSION_COOKIE_NAME,
} from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    // Rate limiting check
    const rateLimit = checkLoginRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    resetLoginRateLimit(ip);
    const token = await createSessionToken(username);

    const res = NextResponse.json({
      success: true,
      user: { username, role: 'admin' },
    });

    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

