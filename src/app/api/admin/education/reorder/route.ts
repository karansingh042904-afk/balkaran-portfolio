import { NextRequest, NextResponse } from 'next/server';
import { EducationDataStore } from '@/lib/services/education-data-store';
import { verifyAdminAuth } from '@/lib/supabase/auth-guard';

export async function PATCH(request: NextRequest) {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  try {
    const body = await request.json();
    if (!body.orderedIds || !Array.isArray(body.orderedIds)) {
      return NextResponse.json({ error: 'orderedIds array is required' }, { status: 400 });
    }

    await EducationDataStore.reorderEducation(body.orderedIds);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to reorder education entries';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
