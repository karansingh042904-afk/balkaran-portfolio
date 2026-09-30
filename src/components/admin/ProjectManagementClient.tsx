'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProjectWithImages } from '@/types/portfolio';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProjectEditorModal } from '@/components/admin/ProjectEditorModal';
import { useToast } from '@/components/ui/Toast';
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Layers,
  CheckCircle2,
  XCircle,
  Star,
  ArrowUp,
  ArrowDown,
  Search,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

interface ProjectManagementClientProps {
  initialProjects: ProjectWithImages[];
}

export function ProjectManagementClient({
  initialProjects,
}: ProjectManagementClientProps) {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<ProjectWithImages[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'featured'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectWithImages | null>(null);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<ProjectWithImages | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reorder loading state
  const [isReordering, setIsReordering] = useState(false);

  // Refresh projects from API
  const refreshProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (res.ok && data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Failed to refresh projects:', err);
    }
  };

  // Toggle Published Status
  const handleTogglePublished = async (project: ProjectWithImages) => {
    const newStatus = !project.published;
    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, published: newStatus } : p))
    );

    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newStatus }),
      });

      if (!res.ok) throw new Error();
      showToast(newStatus ? 'Project published' : 'Project moved to drafts', 'success');
    } catch {
      // Revert
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: project.published } : p))
      );
      showToast('Failed to update published status', 'error');
    }
  };

  // Toggle Featured Status
  const handleToggleFeatured = async (project: ProjectWithImages) => {
    const newStatus = !project.featured;
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, featured: newStatus } : p))
    );

    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: newStatus }),
      });

      if (!res.ok) throw new Error();
      showToast(newStatus ? 'Project marked as featured' : 'Project removed from featured', 'success');
    } catch {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, featured: project.featured } : p))
      );
      showToast('Failed to update featured status', 'error');
    }
  };

  // Duplicate Project
  const handleDuplicate = async (project: ProjectWithImages) => {
    try {
      showToast('Duplicating project...', 'info');
      const res = await fetch(`/api/admin/projects/${project.id}/duplicate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProjects((prev) => [...prev, data.project]);
      showToast(`Duplicated as "${data.project.title}"`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to duplicate project', 'error');
    }
  };

  // Move Project Up or Down in Order
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    setIsReordering(true);
    const newOrder = [...projects];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    setProjects(newOrder);

    try {
      const orderedIds = newOrder.map((p) => p.id);
      const res = await fetch('/api/admin/projects/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });

      if (!res.ok) throw new Error();
      showToast('Project order updated', 'success');
    } catch {
      showToast('Failed to save project order', 'error');
      refreshProjects();
    } finally {
      setIsReordering(false);
    }
  };

  // Delete Project
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast(`Project "${deleteTarget.title}" deleted`, 'success');
      setDeleteTarget(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete project', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered list
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.technologies || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === 'published') return p.published;
    if (filterStatus === 'draft') return !p.published;
    if (filterStatus === 'featured') return p.featured;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header & New Project Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Projects Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create, edit, duplicate, reorder, and publish portfolio case studies.
          </p>
        </div>

        <Button
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setProjectToEdit(null);
            setIsModalOpen(true);
          }}
        >
          Add New Project
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, categories, or tech stack..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          {[
            { id: 'all', label: 'All', count: projects.length },
            { id: 'published', label: 'Published', count: projects.filter((p) => p.published).length },
            { id: 'draft', label: 'Drafts', count: projects.filter((p) => !p.published).length },
            { id: 'featured', label: 'Featured', count: projects.filter((p) => p.featured).length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                filterStatus === item.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{item.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterStatus === item.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <Card className="p-0 overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 w-12 text-center">Order</th>
                <th className="py-3.5 px-6">Project Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-6 text-center text-slate-400">
                    <p className="font-medium text-slate-300">No matching projects found.</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try clearing search filters or click &quot;Add New Project&quot; to create one.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj, index) => (
                  <tr key={proj.id} className="hover:bg-slate-900/40 transition-colors">
                    {/* Reorder Buttons */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        <button
                          onClick={() => handleMoveOrder(index, 'up')}
                          disabled={index === 0 || isReordering}
                          className="p-1 text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-mono text-slate-500">#{index + 1}</span>
                        <button
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === filteredProjects.length - 1 || isReordering}
                          className="p-1 text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Thumbnail & Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        {proj.thumbnail ? (
                          <img
                            src={proj.thumbnail}
                            alt={proj.title}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-800"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 shrink-0 border border-slate-800">
                            <Layers className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-white block">
                            {proj.title}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            /{proj.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-slate-300 text-xs font-medium">
                      <Badge variant="outline" className="text-[11px] font-normal">
                        {proj.category}
                      </Badge>
                    </td>

                    {/* Year */}
                    <td className="py-4 px-4 text-slate-400 font-mono text-xs">
                      {proj.year}
                    </td>

                    {/* Published 1-Click Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublished(proj)}
                        className="group flex items-center gap-1.5 focus:outline-none"
                        title="Click to toggle published status"
                      >
                        {proj.published ? (
                          <Badge variant="emerald" className="gap-1 cursor-pointer group-hover:brightness-110">
                            <CheckCircle2 className="w-3 h-3" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="default" className="gap-1 text-slate-400 cursor-pointer group-hover:brightness-110">
                            <XCircle className="w-3 h-3" />
                            Draft
                          </Badge>
                        )}
                      </button>
                    </td>

                    {/* Featured 1-Click Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(proj)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          proj.featured
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-400'
                        }`}
                        title={proj.featured ? 'Featured on homepage' : 'Mark as featured'}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/projects/${proj.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title="View Live Case Study"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDuplicate(proj)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Duplicate Project"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setProjectToEdit(proj);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(proj)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Delete Project"
                        >
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

      {/* Project Editor Modal (Add & Edit) */}
      <ProjectEditorModal
        isOpen={isModalOpen}
        projectToEdit={projectToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setProjectToEdit(null);
        }}
        onSave={(saved) => {
          setProjects((prev) => {
            const exists = prev.some((p) => p.id === saved.id);
            if (exists) {
              return prev.map((p) => (p.id === saved.id ? saved : p));
            } else {
              return [...prev, saved];
            }
          });
          showToast(
            projectToEdit ? `Updated "${saved.title}"` : `Created "${saved.title}"`,
            'success'
          );
        }}
      />

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Delete Project</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to delete <span className="text-white font-semibold">&ldquo;{deleteTarget.title}&rdquo;</span>? This will remove all associated gallery screenshots and cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                icon={isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : undefined}
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
