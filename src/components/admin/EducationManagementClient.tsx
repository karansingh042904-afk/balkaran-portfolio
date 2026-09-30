'use client';

import React, { useState } from 'react';
import { EducationJourney, EducationJourneyType } from '@/types/portfolio';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EducationEditorModal } from '@/components/admin/EducationEditorModal';
import { useToast } from '@/components/ui/Toast';
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  GraduationCap,
  Award,
  BookOpen,
  Trophy,
  Compass,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
  Search,
  AlertTriangle,
  Loader2,
  Calendar,
} from 'lucide-react';

interface EducationManagementClientProps {
  initialEducation: EducationJourney[];
}

export function EducationManagementClient({
  initialEducation,
}: EducationManagementClientProps) {
  const { showToast } = useToast();
  const [educationList, setEducationList] = useState<EducationJourney[]>(initialEducation);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [filterType, setFilterType] = useState<'all' | EducationJourneyType>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<EducationJourney | null>(null);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<EducationJourney | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reorder loading state
  const [isReordering, setIsReordering] = useState(false);

  // Refresh from API
  const refreshEducation = async () => {
    try {
      const res = await fetch('/api/admin/education');
      const data = await res.json();
      if (res.ok && data.education) {
        setEducationList(data.education);
      }
    } catch (err) {
      console.error('Failed to refresh education list:', err);
    }
  };

  // Toggle Published
  const handleTogglePublished = async (item: EducationJourney) => {
    const newStatus = !item.published;
    setEducationList((prev) =>
      prev.map((e) => (e.id === item.id ? { ...e, published: newStatus } : e))
    );

    try {
      const res = await fetch(`/api/admin/education/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newStatus }),
      });

      if (!res.ok) throw new Error();
      showToast(newStatus ? 'Entry published to portfolio' : 'Entry moved to drafts', 'success');
    } catch {
      setEducationList((prev) =>
        prev.map((e) => (e.id === item.id ? { ...e, published: item.published } : e))
      );
      showToast('Failed to update publication status', 'error');
    }
  };

  // Move Up / Down
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= educationList.length) return;

    const reordered = [...educationList];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Update local sort_order numbers
    const updated = reordered.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setEducationList(updated);
    setIsReordering(true);

    try {
      const orderedIds = updated.map((item) => item.id);
      const res = await fetch('/api/admin/education/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });

      if (!res.ok) throw new Error();
      showToast('Order updated successfully', 'success');
    } catch {
      showToast('Failed to save updated order', 'error');
      refreshEducation();
    } finally {
      setIsReordering(false);
    }
  };

  // Delete Entry
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/education/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error();

      setEducationList((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      showToast(`Deleted "${deleteTarget.title}"`, 'success');
      setDeleteTarget(null);
    } catch {
      showToast('Failed to delete entry', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Date Formatter
  const formatDate = (dateStr: string) => {
    try {
      const [year, month] = dateStr.split('-');
      if (year && month) {
        const d = new Date(Number(year), Number(month) - 1, 1);
        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Type Icon and Color Helper
  const getTypeBadge = (entryType: EducationJourneyType) => {
    switch (entryType) {
      case 'Education':
        return {
          icon: GraduationCap,
          color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          label: 'Education',
        };
      case 'Certification':
        return {
          icon: Award,
          color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          label: 'Certification',
        };
      case 'Course':
        return {
          icon: BookOpen,
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          label: 'Course',
        };
      case 'Achievement':
        return {
          icon: Trophy,
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          label: 'Achievement',
        };
      case 'Learning':
      default:
        return {
          icon: Compass,
          color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          label: 'Learning',
        };
    }
  };

  // Filtered List
  const filteredList = educationList.filter((item) => {
    // Status filter
    if (filterStatus === 'published' && !item.published) return false;
    if (filterStatus === 'draft' && item.published) return false;

    // Type filter
    if (filterType !== 'all' && item.type !== filterType) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchInst = item.institution.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchSkills = item.skills_learned?.some((s) => s.toLowerCase().includes(q));
      const matchTech = item.technologies?.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchInst || matchDesc || matchSkills || matchTech;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Education &amp; Journey
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your degrees, certifications, courses, achievements, and self-directed learning milestones.
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={() => {
            setItemToEdit(null);
            setIsModalOpen(true);
          }}
          icon={<Plus className="w-4 h-4" />}
        >
          Add New Entry
        </Button>
      </div>

      {/* Filters and Controls */}
      <Card className="p-4 border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, university, course, or skills..."
              className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 self-start md:self-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All ({educationList.length})
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === 'published'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Published ({educationList.filter((e) => e.published).length})
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === 'draft'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Drafts ({educationList.filter((e) => !e.published).length})
            </button>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Type:
          </span>
          {(['all', 'Education', 'Certification', 'Course', 'Achievement', 'Learning'] as const).map((t) => {
            const isSelected = filterType === t;
            return (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'all' ? 'All Types' : t}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Education Table */}
      <Card className="p-0 overflow-hidden border-slate-800 shadow-xl bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4 w-12 text-center">Order</th>
                <th className="py-3 px-4">Credential &amp; Institution</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 px-6 text-center text-slate-400">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-white">No Education or Journey Entries Found</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {searchQuery || filterStatus !== 'all' || filterType !== 'all'
                          ? 'No entries match your search filters. Try clearing your filters or search query.'
                          : 'As a fresher, showcase your academic degrees, certifications, courses, hackathon achievements, and self-taught skills.'}
                      </p>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setItemToEdit(null);
                          setIsModalOpen(true);
                        }}
                        icon={<Plus className="w-4 h-4" />}
                      >
                        Add Your First Entry
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => {
                  const badgeInfo = getTypeBadge(item.type);
                  const Icon = badgeInfo.icon;
                  const isFirst = index === 0;
                  const isLast = index === filteredList.length - 1;

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Order Controls */}
                      <td className="py-4 px-3 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <button
                            disabled={isFirst || isReordering}
                            onClick={() => handleMove(index, 'up')}
                            className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[11px] font-mono font-medium text-slate-400">
                            {item.sort_order}
                          </span>
                          <button
                            disabled={isLast || isReordering}
                            onClick={() => handleMove(index, 'down')}
                            className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Title & Institution */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {item.logo_url ? (
                            <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                              <Icon className="w-5 h-5" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-sm truncate">
                                {item.title}
                              </span>
                              {item.certificate_url && (
                                <a
                                  href={item.certificate_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-400 hover:text-indigo-400 transition-colors"
                                  title="View Certificate"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                            <span className="text-xs text-indigo-400 font-medium block truncate">
                              {item.institution}
                            </span>
                            {item.skills_learned && item.skills_learned.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {item.skills_learned.slice(0, 3).map((s) => (
                                  <span key={s} className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 text-[10px]">
                                    {s}
                                  </span>
                                ))}
                                {item.skills_learned.length > 3 && (
                                  <span className="text-[10px] text-slate-500 self-center">
                                    +{item.skills_learned.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${badgeInfo.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          <span>{badgeInfo.label}</span>
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-300 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>
                            {formatDate(item.start_date)} –{' '}
                            {item.current ? (
                              <span className="text-emerald-400 font-semibold">Present</span>
                            ) : item.end_date ? (
                              formatDate(item.end_date)
                            ) : (
                              <span className="text-emerald-400 font-semibold">Present</span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(item)}
                          className="flex items-center gap-1.5 text-xs focus:outline-none"
                          title="Click to toggle status"
                        >
                          {item.published ? (
                            <Badge variant="emerald" className="gap-1 cursor-pointer hover:opacity-90">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Published</span>
                            </Badge>
                          ) : (
                            <Badge variant="default" className="gap-1 text-slate-400 cursor-pointer hover:opacity-90">
                              <XCircle className="w-3 h-3" />
                              <span>Draft</span>
                            </Badge>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setItemToEdit(item);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Edit Entry"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Editor Modal */}
      <EducationEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemToEdit={itemToEdit}
        onSave={(saved) => {
          setEducationList((prev) => {
            const exists = prev.some((e) => e.id === saved.id);
            if (exists) {
              return prev.map((e) => (e.id === saved.id ? saved : e));
            }
            return [...prev, saved].sort((a, b) => a.sort_order - b.sort_order);
          });
          showToast(itemToEdit ? 'Entry updated successfully' : 'New entry created', 'success');
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Delete Entry</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-200">&ldquo;{deleteTarget.title}&rdquo;</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-500 text-white"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                icon={isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
