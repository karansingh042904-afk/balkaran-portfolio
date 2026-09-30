'use client';

import React, { useState, useEffect } from 'react';
import { Skill } from '@/types/portfolio';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X, Wrench, Layers } from 'lucide-react';

interface SkillEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skill: Partial<Skill>) => Promise<void>;
  skillToEdit?: Skill | null;
  existingCategories: string[];
}

const DEFAULT_CATEGORIES = [
  'Languages',
  'Frontend',
  'Backend & APIs',
  'Databases',
  'Tools & Platforms',
  'AI & Automation',
  'Design & Multimedia',
  'Professional Skills',
  'Productivity',
  'Linguistic Skills',
];

export function SkillEditorModal({
  isOpen,
  onClose,
  onSave,
  skillToEdit,
  existingCategories,
}: SkillEditorModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Languages');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Combine default and existing categories
  const allCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...existingCategories]));

  useEffect(() => {
    if (skillToEdit) {
      setName(skillToEdit.name);
      if (allCategories.includes(skillToEdit.category)) {
        setCategory(skillToEdit.category);
        setIsCustomCategory(false);
        setCustomCategory('');
      } else {
        setCategory('__custom__');
        setIsCustomCategory(true);
        setCustomCategory(skillToEdit.category);
      }
      setSortOrder(skillToEdit.sort_order || 0);
      setPublished(skillToEdit.published);
    } else {
      setName('');
      setCategory(allCategories[0] || 'Languages');
      setIsCustomCategory(false);
      setCustomCategory('');
      setSortOrder(0);
      setPublished(true);
    }
    setErrorMessage(null);
  }, [skillToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Skill name is required');
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : category.trim();
    if (!finalCategory) {
      setErrorMessage('Category is required');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        name: name.trim(),
        category: finalCategory,
        sort_order: Number(sortOrder) || 0,
        published,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save skill';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-lg border-slate-800 bg-slate-900/95 shadow-2xl p-0 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {skillToEdit ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <p className="text-xs text-slate-400">
                {skillToEdit ? 'Update skill details and categorization' : 'Add a technical or professional competency from your CV'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Skill Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Next.js, Python, Prompt Engineering"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={isCustomCategory ? '__custom__' : category}
              onChange={(e) => {
                if (e.target.value === '__custom__') {
                  setIsCustomCategory(true);
                } else {
                  setIsCustomCategory(false);
                  setCategory(e.target.value);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 mb-2"
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__custom__">+ Custom Category...</option>
            </select>

            {isCustomCategory && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                placeholder="Type new category name..."
                required
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Sort Order
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                min={0}
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                />
                <span className="text-xs font-medium text-slate-300">Published</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" size="md" disabled={isSaving}>
              {isSaving ? 'Saving...' : skillToEdit ? 'Update Skill' : 'Create Skill'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
