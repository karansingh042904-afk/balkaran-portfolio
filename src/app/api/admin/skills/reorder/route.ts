import { NextRequest, NextResponse } from 'next/server';
import { SkillsDataStore } from '@/lib/services/skills-data-store';
import { verifyAdminAuth } from '@/lib/supabase/auth-guard';

export async function PATCH(request: NextRequest) {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  try {
    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json({ error: 'Array of orderedIds is required' }, { status: 400 });
    }

    await SkillsDataStore.reorderSkills(orderedIds);
    return NextResponse.json({ success: true, orderedIds });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to reorder skills';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
