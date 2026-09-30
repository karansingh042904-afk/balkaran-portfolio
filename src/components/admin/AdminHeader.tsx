'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface AdminHeaderProps {
  userEmail?: string | null;
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      window.location.href = '/admin/login';
    }
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-white">Content Management System</h2>
        <Badge variant="accent" className="text-[10px] py-0.5 font-normal">
          Authenticated Session
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        {userEmail && (
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <UserCircle className="w-4 h-4 text-slate-400" />
            <span className="font-medium">{userEmail}</span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700/60"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
