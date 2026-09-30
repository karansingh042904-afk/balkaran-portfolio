import { NextRequest, NextResponse } from 'next/server';
import { EducationDataStore } from '@/lib/services/education-data-store';
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
    const item = await EducationDataStore.getEducationById(id);
    if (!item) {
      return NextResponse.json({ error: 'Education entry not found' }, { status: 404 });
    }
    return NextResponse.json({ education: item });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch education entry';
    return NextResponse.json({ error: message }, { status: 500 });
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
    const existing = await EducationDataStore.getEducationById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Education entry not found' }, { status: 404 });
    }

    const body = await request.json();

    if (body.institution !== undefined && (!body.institution || typeof body.institution !== 'string' || !body.institution.trim())) {
      return NextResponse.json({ error: 'Institution cannot be empty' }, { status: 400 });
    }

    if (body.title !== undefined && (!body.title || typeof body.title !== 'string' || !body.title.trim())) {
      return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
    }

    const updated = await EducationDataStore.updateEducation(id, body);
    return NextResponse.json({ education: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update education entry';
    return NextResponse.json({ error: message }, { status: 500 });
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
    await EducationDataStore.deleteEducation(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete education entry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
