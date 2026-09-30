'use client';

import React, { useState } from 'react';
import { EducationJourney } from '@/types/portfolio';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EducationEditorModal } from '@/components/admin/EducationEditorModal';
import {
  Award,
  Plus,
  Search,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Building2,
} from 'lucide-react';

interface CertificationsManagementClientProps {
  initialCertifications: EducationJourney[];
}

export function CertificationsManagementClient({
  initialCertifications,
}: CertificationsManagementClientProps) {
  const [certifications, setCertifications] = useState<EducationJourney[]>(initialCertifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<EducationJourney | null>(null);
  const [certToDelete, setCertToDelete] = useState<EducationJourney | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const filtered = certifications.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && cert.published) ||
      (statusFilter === 'draft' && !cert.published);

    return matchesSearch && matchesStatus;
  });

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filtered.length) return;

    const newFiltered = [...filtered];
    const temp = newFiltered[index];
    newFiltered[index] = newFiltered[targetIndex];
    newFiltered[targetIndex] = temp;

    const orderedIds = newFiltered.map((c) => c.id);
    const updated = certifications.map((c) => {
      const idx = orderedIds.indexOf(c.id);
      return idx !== -1 ? { ...c, sort_order: idx + 1 } : c;
    }).sort((a, b) => a.sort_order - b.sort_order);

    setCertifications(updated);

    try {
      const res = await fetch('/api/admin/education/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
      if (!res.ok) throw new Error('Failed to update sort order');
      showToast('success', 'Order updated');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reorder failed';
      showToast('error', msg);
    }
  };

  const handleTogglePublish = async (cert: EducationJourney) => {
    const newStatus = !cert.published;
    setCertifications((prev) =>
      prev.map((c) => (c.id === cert.id ? { ...c, published: newStatus } : c))
    );

    try {
      const res = await fetch(`/api/admin/education/${cert.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update published status');
      showToast('success', `Marked as ${newStatus ? 'published' : 'draft'}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      showToast('error', msg);
      setCertifications((prev) =>
        prev.map((c) => (c.id === cert.id ? { ...c, published: cert.published } : c))
      );
    }
  };

  const handleSaveCert = async (savedCert: EducationJourney) => {
    if (editingCert) {
      setCertifications((prev) =>
        prev.map((c) => (c.id === savedCert.id ? savedCert : c))
      );
      showToast('success', 'Certification updated successfully');
    } else {
      setCertifications((prev) => [...prev, savedCert]);
      showToast('success', 'Certification created successfully');
    }
    setIsModalOpen(false);
    setEditingCert(null);
  };

  const handleDeleteConfirm = async () => {
    if (!certToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/education/${certToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete certification');

      setCertifications((prev) => prev.filter((c) => c.id !== certToDelete.id));
      showToast('success', `Deleted "${certToDelete.title}"`);
      setCertToDelete(null);
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
            <h1 className="text-2xl font-bold text-white tracking-tight">Professional Certifications</h1>
            <Badge variant="emerald">{certifications.length} Total</Badge>
          </div>
          <p className="text-sm text-slate-400">
            Manage your verified certifications from CISCO, Six Sigma Study, and other accredited issuers.
          </p>
        </div>

        <Button
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditingCert(null);
            setIsModalOpen(true);
          }}
        >
          Add Certification
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certifications or issuers..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              statusFilter === 'all' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({certifications.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              statusFilter === 'published' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Published ({certifications.filter((c) => c.published).length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              statusFilter === 'draft' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Drafts ({certifications.filter((c) => !c.published).length})
          </button>
        </div>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-6">Certification &amp; Issuer</th>
                <th className="py-3 px-6">Issuing Body</th>
                <th className="py-3 px-6">Verification</th>
                <th className="py-3 px-6 text-center">Order</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-6 text-center text-slate-400">
                    <p className="font-medium text-slate-300">No certifications found.</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Click &apos;Add Certification&apos; to register one.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((cert, index) => (
                  <tr key={cert.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{cert.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {cert.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-6 text-slate-300 text-xs font-medium">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        {cert.institution}
                      </span>
                    </td>

                    <td className="py-3.5 px-6">
                      {cert.certificate_url ? (
                        <a
                          href={cert.certificate_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
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
                          #{cert.sort_order}
                        </span>
                        <button
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === filtered.length - 1}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <button
                        onClick={() => handleTogglePublish(cert)}
                        className="inline-flex items-center gap-1.5 focus:outline-none"
                        title={cert.published ? 'Click to unpublish' : 'Click to publish'}
                      >
                        {cert.published ? (
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
                            setEditingCert(cert);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800/80 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCertToDelete(cert)}
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
      <EducationEditorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCert(null);
        }}
        onSave={handleSaveCert}
        itemToEdit={editingCert}
      />

      {/* Delete Modal */}
      {certToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md border-slate-800 bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Delete Certification</h3>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to delete <span className="font-semibold text-white">&quot;{certToDelete.title}&quot;</span> from {certToDelete.institution}?
            </p>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setCertToDelete(null)}
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
                {isDeleting ? 'Deleting...' : 'Delete Certification'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
