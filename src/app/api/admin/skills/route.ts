import { NextRequest, NextResponse } from 'next/server';
import { SkillsDataStore } from '@/lib/services/skills-data-store';
import { verifyAdminAuth } from '@/lib/supabase/auth-guard';

export async function GET() {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  try {
    const skills = await SkillsDataStore.getAllSkills();
    return NextResponse.json({ skills });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch skills';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json({ error: 'Skill name is required' }, { status: 400 });
    }

    if (!body.category || typeof body.category !== 'string' || !body.category.trim()) {
      return NextResponse.json({ error: 'Skill category is required' }, { status: 400 });
    }

    const created = await SkillsDataStore.createSkill({
      name: body.name.trim(),
      category: body.category.trim(),
      proficiency: typeof body.proficiency === 'number' ? body.proficiency : null,
      icon: body.icon?.trim() || null,
      sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0,
      published: body.published !== undefined ? Boolean(body.published) : true,
    });

    return NextResponse.json({ skill: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create skill';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
