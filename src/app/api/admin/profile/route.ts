import { NextRequest, NextResponse } from 'next/server';
import { ProfileDataStore } from '@/lib/services/profile-data-store';
import { verifyAdminAuth } from '@/lib/supabase/auth-guard';

export async function GET() {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  try {
    const profile = await ProfileDataStore.getProfile();
    return NextResponse.json({ profile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  try {
    const body = await request.json();

    if (!body.full_name || typeof body.full_name !== 'string' || !body.full_name.trim()) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }

    if (!body.email || typeof body.email !== 'string' || !body.email.trim()) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const updated = await ProfileDataStore.updateProfile({
      full_name: body.full_name.trim(),
      headline: body.headline?.trim() || '',
      short_intro: body.short_intro?.trim() || null,
      bio: body.bio?.trim() || '',
      education_status: body.education_status?.trim() || null,
      degree: body.degree?.trim() || null,
      specialization: body.specialization?.trim() || null,
      email: body.email.trim(),
      phone: body.phone?.trim() || null,
      location: body.location?.trim() || null,
      linkedin_url: body.linkedin_url?.trim() || null,
      github_url: body.github_url?.trim() || null,
      resume_url: body.resume_url?.trim() || null,
      avatar_url: body.avatar_url?.trim() || null,
      available_for_work: body.available_for_work !== undefined ? Boolean(body.available_for_work) : true,
      years_of_experience: typeof body.years_of_experience === 'number' ? body.years_of_experience : 0,
    });

    return NextResponse.json({ profile: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
