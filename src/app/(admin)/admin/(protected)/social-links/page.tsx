import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit, Trash2, Share2, ExternalLink } from 'lucide-react';
import { SocialLink } from '@/types/portfolio';

export const dynamic = 'force-dynamic';

export default async function AdminSocialLinksPage() {
  let links: SocialLink[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from('social_links')
        .select('*')
        .order('sort_order', { ascending: true });
      links = (data as SocialLink[]) || [];
    }
  } catch {
    links = [];
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Social Links</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your verified social profiles, developer accounts, and contact channels.
          </p>
        </div>

        <Button size="md" icon={<Plus className="w-4 h-4" />}>
          Add Link
        </Button>
      </div>

      <Card className="p-0 overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-6">Platform</th>
                <th className="py-3 px-6">Display Label</th>
                <th className="py-3 px-6">URL</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {links.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-slate-400">
                    <p className="font-medium text-slate-300">No social links found in database.</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Execute seed.sql or click &apos;Add Link&apos; to add a social handle.
                    </p>
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-white flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-indigo-400" />
                      <span>{link.platform}</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-300 text-xs">
                      {link.label}
                    </td>
                    <td className="py-3.5 px-6 text-indigo-400 text-xs font-mono">
                      <a href={link.url} target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1">
                        <span>{link.url}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </td>
                    <td className="py-3.5 px-6">
                      {link.published ? (
                        <Badge variant="emerald" className="text-[10px] py-0.5">Published</Badge>
                      ) : (
                        <Badge variant="default" className="text-[10px] py-0.5 text-slate-400">Draft</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-400 rounded transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-400 rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
