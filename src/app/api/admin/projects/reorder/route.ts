import { NextRequest, NextResponse } from 'next/server';
import { ProjectDataStore } from '@/lib/services/project-data-store';
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

    await ProjectDataStore.reorderProjects(body.orderedIds);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error reordering projects:', error);
    return NextResponse.json({ error: error.message || 'Failed to reorder projects' }, { status: 500 });
  }
}
