import { NextRequest, NextResponse } from 'next/server';
import { EducationDataStore } from '@/lib/services/education-data-store';
import { verifyAdminAuth } from '@/lib/supabase/auth-guard';

export async function GET() {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  try {
    const education = await EducationDataStore.getAllEducation();
    return NextResponse.json({ education });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch education entries';
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

    if (!body.institution || typeof body.institution !== 'string' || !body.institution.trim()) {
      return NextResponse.json({ error: 'Institution or organization is required' }, { status: 400 });
    }

    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json({ error: 'Title / Degree / Certification is required' }, { status: 400 });
    }

    if (!body.start_date || typeof body.start_date !== 'string' || !body.start_date.trim()) {
      return NextResponse.json({ error: 'Start date is required' }, { status: 400 });
    }

    const validTypes = ['Education', 'Certification', 'Course', 'Achievement', 'Learning'];
    const type = validTypes.includes(body.type) ? body.type : 'Education';

    const created = await EducationDataStore.createEducation({
      type,
      institution: body.institution.trim(),
      title: body.title.trim(),
      description: body.description?.trim() || '',
      start_date: body.start_date.trim(),
      end_date: body.current ? null : body.end_date?.trim() || null,
      current: Boolean(body.current),
      certificate_url: body.certificate_url?.trim() || null,
      logo_url: body.logo_url?.trim() || null,
      skills_learned: Array.isArray(body.skills_learned) ? body.skills_learned : [],
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0,
      published: body.published !== undefined ? Boolean(body.published) : true,
    });

    return NextResponse.json({ education: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create education entry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
