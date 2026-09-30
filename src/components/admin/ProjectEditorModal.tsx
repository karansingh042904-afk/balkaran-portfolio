'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProjectWithImages } from '@/types/portfolio';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  Code,
  Loader2,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons/BrandIcons';

interface ProjectEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (savedProject: ProjectWithImages) => void;
  projectToEdit?: ProjectWithImages | null;
}

export function ProjectEditorModal({
  isOpen,
  onClose,
  onSave,
  projectToEdit,
}: ProjectEditorModalProps) {
  const isEditing = Boolean(projectToEdit);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [role, setRole] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [caseStudyContent, setCaseStudyContent] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [resultInput, setResultInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  // Project Images State (Multiple gallery images)
  const [projectImages, setProjectImages] = useState<
    Array<{ id?: string; image_url: string; caption?: string; sort_order?: number }>
  >([]);

  // UI State
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'media' | 'results'>('basic');
  const [previewCaseStudy, setPreviewCaseStudy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill fields when editing
  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title || '');
      setSlug(projectToEdit.slug || '');
      setShortDescription(projectToEdit.short_description || '');
      setFullDescription(projectToEdit.full_description || '');
      setCategory(projectToEdit.category || '');
      setYear(projectToEdit.year || new Date().getFullYear());
      setRole(projectToEdit.role || '');
      setTechnologies(projectToEdit.technologies || []);
      setThumbnail(projectToEdit.thumbnail || '');
      setProjectUrl(projectToEdit.project_url || '');
      setGithubUrl(projectToEdit.github_url || '');
      setCaseStudyContent(projectToEdit.case_study_content || '');
      setResults(projectToEdit.results || []);
      setFeatured(Boolean(projectToEdit.featured));
      setPublished(Boolean(projectToEdit.published));
      setSortOrder(projectToEdit.sort_order || 0);
      setProjectImages(
        (projectToEdit.project_images || []).map((img) => ({
          id: img.id,
          image_url: img.image_url,
          caption: img.caption || '',
          sort_order: img.sort_order,
        }))
      );
    } else {
      // Default blank state
      setTitle('');
      setSlug('');
      setShortDescription('');
      setFullDescription('');
      setCategory('Enterprise SaaS');
      setYear(new Date().getFullYear());
      setRole('Lead Frontend Architect');
      setTechnologies(['Next.js', 'React', 'TypeScript', 'Tailwind CSS']);
      setThumbnail('');
      setProjectUrl('');
      setGithubUrl('');
      setCaseStudyContent('');
      setResults([]);
      setFeatured(false);
      setPublished(true);
      setSortOrder(0);
      setProjectImages([]);
    }
    setErrorMessage(null);
    setActiveTab('basic');
  }, [projectToEdit, isOpen]);

  // Auto slug generation from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing || !slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  // Technologies Tag Handlers
  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tag: string) => {
    setTechnologies(technologies.filter((t) => t !== tag));
  };

  // Results Handlers
  const handleAddResult = () => {
    const trimmed = resultInput.trim();
    if (trimmed && !results.includes(trimmed)) {
      setResults([...results, trimmed]);
      setResultInput('');
    }
  };

  const handleRemoveResult = (index: number) => {
    setResults(results.filter((_, i) => i !== index));
  };

  // Thumbnail File Upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'project-images');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setThumbnail(data.url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload thumbnail');
    } finally {
      setUploadingThumbnail(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    }
  };

  // Multiple Gallery Images Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setErrorMessage(null);

    try {
      const uploadedImages: Array<{ image_url: string; caption?: string; sort_order?: number }> = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'project-images');

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          uploadedImages.push({
            image_url: data.url,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            sort_order: projectImages.length + uploadedImages.length + 1,
          });
        }
      }

      setProjectImages([...projectImages, ...uploadedImages]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload gallery images');
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setProjectImages(projectImages.filter((_, i) => i !== index));
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updated = [...projectImages];
    updated[index].caption = caption;
    setProjectImages(updated);
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Project title is required');
      setActiveTab('basic');
      return;
    }

    if (!slug.trim()) {
      setErrorMessage('Project slug is required');
      setActiveTab('basic');
      return;
    }

    if (!category.trim()) {
      setErrorMessage('Category is required');
      setActiveTab('basic');
      return;
    }

    if (!shortDescription.trim()) {
      setErrorMessage('Short summary description is required');
      setActiveTab('content');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      short_description: shortDescription.trim(),
      full_description: fullDescription.trim() || shortDescription.trim(),
      category: category.trim(),
      year: Number(year) || new Date().getFullYear(),
      role: role.trim() || 'Lead Engineer',
      technologies,
      thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      project_url: projectUrl.trim() || null,
      github_url: githubUrl.trim() || null,
      case_study_content: caseStudyContent.trim() || null,
      results,
      featured,
      published,
      sort_order: Number(sortOrder) || 0,
      project_images: projectImages.map((img, idx) => ({
        image_url: img.image_url,
        caption: img.caption || null,
        sort_order: idx + 1,
      })),
    };

    try {
      const url = isEditing
        ? `/api/admin/projects/${projectToEdit?.id}`
        : '/api/admin/projects';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save project');
      }

      onSave(data.project);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while saving the project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {isEditing ? `Edit Project: ${projectToEdit?.title}` : 'Add New Project'}
            </h2>
            <p className="text-xs text-slate-400">
              Complete project case study details, tech stack, and media assets
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 flex gap-2 bg-slate-950/40 shrink-0">
          {[
            { id: 'basic', label: '1. Basic Info' },
            { id: 'content', label: '2. Descriptions & Case Study' },
            { id: 'media', label: '3. Media & Gallery' },
            { id: 'results', label: '4. Outcomes & Visibility' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Project Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Apex Horizon - AI Telemetry Platform"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    URL Slug <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-500 text-sm">/</span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      placeholder="apex-horizon"
                      className="w-full pl-7 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Enterprise SaaS, Creative Tech"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Year
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Lead Frontend Architect"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Technologies Chip Editor */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Technologies Used
                </label>
                <div className="flex gap-2 mb-2">
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
                    placeholder="Type tech name (e.g. Next.js, Supabase, Three.js) and press Add"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddTech}>
                    Add Tech
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  {technologies.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No technologies added yet</span>
                  ) : (
                    technologies.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(t)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Live Project URL
                  </label>
                  <div className="relative">
                    <ExternalLink className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      value={projectUrl}
                      onChange={(e) => setProjectUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    GitHub Repository URL
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-500">
                      <GithubIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/org/repo"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DESCRIPTIONS & CASE STUDY */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Short Description (Cards &amp; Summary) <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Concise 1-2 sentence description shown on project cards..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Description
                </label>
                <textarea
                  rows={4}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Comprehensive explanation of what the platform does and why it was built..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Case Study Content (Markdown) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Case Study Content (Markdown Supported)
                  </label>
                  <button
                    type="button"
                    onClick={() => setPreviewCaseStudy(!previewCaseStudy)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    {previewCaseStudy ? <Code className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{previewCaseStudy ? 'Edit Markdown' : 'Preview Output'}</span>
                  </button>
                </div>

                {previewCaseStudy ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[160px] prose prose-invert text-xs text-slate-300 whitespace-pre-line">
                    {caseStudyContent || '*No case study content provided yet.*'}
                  </div>
                ) : (
                  <textarea
                    rows={6}
                    value={caseStudyContent}
                    onChange={(e) => setCaseStudyContent(e.target.value)}
                    placeholder="# Challenge & Solution&#10;&#10;Explain technical architecture, engineering hurdles overcome, and performance gains..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA & GALLERY */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Thumbnail Uploader */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Project Cover Thumbnail
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {thumbnail ? (
                    <div className="relative aspect-video w-40 rounded-lg overflow-hidden border border-slate-800 shrink-0 bg-slate-900">
                      <img src={thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video w-40 rounded-lg border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600 shrink-0">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-[10px]">No Thumbnail</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={thumbnailInputRef}
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={uploadingThumbnail}
                        onClick={() => thumbnailInputRef.current?.click()}
                        icon={uploadingThumbnail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      >
                        {uploadingThumbnail ? 'Uploading to Supabase...' : 'Upload Thumbnail'}
                      </Button>
                      {thumbnail && (
                        <button
                          type="button"
                          onClick={() => setThumbnail('')}
                          className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="url"
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      placeholder="Or enter direct image URL (https://...)"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Multiple Project Images Gallery Manager */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                      Gallery Images ({projectImages.length})
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Upload multiple high-resolution screenshots, diagrams, and UI walkthroughs
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={galleryInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingGallery}
                    onClick={() => galleryInputRef.current?.click()}
                    icon={uploadingGallery ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  >
                    {uploadingGallery ? 'Uploading...' : 'Add Images'}
                  </Button>
                </div>

                {projectImages.length === 0 ? (
                  <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs">
                    No gallery images uploaded yet. Click &quot;Add Images&quot; to upload screenshots.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projectImages.map((img, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800"
                      >
                        <div className="w-20 h-14 rounded-md overflow-hidden bg-slate-800 shrink-0 border border-slate-800">
                          <img src={img.image_url} alt="Gallery item" className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 w-full">
                          <input
                            type="text"
                            value={img.caption || ''}
                            onChange={(e) => handleCaptionChange(index, e.target.value)}
                            placeholder="Image caption / description..."
                            className="w-full px-2.5 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded transition-colors self-end sm:self-center"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: OUTCOMES & VISIBILITY */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              {/* Results & Metrics Builder */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Key Outcomes &amp; Metrics
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={resultInput}
                    onChange={(e) => setResultInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddResult();
                      }
                    }}
                    placeholder="e.g. 4.2x faster incident detection, 99.98% uptime achieved"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddResult}>
                    Add Result
                  </Button>
                </div>

                <div className="space-y-2">
                  {results.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                      No outcomes listed yet. Add quantifiable achievements to highlight on project cards.
                    </div>
                  ) : (
                    results.map((res, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{res}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveResult(i)}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Publish & Featured Toggles */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Portfolio Visibility &amp; Ordering
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-950 border-slate-700"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">Published</span>
                      <span className="text-[11px] text-slate-400">Publicly visible on the website</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-950 border-slate-700"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">Featured</span>
                      <span className="text-[11px] text-slate-400">Prominently highlighted on homepage</span>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Sort Order Priority
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-32 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500 ml-2">Lower numbers appear first</span>
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                size="md"
                icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
              >
                {isSubmitting ? 'Saving Project...' : isEditing ? 'Save Changes' : 'Create Project'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
