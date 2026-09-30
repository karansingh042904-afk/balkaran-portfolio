import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { verifyAdminAuth } from '@/lib/supabase/auth-guard';

export async function POST(request: NextRequest) {
  const { user, error: authError, status } = await verifyAdminAuth();
  if (authError || !user) {
    return NextResponse.json({ error: authError || 'Unauthorized' }, { status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'project-images';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Allowed types: JPG, PNG, WEBP, SVG, GIF, AVIF' },
        { status: 400 }
      );
    }

    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: 'File size exceeds maximum limit of 10 MB' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split('.').pop() || 'png';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    // Attempt Supabase Storage upload
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(cleanFileName, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(cleanFileName);

          return NextResponse.json({
            url: publicUrlData.publicUrl,
            fileName: cleanFileName,
            size: file.size,
            storage: 'supabase',
          });
        }
      }
    } catch {
      // Fallback
    }

    // Local uploads directory fallback
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const targetPath = path.join(uploadsDir, cleanFileName);
    await fs.writeFile(targetPath, buffer);

    const publicUrl = `/uploads/${cleanFileName}`;
    return NextResponse.json({
      url: publicUrl,
      fileName: cleanFileName,
      size: file.size,
      storage: 'local',
    });
  } catch (err: any) {
    console.error('Upload handler error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to upload image' }, { status: 500 });
  }
}
