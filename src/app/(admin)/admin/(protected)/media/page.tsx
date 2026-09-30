import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Image as ImageIcon, Upload, HardDrive, FileText, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const buckets = [
    {
      id: 'project-images',
      name: 'project-images',
      description: 'Project hero thumbnails, high-resolution screenshots, and architecture diagrams',
      access: 'Public Read / Authenticated Write',
      maxSize: '10 MB',
    },
    {
      id: 'profile-images',
      name: 'profile-images',
      description: 'Personal portrait avatars and photography assets',
      access: 'Public Read / Authenticated Write',
      maxSize: '5 MB',
    },
    {
      id: 'company-logos',
      name: 'company-logos',
      description: 'Logomarks and emblems for employment history and clients',
      access: 'Public Read / Authenticated Write',
      maxSize: '2 MB',
    },
    {
      id: 'resume',
      name: 'resume',
      description: 'PDF downloadable curriculum vitae document',
      access: 'Public Read / Authenticated Write',
      maxSize: '10 MB',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Media &amp; Storage</h1>
          <p className="text-sm text-slate-400 mt-1">
            Supabase Storage bucket architecture and uploaded portfolio assets.
          </p>
        </div>

        <Button size="md" icon={<Upload className="w-4 h-4" />}>
          Upload Asset
        </Button>
      </div>

      {/* Storage Buckets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {buckets.map((bucket) => (
          <Card key={bucket.id} className="p-6 border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    {bucket.id === 'resume' ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className="font-mono font-bold text-sm text-white block">
                      {bucket.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Bucket ID: {bucket.id}
                    </span>
                  </div>
                </div>

                <Badge variant="emerald" className="text-[10px] py-0.5">
                  Public Bucket
                </Badge>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {bucket.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Limit: {bucket.maxSize}</span>
              <span className="text-indigo-400 font-medium">{bucket.access}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Upload Instructions Card */}
      <Card className="p-6 border-slate-800">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-indigo-400" />
          <span>Storage Integration Notes</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl mb-4">
          All buckets are configured in <code className="font-mono text-indigo-400">supabase/schema.sql</code> with standard RLS policies. When you create or update projects, experiences, or profiles through the Admin CMS, images uploaded to these buckets will automatically generate public URLs saved to their respective database columns.
        </p>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Storage RLS Policies Configured for Secure Direct Client/Server Uploads</span>
        </div>
      </Card>
    </div>
  );
}
