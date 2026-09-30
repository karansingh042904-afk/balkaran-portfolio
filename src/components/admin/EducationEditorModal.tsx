'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EducationJourney, EducationJourneyType } from '@/types/portfolio';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  Upload,
  GraduationCap,
  Award,
  BookOpen,
  Trophy,
  Compass,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
} from 'lucide-react';

interface EducationEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (savedItem: EducationJourney) => void;
  itemToEdit?: EducationJourney | null;
}

const TYPE_OPTIONS: Array<{
  value: EducationJourneyType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  { value: 'Education', label: 'Education', icon: GraduationCap, description: 'Degrees, diplomas, university, high school' },
  { value: 'Certification', label: 'Certification', icon: Award, description: 'Industry certifications (AWS, Meta, Google)' },
  { value: 'Course', label: 'Course', icon: BookOpen, description: 'Bootcamps, online courses, tutorials' },
  { value: 'Achievement', label: 'Achievement', icon: Trophy, description: 'Hackathons, honors, academic ranks' },
  { value: 'Learning', label: 'Learning Journey', icon: Compass, description: 'Self-directed projects & skill milestones' },
];

const PRESET_SKILLS = [
  'Data Structures & Algorithms',
  'Object-Oriented Programming',
  'System Design',
  'Full-Stack Web Development',
  'Database Management',
  'Software Engineering Principles',
  'Cloud Computing',
  'Computer Networks',
  'Operating Systems',
  'RESTful APIs',
];

const PRESET_TECH = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'SQL',
  'PostgreSQL',
  'Tailwind CSS',
  'Git',
  'Docker',
];

