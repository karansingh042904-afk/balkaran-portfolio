import { createServerSupabaseClient } from './server';
import { User } from '@supabase/supabase-js';

export interface AdminAuthResult {
  user: User | null;
  error: string | null;
  status: number;
}

/**
 * Verifies that the current request has a valid Supabase authenticated session.
 * Optionally validates the user email against ADMIN_EMAIL if defined.
 */
export async function verifyAdminAuth(): Promise<AdminAuthResult> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      user: null,
      error: 'Supabase authentication is not configured. Missing environment variables.',
      status: 503,
    };
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        user: null,
        error: 'Unauthorized: Valid admin session required.',
        status: 401,
      };
    }

    // Optional admin email restriction
    const restrictedAdminEmail = process.env.ADMIN_EMAIL;
    if (restrictedAdminEmail && user.email !== restrictedAdminEmail) {
      return {
        user: null,
        error: 'Forbidden: This account does not have administrative privileges.',
        status: 403,
      };
    }

    return {
      user,
      error: null,
      status: 200,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication verification failed.';
    return {
      user: null,
      error: message,
      status: 401,
    };
  }
}
