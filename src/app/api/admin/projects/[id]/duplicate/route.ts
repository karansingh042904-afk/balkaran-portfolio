import { NextRequest, NextResponse } from 'next/server';
import { ProjectDataStore } from '@/lib/services/project-data-store';
import { verifyAdminAuth } from '@/lib/supabase/auth-guard';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  try {
    const { id } = await params;
    const duplicated = await ProjectDataStore.duplicateProject(id);
    return NextResponse.json({ project: duplicated }, { status: 201 });
  } catch (error: any) {
    console.error('Error duplicating project:', error);
    return NextResponse.json({ error: error.message || 'Failed to duplicate project' }, { status: 500 });
  }
}