export function EducationEditorModal({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
}: EducationEditorModalProps) {
  const isEditing = Boolean(itemToEdit);

  // Form State
  const [type, setType] = useState<EducationJourneyType>('Education');
  const [institution, setInstitution] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [current, setCurrent] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [skillsLearned, setSkillsLearned] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [published, setPublished] = useState(true);

  // UI State
  const [activeTab, setActiveTab] = useState<'info' | 'timeline' | 'skills'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill on open/edit
  useEffect(() => {
    if (itemToEdit) {
      setType(itemToEdit.type || 'Education');
      setInstitution(itemToEdit.institution || '');
      setTitle(itemToEdit.title || '');
      setDescription(itemToEdit.description || '');
      setStartDate(itemToEdit.start_date || '');
      setEndDate(itemToEdit.end_date || '');
      setCurrent(Boolean(itemToEdit.current));
      setCertificateUrl(itemToEdit.certificate_url || '');
      setLogoUrl(itemToEdit.logo_url || '');
      setSkillsLearned(itemToEdit.skills_learned || []);
      setTechnologies(itemToEdit.technologies || []);
      setSortOrder(itemToEdit.sort_order || 0);
      setPublished(itemToEdit.published !== undefined ? itemToEdit.published : true);
    } else {
      setType('Education');
      setInstitution('');
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setCurrent(false);
      setCertificateUrl('');
      setLogoUrl('');
      setSkillsLearned([]);
      setTechnologies([]);
      setSortOrder(0);
      setPublished(true);
    }
    setActiveTab('info');
    setErrorMessage(null);
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle Logo Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'company-logos');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload logo');

      setLogoUrl(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Logo upload failed';
      setErrorMessage(msg);
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add Skill
  const handleAddSkill = (skillToAdd?: string) => {
    const s = (skillToAdd || skillInput).trim();
    if (s && !skillsLearned.includes(s)) {
      setSkillsLearned([...skillsLearned, s]);
      setSkillInput('');
    }
  };

  // Remove Skill
  const handleRemoveSkill = (sToRemove: string) => {
    setSkillsLearned(skillsLearned.filter((s) => s !== sToRemove));
  };

  // Add Tech
  const handleAddTech = (techToAdd?: string) => {
    const t = (techToAdd || techInput).trim();
    if (t && !technologies.includes(t)) {
      setTechnologies([...technologies, t]);
      setTechInput('');
    }
  };

  // Remove Tech
  const handleRemoveTech = (tToRemove: string) => {
    setTechnologies(technologies.filter((t) => t !== tToRemove));
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!institution.trim()) {
      setErrorMessage('Institution or organization name is required');
      setActiveTab('info');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Title / Degree / Certification name is required');
      setActiveTab('info');
      return;
    }

    if (!startDate.trim()) {
      setErrorMessage('Start date is required');
      setActiveTab('timeline');
      return;
    }

    if (!current && endDate && new Date(endDate) < new Date(startDate)) {
      setErrorMessage('End date cannot be earlier than start date');
      setActiveTab('timeline');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        type,
        institution: institution.trim(),
        title: title.trim(),
        description: description.trim(),
        start_date: startDate.trim(),
        end_date: current ? null : endDate.trim() || null,
        current,
        certificate_url: certificateUrl.trim() || null,
        logo_url: logoUrl.trim() || null,
        skills_learned: skillsLearned,
        technologies,
        sort_order: Number(sortOrder) || 0,
        published,
      };

      const url = isEditing && itemToEdit
        ? `/api/admin/education/${itemToEdit.id}`
        : '/api/admin/education';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save entry');
      }

      onSave(data.education);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred while saving';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl my-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {isEditing ? 'Edit Education & Journey Entry' : 'Add New Education & Journey Entry'}
              </h2>
              <p className="text-xs text-slate-400">
                Document your academic degrees, certifications, courses, or learning milestones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/60">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'info'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>1. Basic Info & Type</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>2. Timeline & Verification</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'skills'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>3. Skills & Technologies</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'info' && (
            <div className="space-y-5">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Entry Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {TYPE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = type === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setType(opt.value)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <span className="text-xs font-semibold block">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Institution and Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Institution or Organization <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Delhi Technological University, Coursera, AWS"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Title / Degree / Credential <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science, AWS Solutions Architect"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Overview & Key Learnings
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your coursework, primary focus areas, achievements, capstone projects, or what you built during this period..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Institution Logo */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Institution Logo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  {logoUrl ? (
                    <div className="relative w-14 h-14 rounded-xl border border-slate-700 bg-slate-950 p-2 flex items-center justify-center shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setLogoUrl('')}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://... or upload image"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={uploadingLogo}
                        onClick={() => fileInputRef.current?.click()}
                        icon={uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      >
                        {uploadingLogo ? 'Uploading...' : 'Upload'}
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Recommended: PNG or SVG with transparent background (1:1 aspect ratio).
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE & VERIFICATION */}
          {activeTab === 'timeline' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Start Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    End Date {!current && <span className="text-slate-500">(Leave blank if ongoing)</span>}
                  </label>
                  <input
                    type="date"
                    disabled={current}
                    value={current ? '' : endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Currently studying toggle */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white block">
                    Currently Studying / Pursuing
                  </span>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    Display as &ldquo;Present&rdquo; on timeline (e.g. 2023 – Present)
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={current}
                    onChange={(e) => {
                      setCurrent(e.target.checked);
                      if (e.target.checked) setEndDate('');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Certificate URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Certificate / Credential Verification URL (Optional)
                </label>
                <div className="relative">
                  <ExternalLink className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={certificateUrl}
                    onChange={(e) => setCertificateUrl(e.target.value)}
                    placeholder="https://coursera.org/verify/... or https://www.credly.com/badges/..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Sort Order & Published */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Lower numbers appear first.</span>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className="text-xs font-medium text-slate-200">
                      Publish to public portfolio
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS & TECH */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Skills Learned */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Core Competencies &amp; Skills Learned
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type skill and press Enter (e.g. Object-Oriented Design)"
                    className="flex-1 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={() => handleAddSkill()} icon={<Plus className="w-3.5 h-3.5" />}>
                    Add
                  </Button>
                </div>

                {/* Preset suggestions */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-[11px] text-slate-500 self-center mr-1">Suggestions:</span>
                  {PRESET_SKILLS.filter((s) => !skillsLearned.includes(s)).slice(0, 5).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddSkill(s)}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-800/60 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-slate-700/60 transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>

                {/* Active Skills Badges */}
                <div className="flex flex-wrap gap-2 min-h-[38px] p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  {skillsLearned.length === 0 ? (
                    <span className="text-xs text-slate-500 self-center">No skills added yet</span>
                  ) : (
                    skillsLearned.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                      >
                        {s}
                        <button type="button" onClick={() => handleRemoveSkill(s)} className="text-slate-400 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Technologies &amp; Tools Used
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    placeholder="Type technology and press Enter (e.g. Python, React)"
                    className="flex-1 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={() => handleAddTech()} icon={<Plus className="w-3.5 h-3.5" />}>
                    Add
                  </Button>
                </div>

                {/* Preset Tech suggestions */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-[11px] text-slate-500 self-center mr-1">Suggestions:</span>
                  {PRESET_TECH.filter((t) => !technologies.includes(t)).slice(0, 6).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleAddTech(t)}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-800/60 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-200 border border-slate-700/60 transition-colors"
                    >
                      + {t}
                    </button>
                  ))}
                </div>

                {/* Active Tech Badges */}
                <div className="flex flex-wrap gap-2 min-h-[38px] p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  {technologies.length === 0 ? (
                    <span className="text-xs text-slate-500 self-center">No technologies added yet</span>
                  ) : (
                    technologies.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      >
                        {t}
                        <button type="button" onClick={() => handleRemoveTech(t)} className="text-slate-400 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>

            <div className="flex items-center gap-2">
              {activeTab !== 'info' && (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setActiveTab(activeTab === 'skills' ? 'timeline' : 'info')}
                >
                  Previous
                </Button>
              )}

              {activeTab !== 'skills' ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setActiveTab(activeTab === 'info' ? 'timeline' : 'skills')}
                >
                  Next
                </Button>
              ) : null}

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Entry'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
