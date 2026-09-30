import React from 'react';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ToastProvider } from '@/components/ui/Toast';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect('/admin/login?notice=setup_required');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const restrictedAdminEmail = process.env.ADMIN_EMAIL;
  if (restrictedAdminEmail && user.email !== restrictedAdminEmail) {
    redirect('/admin/login?error=forbidden');
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-950 flex text-slate-100 antialiased">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader userEmail={user.email} />
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-950">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

