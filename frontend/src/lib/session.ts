import { API_BASE } from './api';

export interface Session {
  id: string;
  role: 'candidate' | 'recruiter';
  name: string;
  email: string;
  company?: string;
}

/**
 * Fetches the current user's session from the server cookie.
 * Returns null if not authenticated.
 */
export async function getSession(): Promise<Session | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      credentials: 'include', // send httpOnly cookie
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data as Session;
  } catch {
    return null;
  }
}

/**
 * Clears the server-side session cookie.
 */
export async function clearSession(): Promise<void> {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
