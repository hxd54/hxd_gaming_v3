import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { UserSession } from '@/types';

const SECRET_KEY = process.env.AUTH_SECRET || 'hxd_gaming_2026_super_secure_auth_session_secret_change_in_production';
const KEY = new TextEncoder().encode(SECRET_KEY);
export const SESSION_COOKIE_NAME = 'hxd_admin_session';

// Simple in-memory rate limiter for login attempts: 5 attempts per 15 minutes per IP
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 5;

  const record = loginAttempts.get(ip);
  if (!record || now > record.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (record.count >= maxAttempts) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  record.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetLoginRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

export async function createSessionToken(username: string): Promise<string> {
  return await new SignJWT({ username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(KEY);
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, KEY);
    return payload as unknown as UserSession;
  } catch (err) {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const expectedUser = process.env.ADMIN_USERNAME || 'haxdev54';
  const expectedPass = process.env.ADMIN_PASSWORD || 'haxen54';

  if (username !== expectedUser) {
    return false;
  }

  // Support both bcrypt-hashed passwords and direct secure env match
  if (expectedPass.startsWith('$2a$') || expectedPass.startsWith('$2b$')) {
    return await bcrypt.compare(password, expectedPass);
  }

  return password === expectedPass;
}

