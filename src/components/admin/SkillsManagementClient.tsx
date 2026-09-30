'use client';

import React, { useState } from 'react';
import { Skill } from '@/types/portfolio';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SkillEditorModal } from '@/components/admin/SkillEditorModal';
import {
  Plus,
  Search,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Wrench,
} from 'lucide-react';

interface SkillsManagementClientProps {
  initialSkills: Skill[];
}

export function SkillsManagementClient({ initialSkills }: SkillsManagementClientProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  // Filter skills
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && skill.published) ||
      (statusFilter === 'draft' && !skill.published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Reorder up/down
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredSkills.length) return;

    const newFiltered = [...filteredSkills];
    const temp = newFiltered[index];
    newFiltered[index] = newFiltered[targetIndex];
    newFiltered[targetIndex] = temp;

    // Update sort_order locally
    const orderedIds = newFiltered.map((s) => s.id);
    const updatedSkills = skills.map((s) => {
      const idx = orderedIds.indexOf(s.id);
      return idx !== -1 ? { ...s, sort_order: idx + 1 } : s;
    }).sort((a, b) => a.sort_order - b.sort_order);

    setSkills(updatedSkills);

    try {
      const res = await fetch('/api/admin/skills/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
      if (!res.ok) throw new Error('Failed to update sort order on server');
      showToast('success', 'Order updated');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reorder failed';
      showToast('error', msg);
    }
  };

  // Toggle published
  const handleTogglePublish = async (skill: Skill) => {
    const newStatus = !skill.published;
    setSkills((prev) =>
      prev.map((s) => (s.id === skill.id ? { ...s, published: newStatus } : s))
    );

    try {
      const res = await fetch(`/api/admin/skills/${skill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status on server');
      showToast('success', `Skill marked as ${newStatus ? 'published' : 'draft'}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      showToast('error', msg);
      // Revert optimistic update
      setSkills((prev) =>
        prev.map((s) => (s.id === skill.id ? { ...s, published: skill.published } : s))
      );
    }
  };

  // Save skill (create or edit)
  const handleSaveSkill = async (skillData: Partial<Skill>) => {
    if (editingSkill) {
      const res = await fetch(`/api/admin/skills/${editingSkill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update skill');

      setSkills((prev) =>
        prev.map((s) => (s.id === editingSkill.id ? data.skill : s))
      );
      showToast('success', 'Skill updated successfully');
    } else {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create skill');

      setSkills((prev) => [...prev, data.skill]);
      showToast('success', 'Skill created successfully');
    }
  };

  // Delete skill
  const handleDeleteConfirm = async () => {
    if (!skillToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/skills/${skillToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete skill from server');

      setSkills((prev) => prev.filter((s) => s.id !== skillToDelete.id));
      showToast('success', `Deleted "${skillToDelete.name}"`);
      setSkillToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      showToast('error', msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl transition-all ${
            toastMessage.type === 'success'
              ? 'bg-slate-900 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-900 border-red-500/50 text-red-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Skills &amp; Technologies</h1>
            <Badge variant="accent">{skills.length} Total</Badge>
          </div>
          <p className="text-sm text-slate-400">
            Categorized skills extracted directly from your CV with no invented percentages.
          </p>
        </div>

        <Button
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditingSkill(null);
            setIsModalOpen(true);
          }}
        >
          Add Skill
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills by name or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories ({skills.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat} ({skills.filter((s) => s.category === cat).length})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === 'all' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === 'published' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === 'draft' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-6">Skill Name</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6 text-center">Order</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-slate-400">
                    <p className="font-medium text-slate-300">No matching skills found.</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try clearing your search query or click &apos;Add Skill&apos; to create one.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSkills.map((skill, index) => (
                  <tr key={skill.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <span>{skill.name}</span>
                    </td>

                    <td className="py-3.5 px-6 text-slate-300 text-xs">
                      <Badge variant="outline" className="text-[11px]">
                        {skill.category}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-6 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-xs text-slate-400 px-1">
                          #{skill.sort_order}
                        </span>
                        <button
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === filteredSkills.length - 1}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <button
                        onClick={() => handleTogglePublish(skill)}
                        className="inline-flex items-center gap-1.5 focus:outline-none"
                        title={skill.published ? 'Click to unpublish' : 'Click to publish'}
                      >
                        {skill.published ? (
                          <Badge variant="emerald" className="text-[10px] py-0.5 cursor-pointer">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="default" className="text-[10px] py-0.5 text-slate-400 cursor-pointer">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1" />
                            Draft
                          </Badge>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingSkill(skill);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800/80 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSkillToDelete(skill)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800/80 transition-colors"
                          title="Delete"
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

      {/* Editor Modal */}
      <SkillEditorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSkill(null);
        }}
        onSave={handleSaveSkill}
        skillToEdit={editingSkill}
        existingCategories={categories}
      />

      {/* Delete Confirmation Modal */}
      {skillToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md border-slate-800 bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Delete Skill</h3>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to delete <span className="font-semibold text-white">&quot;{skillToDelete.name}&quot;</span> from {skillToDelete.category}?
            </p>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSkillToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Skill'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
