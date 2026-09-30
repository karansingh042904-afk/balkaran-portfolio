import { NextRequest, NextResponse } from 'next/server';
import { SkillsDataStore } from '@/lib/services/skills-data-store';
import { verifyAdminAuth } from '@/lib/supabase/auth-guard';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  const { id } = await params;
  const skill = await SkillsDataStore.getSkillById(id);
  if (!skill) {
    return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
  }

  return NextResponse.json({ skill });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  const { id } = await params;

  try {
    const body = await request.json();

    const updated = await SkillsDataStore.updateSkill(id, {
      name: body.name?.trim(),
      category: body.category?.trim(),
      proficiency: typeof body.proficiency === 'number' ? body.proficiency : null,
      icon: body.icon?.trim() || null,
      sort_order: typeof body.sort_order === 'number' ? body.sort_order : undefined,
      published: body.published !== undefined ? Boolean(body.published) : undefined,
    });

    return NextResponse.json({ skill: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update skill';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  const { id } = await params;

  try {
    await SkillsDataStore.deleteSkill(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete skill';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
