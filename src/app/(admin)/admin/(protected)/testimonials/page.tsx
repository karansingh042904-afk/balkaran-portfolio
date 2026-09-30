import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit, Trash2, MessageSquareQuote } from 'lucide-react';
import { Testimonial } from '@/types/portfolio';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  let testimonials: Testimonial[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });
      testimonials = (data as Testimonial[]) || [];
    }
  } catch {
    testimonials = [];
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Client Testimonials</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage client recommendations, endorsements, and collaborator quotes.
          </p>
        </div>

        <Button size="md" icon={<Plus className="w-4 h-4" />}>
          Add Testimonial
        </Button>
      </div>

      <Card className="p-0 overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-6">Client</th>
                <th className="py-3 px-6">Company &amp; Role</th>
                <th className="py-3 px-6">Quote Snippet</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-slate-400">
                    <p className="font-medium text-slate-300">No testimonials found in database.</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Execute seed.sql or click &apos;Add Testimonial&apos; to create an endorsement.
                    </p>
                  </td>
                </tr>
              ) : (
                testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-white flex items-center gap-3">
                      {t.avatar_url ? (
                        <img src={t.avatar_url} alt={t.client_name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                          <MessageSquareQuote className="w-4 h-4" />
                        </div>
                      )}
                      <span>{t.client_name}</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-300 text-xs">
                      {t.client_title}, <span className="text-indigo-400">{t.company}</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-400 text-xs max-w-sm truncate italic">
                      &ldquo;{t.quote}&rdquo;
                    </td>
                    <td className="py-3.5 px-6">
                      {t.published ? (
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
