import { NextRequest, NextResponse } from 'next/server';
import { ProjectDataStore } from '@/lib/services/project-data-store';
import { verifyAdminAuth } from '@/lib/supabase/auth-guard';

export async function GET() {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  try {
    const projects = await ProjectDataStore.getAllProjects();
    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  try {
    const body = await request.json();

    // Validation
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json({ error: 'Project title is required' }, { status: 400 });
    }

    if (!body.slug || typeof body.slug !== 'string' || !body.slug.trim()) {
      return NextResponse.json({ error: 'Project slug is required' }, { status: 400 });
    }

    const cleanSlug = body.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    // Check slug uniqueness
    const existing = await ProjectDataStore.getProjectBySlug(cleanSlug);
    if (existing) {
      return NextResponse.json({ error: `Slug "${cleanSlug}" is already taken by another project` }, { status: 400 });
    }

    if (!body.category || typeof body.category !== 'string' || !body.category.trim()) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    if (!body.short_description || typeof body.short_description !== 'string' || !body.short_description.trim()) {
      return NextResponse.json({ error: 'Short description is required' }, { status: 400 });
    }

    const year = Number(body.year) || new Date().getFullYear();

    const created = await ProjectDataStore.createProject({
      title: body.title.trim(),
      slug: cleanSlug,
      short_description: body.short_description.trim(),
      full_description: body.full_description?.trim() || body.short_description.trim(),
      category: body.category.trim(),
      year,
      role: body.role?.trim() || 'Lead Engineer',
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      thumbnail: body.thumbnail?.trim() || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      project_url: body.project_url?.trim() || null,
      github_url: body.github_url?.trim() || null,
      case_study_content: body.case_study_content?.trim() || null,
      results: Array.isArray(body.results) ? body.results : [],
      featured: Boolean(body.featured),
      published: Boolean(body.published),
      sort_order: Number(body.sort_order) || 0,
      project_images: Array.isArray(body.project_images) ? body.project_images : [],
    });

    return NextResponse.json({ project: created }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: error.message || 'Failed to create project' }, { status: 500 });
  }
}
