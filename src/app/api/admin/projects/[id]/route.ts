import { NextRequest, NextResponse } from 'next/server';
import { ProjectDataStore } from '@/lib/services/project-data-store';
import { verifyAdminAuth } from '@/lib/supabase/auth-guard';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  try {
    const { id } = await params;
    const project = await ProjectDataStore.getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  try {
    const { id } = await params;
    const existing = await ProjectDataStore.getProjectById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const body = await request.json();

    if (body.title !== undefined && (!body.title || typeof body.title !== 'string' || !body.title.trim())) {
      return NextResponse.json({ error: 'Project title cannot be empty' }, { status: 400 });
    }

    if (body.slug !== undefined) {
      const cleanSlug = body.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
      if (!cleanSlug) {
        return NextResponse.json({ error: 'Project slug cannot be empty' }, { status: 400 });
      }

      // Check if new slug conflicts with another project
      const conflicting = await ProjectDataStore.getProjectBySlug(cleanSlug);
      if (conflicting && conflicting.id !== id) {
        return NextResponse.json({ error: `Slug "${cleanSlug}" is already taken by another project` }, { status: 400 });
      }
      body.slug = cleanSlug;
    }

    const updated = await ProjectDataStore.updateProject(id, body);
    return NextResponse.json({ project: updated });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: error.message || 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  try {
    const { id } = await params;
    await ProjectDataStore.deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete project' }, { status: 500 });
  }
}
