'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  GraduationCap,
  Award,
  Wrench,
  Layers,
  MessageSquareQuote,
  User,
  Share2,
  Image as ImageIcon,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
    { label: 'Education & Journey', href: '/admin/education', icon: GraduationCap },
    { label: 'Certifications', href: '/admin/certifications', icon: Award },
    { label: 'Skills', href: '/admin/skills', icon: Wrench },
    { label: 'Services', href: '/admin/services', icon: Layers },
    { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Profile', href: '/admin/profile', icon: User },
    { label: 'Social Links', href: '/admin/social-links', icon: Share2 },
    { label: 'Media', href: '/admin/media', icon: ImageIcon },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-sm text-white tracking-tight block">
              Admin CMS
            </span>
            <span className="text-[11px] text-slate-400">
              Portfolio Control
            </span>
          </div>
        </div>

        {/* Nav list */}
        <nav className="p-3 space-y-0.5 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer link to public site */}
      <div className="p-3 border-t border-slate-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
