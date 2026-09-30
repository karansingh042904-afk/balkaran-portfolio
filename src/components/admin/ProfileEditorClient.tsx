'use client';

import React, { useState } from 'react';
import { Profile } from '@/types/portfolio';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  User,
  Mail,
  MapPin,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  Save,
  Check,
  Briefcase,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons';

interface ProfileEditorClientProps {
  initialProfile: Profile;
}

export function ProfileEditorClient({ initialProfile }: ProfileEditorClientProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [activeTab, setActiveTab] = useState<'identity' | 'academic' | 'contact' | 'media'>('identity');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFieldChange = (field: keyof Profile, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!profile.full_name?.trim()) {
      showToast('error', 'Full name is required');
      return;
    }

    if (!profile.email?.trim()) {
      showToast('error', 'Email address is required');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setProfile(data.profile);
      showToast('success', 'Profile updated successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while saving';
      showToast('error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar_url' | 'resume_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', field === 'avatar_url' ? 'avatars' : 'resumes');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload file');
      }

      handleFieldChange(field, data.url);
      showToast('success', `${field === 'avatar_url' ? 'Avatar' : 'Resume'} uploaded successfully!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      showToast('error', msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
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
            <h1 className="text-2xl font-bold text-white tracking-tight">Profile &amp; Biography</h1>
            <Badge variant="accent">CV Aligned</Badge>
          </div>
          <p className="text-sm text-slate-400">
            Manage your personal bio, academic background, contact info, and public presence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="md"
            onClick={() => handleSave()}
            disabled={isSaving}
            icon={isSaving ? undefined : <Save className="w-4 h-4" />}
          >
            {isSaving ? 'Saving Changes...' : 'Save Profile'}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('identity')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'identity'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Identity &amp; Bio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('academic')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'academic'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Education &amp; Degree</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'contact'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Contact &amp; Social</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'media'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Photo &amp; Resume</span>
        </button>
      </div>

      {/* Main Content Area */}
      <form onSubmit={handleSave}>
        <Card className="p-6 sm:p-8 space-y-6 border-slate-800">
          {/* TAB 1: IDENTITY & BIO */}
          {activeTab === 'identity' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => handleFieldChange('full_name', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Balkaran Singh"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Professional Headline <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.headline}
                    onChange={(e) => handleFieldChange('headline', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Full Stack Web Developer | AI & Automation Enthusiast"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Short Introduction / Career Objective (from CV)
                </label>
                <textarea
                  rows={2}
                  value={profile.short_intro || ''}
                  onChange={(e) => handleFieldChange('short_intro', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 leading-relaxed"
                  placeholder="Career objective or short pitch"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Highlights your core motivation and professional aspiration in hero sections and bio summaries.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Biography &amp; Background
                </label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => handleFieldChange('bio', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 leading-relaxed"
                  placeholder="Detailed biography about your background, interests, and engineering approach"
                  required
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <input
                  type="checkbox"
                  id="available_for_work"
                  checked={profile.available_for_work}
                  onChange={(e) => handleFieldChange('available_for_work', e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                <label htmlFor="available_for_work" className="text-sm font-medium text-slate-200 cursor-pointer">
                  Available for new opportunities, full-time roles &amp; technical projects
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC DETAILS */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  As a fresher, these academic highlights represent your primary credentials on the public site and help recruiters instantly understand your educational standing.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Degree / Qualification
                  </label>
                  <input
                    type="text"
                    value={profile.degree || ''}
                    onChange={(e) => handleFieldChange('degree', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. B.Tech in Computer Science & Information Technology"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Minor / Specialization
                  </label>
                  <input
                    type="text"
                    value={profile.specialization || ''}
                    onChange={(e) => handleFieldChange('specialization', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Minor in Artificial Intelligence"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Current Education Status &amp; Performance
                </label>
                <input
                  type="text"
                  value={profile.education_status || ''}
                  onChange={(e) => handleFieldChange('education_status', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Pursuing B.Tech at ADYPU (2025–Present, 7.6 CGPA in 1st year)"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Shown in the hero status badge and education summary.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & SOCIAL */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. karansingh042906@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Location / Availability Region
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={profile.location || ''}
                      onChange={(e) => handleFieldChange('location', e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. India (Open to Remote & Relocation)"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Notice: Permanent home address is NOT publicly exposed.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    LinkedIn Profile URL
                  </label>
                  <div className="relative">
                    <LinkedinIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      value={profile.linkedin_url || ''}
                      onChange={(e) => handleFieldChange('linkedin_url', e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    GitHub Profile URL
                  </label>
                  <div className="relative">
                    <GithubIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      value={profile.github_url || ''}
                      onChange={(e) => handleFieldChange('github_url', e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="https://github.com/your-username"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PHOTO & RESUME */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Avatar / Photo */}
                <div className="space-y-4">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Profile Avatar / Photo
                  </label>
                  <div className="flex items-center gap-4">
                    {profile.avatar_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-20 h-20 rounded-2xl object-cover bg-slate-900 border border-slate-800"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                        <User className="w-8 h-8" />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? 'Uploading...' : 'Upload Avatar'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'avatar_url')}
                          disabled={isUploading}
                        />
                      </label>
                      <p className="text-[11px] text-slate-500">JPG, PNG, or WebP. Max 5MB.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Direct Image URL</label>
                    <input
                      type="url"
                      value={profile.avatar_url || ''}
                      onChange={(e) => handleFieldChange('avatar_url', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Resume / CV */}
                <div className="space-y-4">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Resume / CV Document
                  </label>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-200 truncate">
                          {profile.resume_url ? profile.resume_url.split('/').pop() || 'Resume Document' : 'No resume uploaded yet'}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {profile.resume_url ? 'Available for download on public portfolio' : 'Upload your PDF CV'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload PDF</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'resume_url')}
                          disabled={isUploading}
                        />
                      </label>

                      {profile.resume_url && (
                        <a
                          href={profile.resume_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                        >
                          Preview Current
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Direct Resume URL</label>
                    <input
                      type="url"
                      value={profile.resume_url || ''}
                      onChange={(e) => handleFieldChange('resume_url', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Changes reflect immediately across the public portfolio upon saving.
            </p>

            <Button
              type="submit"
              size="md"
              disabled={isSaving}
              icon={isSaving ? undefined : <Save className="w-4 h-4" />}
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
