import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import { Service } from '@/types/portfolio';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  let services: Service[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });
      services = (data as Service[]) || [];
    }
  } catch {
    services = [];
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Services &amp; Offerings</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure client solutions, key features, and service descriptions.
          </p>
        </div>

        <Button size="md" icon={<Plus className="w-4 h-4" />}>
          Add Service
        </Button>
      </div>

      <Card className="p-0 overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-6">Service Title</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6">Features</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-slate-400">
                    <p className="font-medium text-slate-300">No services found in database.</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Execute seed.sql or click &apos;Add Service&apos; to create your first offering.
                    </p>
                  </td>
                </tr>
              ) : (
                services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>{svc.title}</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-400 text-xs max-w-xs truncate">
                      {svc.description}
                    </td>
                    <td className="py-3.5 px-6 text-slate-300 text-xs">
                      {svc.features?.length || 0} features
                    </td>
                    <td className="py-3.5 px-6">
                      {svc.published ? (
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
