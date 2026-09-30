import React from 'react';
import Link from 'next/link';
import { AdminService } from '@/lib/services/admin-service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FolderGit2,
  GraduationCap,
  Layers,
  Sparkles,
  Plus,
  ArrowRight,
  Database,
  CheckCircle,
  HardDrive,
  ShieldAlert,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const stats = await AdminService.getDashboardStats();

  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Portfolio Content Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your live projects, education &amp; journey milestones, skills, and assets in Supabase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/projects">
            <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              Add Project
            </Button>
          </Link>
          <Link href="/admin/skills">
            <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              Add Skill
            </Button>
          </Link>
          <Link href="/admin/certifications">
            <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              Certifications
            </Button>
          </Link>
          <Link href="/admin/profile">
            <Button variant="secondary" size="sm">
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Supabase Connection Callout if unconfigured */}
      {!isConfigured && (
        <Card className="border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-slate-900/40 to-slate-900/40 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Connect your Supabase Project
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl mb-4">
                The database schema (<code className="text-indigo-300 font-mono text-xs">supabase/schema.sql</code>) and seed data (<code className="text-indigo-300 font-mono text-xs">supabase/seed.sql</code>) are prepared with all tables, constraints, storage buckets, and RLS policies. Add your <code className="text-indigo-300 font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-indigo-300 font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code className="text-indigo-300 font-mono text-xs">.env.local</code> to activate live database syncing.
              </p>
              <div className="flex items-center gap-3">
                <Badge variant="accent">Schema Version: 1.0.0 Ready</Badge>
                <span className="text-xs text-slate-400 font-medium">
                  Currently serving fallback preview data
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Projects
            </span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">{stats.totalProjects}</span>
            <span className="text-xs text-emerald-400 font-medium">
              {stats.publishedProjects} Published
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <Link
              href="/admin/projects"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center justify-between"
            >
              <span>Manage Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Education &amp; Qualifications
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">{stats.totalEducation}</span>
            <span className="text-xs text-cyan-300">Degrees &amp; Academic</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <Link
              href="/admin/education"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-between"
            >
              <span>Manage Education &amp; Journey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Certifications
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">{stats.totalCertifications}</span>
            <span className="text-xs text-emerald-400">Verified Credentials</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <Link
              href="/admin/certifications"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center justify-between"
            >
              <span>Manage Certifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Technical Skills
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">{stats.totalSkills}</span>
            <span className="text-xs text-amber-300">Categorized Skills</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <Link
              href="/admin/skills"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center justify-between"
            >
              <span>Manage Skills Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Profile &amp; About
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-white truncate">Balkaran Singh</span>
            <span className="text-xs text-blue-300">Fresher</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <Link
              href="/admin/profile"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center justify-between"
            >
              <span>Edit Bio &amp; Academic Info</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Storage Buckets
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">4</span>
            <span className="text-xs text-purple-300">Public Buckets</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <div className="text-xs text-slate-400">
              project-images, profile-images, company-logos, resume
            </div>
          </div>
        </Card>
      </div>

      {/* Database Schema & Storage Architecture Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>Database Tables &amp; RLS Status</span>
          </h3>
          <ul className="space-y-3 text-xs">
            {[
              { name: 'profile', desc: 'Bio, contact, resume URL, status' },
              { name: 'projects', desc: 'Case studies, categories, technologies, URLs' },
              { name: 'project_images', desc: 'Multiple gallery screenshots per project' },
              { name: 'experience', desc: 'Companies, positions, dates, achievements' },
              { name: 'skills', desc: 'Categorized technical proficiencies' },
              { name: 'services', desc: 'Specialized client offerings & features' },
              { name: 'testimonials', desc: 'Client endorsements & affiliations' },
              { name: 'social_links', desc: 'Verified social platform links' },
            ].map((table) => (
              <li
                key={table.name}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800"
              >
                <div>
                  <span className="font-mono font-semibold text-slate-200 block">
                    {table.name}
                  </span>
                  <span className="text-slate-400 text-[11px]">{table.desc}</span>
                </div>
                <Badge variant="emerald" className="text-[10px] py-0.5">
                  RLS Enabled
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <span>Storage Buckets &amp; Security</span>
          </h3>
          <ul className="space-y-3 text-xs">
            {[
              { name: 'project-images', desc: 'Project thumbnails and showcase screenshots' },
              { name: 'profile-images', desc: 'Avatar photos and bio portrait assets' },
              { name: 'company-logos', desc: 'Brand and employer logomarks' },
              { name: 'resume', desc: 'Downloadable PDF resume' },
            ].map((bucket) => (
              <li
                key={bucket.name}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800"
              >
                <div>
                  <span className="font-mono font-semibold text-slate-200 block">
                    {bucket.name}
                  </span>
                  <span className="text-slate-400 text-[11px]">{bucket.desc}</span>
                </div>
                <Badge variant="accent" className="text-[10px] py-0.5">
                  Public Read / Auth Write
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
