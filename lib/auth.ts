import { cookies } from 'next/headers';
import crypto from 'crypto';

const USERS = [
  {
    username: 'admin',
    // Password: admin123 (hashed)
    passwordHash: crypto.createHash('sha256').update('admin123').digest('hex'),
  },
];

export interface User {
  username: string;
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyCredentials(username: string, password: string): boolean {
  const user = USERS.find(u => u.username === username);
  if (!user) return false;
  
  const passwordHash = hashPassword(password);
  return user.passwordHash === passwordHash;
}

export async function createSession(username: string): Promise<string> {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const cookieStore = await cookies();
  
  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  
  cookieStore.set('username', username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });
  
  return sessionToken;
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session');
  const username = cookieStore.get('username');
  
  if (!sessionToken || !username) {
    return null;
  }
  
  return { username: username.value };
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('username');
}

