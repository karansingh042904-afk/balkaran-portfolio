import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.error('Error signing out with Supabase client:', err);
  }

  try {
    const cookieStore = await cookies();
    cookieStore.getAll().forEach((c) => {
      if (c.name.startsWith('sb-')) {
        cookieStore.delete(c.name);
      }
    });
  } catch (err) {
    console.error('Error clearing cookies on logout:', err);
  }

  return NextResponse.json({ success: true });
}
