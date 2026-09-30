import fs from 'fs/promises';
import path from 'path';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Project, ProjectWithImages, ProjectInsert, ProjectUpdate, ProjectImage } from '@/types/portfolio';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'projects.json');

const INITIAL_PROJECTS: ProjectWithImages[] = [
  {
    id: 'da09eb29-4922-42f0-97c0-93ccd06c5687',
    title: 'Juro-AI',
    slug: 'juro-ai',
    short_description: 'AI-driven legal intelligence and contract management platform tailored for Indian law with automated drafting, risk analysis, and agentic workflows.',
    full_description: 'Juro-AI is an AI-driven legal intelligence platform tailored for Indian law, featuring an agentic workflow that structures user queries into actionable legal steps, risk scores, and citations.\n\nKey Capabilities:\n• Document Studio: Enables automated, structured drafting of legal agreements (Rental Agreements, NDAs, Affidavits) with custom data fields.\n• Legal Assistant & Risk Analyzer: Evaluates dispute severity (Low/Medium/High) and provides plain-language explanations of Indian statutes (e.g., FIR vs. NCR).\n• Responsive UI: Engineered using modern glassmorphism design principles, modular components, and real-time streaming states.',
    category: 'LegalTech & AI',
    year: 2026,
    role: 'Full-Stack & AI Developer',
    technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'OpenAI API', 'Tailwind CSS'],
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    project_url: 'https://juro-ai-neon.vercel.app',
    github_url: 'https://github.com/karansingh042904-afk/Juro-AI',
    case_study_content: '# Juro-AI: Intelligent Contract & Legal Assistant\n\nJuro-AI streamlines contract generation and legal advisory workflows for Indian legal jurisdictions.\n\n### Core Engineering Highlights\n- **Agentic Legal Workflows**: Breaks complex legal queries into multi-step discovery, statutes lookup, and risk quantification.\n- **Automated Document Studio**: Dynamic template interpolation for NDAs, tenancy agreements, and affidavits.\n- **Real-Time Streaming**: Context-aware LLM generation with low latency and streaming responses.',
    results: [
      'Built, tested, and deployed functional MVP in 24-hour rapid development sprint',
      'Automated drafting for NDAs, rental agreements, and affidavits with custom parameters',
      'Sub-2s legal dispute risk scoring and plain-language statute explanations',
    ],
    featured: true,
    published: true,
    sort_order: 1,
    created_at: '2026-09-19T10:25:49.508Z',
    updated_at: '2026-09-30T12:00:00.000Z',
    project_images: [
      {
        id: 'f3b89845-6fbb-424f-8250-aba463a4e1fe',
        project_id: 'da09eb29-4922-42f0-97c0-93ccd06c5687',
        image_url: '/uploads/1789813797363-g3h715.png',
        caption: 'Juro-AI Legal Studio Dashboard',
        sort_order: 1,
        created_at: '2026-09-19T10:33:34.059Z',
      },
      {
        id: '11295b05-9603-4a17-aa6a-98ba351287b1',
        project_id: 'da09eb29-4922-42f0-97c0-93ccd06c5687',
        image_url: '/uploads/1789813805539-757o9q.png',
        caption: 'Contextual Legal Assistant & Risk Analyzer',
        sort_order: 2,
        created_at: '2026-09-19T10:33:34.059Z',
      },
      {
        id: '28593ef8-775d-4dc8-b637-e3a2dadea0f5',
        project_id: 'da09eb29-4922-42f0-97c0-93ccd06c5687',
        image_url: '/uploads/1789813880890-jwn1wy.png',
        caption: 'Document Studio Agreement Generator',
        sort_order: 3,
        created_at: '2026-09-19T10:33:34.059Z',
      },
    ],
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'LegalLens AI',
    slug: 'legallens-ai',
    short_description: 'Automated Legal Metrology packaging compliance and enforcement pipeline built for Smart India Hackathon (Ministry of Consumer Affairs).',
    full_description: 'LegalLens AI is an automated legal metrology audit pipeline built to inspect packaged commodity labels against the Legal Metrology (Packaged Commodities) Rules, 2011 (Rules 6 & 7).\n\nBuilt for Smart India Hackathon (Problem ID: SIH26034) under the Ministry of Consumer Affairs, Government of India.\n\nKey Capabilities:\n• Multilingual OCR & Vision: Uses EasyOCR/PaddleOCR and OpenCV preprocessing to detect, extract, and spatial-map mandatory declarations (MRP, Net Quantity, Dates, Customer Grievance channels).\n• Deterministic Validation: Zero-hallucination validation rule engine flagging non-standard unit syntax (e.g. prohibited "gms" vs standard "g") and non-compliant tax syntax.\n• Court-Admissible Notice Generation: Generates Form-1 Legal Show-Cause Notices (ReportLab PDF) embedded with SHA-256 cryptographic verification hashes in under 3 seconds.\n• Dual Ingestion: Designed for both mobile PWA offline warehouse inspection and automated catalog auditing for quick-commerce listings.',
    category: 'Computer Vision & Compliance',
    year: 2026,
    role: 'AI & Computer Vision Engineer',
    technologies: ['Python', 'TypeScript', 'OpenCV', 'EasyOCR', 'ReportLab', 'FastAPI', 'PWA'],
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    project_url: null,
    github_url: 'https://github.com/balkaransingh/LegalLens-AI',
    case_study_content: '# LegalLens AI: Automated Packaging Compliance & Enforcement System\n\nBuilt for **Smart India Hackathon (Problem ID: SIH26034)** for the **Ministry of Consumer Affairs**.\n\n### The Problem\nPackaged goods frequently violate Legal Metrology rules with non-standard units (e.g., prohibited "gms" instead of "g"), concealed manufacturing dates, or absent consumer grievance contacts. Manual inspection is slow and unscalable.\n\n### Technical Architecture\n- **Computer Vision Preprocessing**: OpenCV image normalization, contrast enhancement, and deskewing.\n- **Multilingual OCR Detection**: EasyOCR/PaddleOCR localized text extraction with bounding boxes.\n- **Deterministic Rule Engine**: Zero-hallucination syntax verification according to Rule 6 & 7 of the Legal Metrology Rules, 2011.\n- **Cryptographic Show-Cause Notice Generation**: Generates official Form-1 Legal Show-Cause Notices with SHA-256 tamper-proof verification hashes in under 3 seconds.',
    results: [
      'Smart India Hackathon (Problem ID: SIH26034) Ministry of Consumer Affairs implementation',
      'Court-admissible Form-1 Legal Show-Cause Notices generated in <3 seconds with SHA-256 cryptographic hashes',
      'Dual-ingestion pipeline: Offline mobile PWA for field officers + Automated catalog auditing for quick-commerce',
    ],
    featured: true,
    published: true,
    sort_order: 2,
    created_at: '2026-09-20T00:00:00.000Z',
    updated_at: '2026-09-30T12:00:00.000Z',
    project_images: [],
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'FitForge AI',
    slug: 'fitforge-ai',
    short_description: 'Full-stack AI-powered health and fitness platform delivering personalized workout regimes, dynamic nutrition plans, and conversational guidance.',
    full_description: 'FitForge AI is a full-stack, AI-powered health and fitness platform delivering personalized workout regimes and dynamic nutritional plans tailored to user goals and lifestyle metrics.\n\nKey Capabilities:\n• AI Conversational Assistant: Employs prompt engineering and API workflows to provide real-time exercise recommendations, form advice, and health guidance.\n• Robust Backend Architecture: Engineered with PHP and MySQL to manage user profiles, structured fitness logging, and asynchronous request handling.\n• Mobile-First Cross-Platform UI: Responsive design optimized for seamless usability across both Android devices and desktop web browsers.\n• Progress Analytics: Dashboards with automated metric calculations to drive user engagement and consistency.',
    category: 'HealthTech & AI',
    year: 2026,
    role: 'Full-Stack Developer',
    technologies: ['PHP', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'REST APIs', 'LLM Integration'],
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    project_url: null,
    github_url: 'https://github.com/balkaransingh/FitForge-AI',
    case_study_content: '# FitForge AI: AI-Powered Fitness & Wellness Platform\n\nPersonalized wellness training, nutritional intelligence, and fitness tracking powered by modern web technologies and LLMs.\n\n### Key Features\n- **Dynamic Routine Generation**: Personalized workout programs structured around user BMI, fitness goals, and equipment availability.\n- **AI Health Companion**: Instant answers to workout execution questions, form cues, and nutrition adjustments.\n- **Progress Metrics & Visualization**: Structured activity logging with body composition tracking over time.',
    results: [
      'Personalized workout regimes and dynamic nutritional plans tailored to user lifestyle metrics',
      'Real-time conversational assistant for form advice and exercise recommendations',
      'Responsive mobile-first layout optimized for cross-platform Android and desktop web browsers',
    ],
    featured: true,
    published: true,
    sort_order: 3,
    created_at: '2026-09-22T00:00:00.000Z',
    updated_at: '2026-09-30T12:00:00.000Z',
    project_images: [],
  },
];

async function ensureDataFile(): Promise<ProjectWithImages[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const content = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_PROJECTS, null, 2), 'utf-8');
      return INITIAL_PROJECTS;
    }
  } catch (error) {
    console.error('Error ensuring data file:', error);
    return INITIAL_PROJECTS;
  }
}

async function saveLocalProjects(projects: ProjectWithImages[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

export class ProjectDataStore {
  /**
   * Fetch all projects (including unpublished) sorted by sort_order
   */
  static async getAllProjects(): Promise<ProjectWithImages[]> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('projects')
          .select('*, project_images(*)')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data as ProjectWithImages[];
        }
      }
    } catch {
      // Fallback to local storage
    }

    const localProjects = await ensureDataFile();
    return localProjects.sort((a, b) => a.sort_order - b.sort_order);
  }

  /**
   * Fetch single project by ID
   */
  static async getProjectById(id: string): Promise<ProjectWithImages | null> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('projects')
          .select('*, project_images(*)')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          return data as ProjectWithImages;
        }
      }
    } catch {
      // Fallback
    }

    const projects = await ensureDataFile();
    return projects.find((p) => p.id === id) || null;
  }

  /**
   * Fetch single project by slug
   */
  static async getProjectBySlug(slug: string): Promise<ProjectWithImages | null> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('projects')
          .select('*, project_images(*)')
          .eq('slug', slug)
          .maybeSingle();

        if (!error && data) {
          return data as ProjectWithImages;
        }
      }
    } catch {
      // Fallback
    }

    const projects = await ensureDataFile();
    return projects.find((p) => p.slug === slug) || null;
  }

  /**
   * Create new project
   */
  static async createProject(payload: ProjectInsert & { project_images?: Array<{ image_url: string; caption?: string; sort_order?: number }> }): Promise<ProjectWithImages> {
    const imagesToInsert = payload.project_images || [];
    // Remove project_images from projects insert payload
    const { project_images: _, ...projectPayload } = payload;

    const newId = projectPayload.id || crypto.randomUUID();
    const now = new Date().toISOString();

    const createdProject: ProjectWithImages = {
      id: newId,
      title: projectPayload.title,
      slug: projectPayload.slug,
      short_description: projectPayload.short_description,
      full_description: projectPayload.full_description,
      category: projectPayload.category,
      year: projectPayload.year,
      role: projectPayload.role,
      technologies: projectPayload.technologies || [],
      thumbnail: projectPayload.thumbnail,
      project_url: projectPayload.project_url || null,
      github_url: projectPayload.github_url || null,
      case_study_content: projectPayload.case_study_content || null,
      results: projectPayload.results || [],
      featured: projectPayload.featured ?? false,
      published: projectPayload.published ?? true,
      sort_order: projectPayload.sort_order ?? 0,
      created_at: now,
      updated_at: now,
      project_images: imagesToInsert.map((img, idx) => ({
        id: crypto.randomUUID(),
        project_id: newId,
        image_url: img.image_url,
        caption: img.caption || null,
        sort_order: img.sort_order ?? idx + 1,
        created_at: now,
      })),
    };

    // Attempt Supabase insert
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        const { data, error } = await client
          .from('projects')
          .insert({
            ...projectPayload,
            id: newId,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();

        if (!error && data) {
          if (imagesToInsert.length > 0) {
            await client.from('project_images').insert(
              imagesToInsert.map((img, idx) => ({
                project_id: newId,
                image_url: img.image_url,
                caption: img.caption || null,
                sort_order: img.sort_order ?? idx + 1,
              }))
            );
          }
          return (await this.getProjectById(newId)) || createdProject;
        }
      }
    } catch {
      // Fallback
    }

    // Local persistent file fallback
    const projects = await ensureDataFile();
    projects.push(createdProject);
    await saveLocalProjects(projects);
    return createdProject;
  }

  /**
   * Update existing project
   */
  static async updateProject(id: string, payload: ProjectUpdate & { project_images?: Array<{ image_url: string; caption?: string; sort_order?: number }> }): Promise<ProjectWithImages> {
    const imagesToUpdate = payload.project_images;
    const { project_images: _, ...projectPayload } = payload;
    const now = new Date().toISOString();

    // Attempt Supabase update
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        const { error } = await client
          .from('projects')
          .update({
            ...projectPayload,
            updated_at: now,
          })
          .eq('id', id);

        if (!error) {
          if (imagesToUpdate) {
            await client.from('project_images').delete().eq('project_id', id);
            if (imagesToUpdate.length > 0) {
              await client.from('project_images').insert(
                imagesToUpdate.map((img, idx) => ({
                  project_id: id,
                  image_url: img.image_url,
                  caption: img.caption || null,
                  sort_order: img.sort_order ?? idx + 1,
                }))
              );
            }
          }
          const updated = await this.getProjectById(id);
          if (updated) return updated;
        }
      }
    } catch {
      // Fallback
    }

    // Local file update
    const projects = await ensureDataFile();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Project with ID "${id}" not found`);
    }

    const existing = projects[index];
    const updatedImages: ProjectImage[] = imagesToUpdate
      ? imagesToUpdate.map((img, idx) => ({
          id: crypto.randomUUID(),
          project_id: id,
          image_url: img.image_url,
          caption: img.caption || null,
          sort_order: img.sort_order ?? idx + 1,
          created_at: now,
        }))
      : existing.project_images || [];

    const updated: ProjectWithImages = {
      ...existing,
      ...projectPayload,
      updated_at: now,
      project_images: updatedImages,
    };

    projects[index] = updated;
    await saveLocalProjects(projects);
    return updated;
  }

  /**
   * Delete project
   */
  static async deleteProject(id: string): Promise<void> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        await supabase.from('project_images').delete().eq('project_id', id);
        await supabase.from('projects').delete().eq('id', id);
      }
    } catch {
      // Fallback
    }

    const projects = await ensureDataFile();
    const filtered = projects.filter((p) => p.id !== id);
    await saveLocalProjects(filtered);
  }

  /**
   * Duplicate project (creates clone with "(Copy)" title and unique slug)
   */
  static async duplicateProject(id: string): Promise<ProjectWithImages> {
    const original = await this.getProjectById(id);
    if (!original) {
      throw new Error(`Original project with ID "${id}" not found`);
    }

    const allProjects = await this.getAllProjects();
    const maxSort = allProjects.reduce((max, p) => Math.max(max, p.sort_order), 0);

    const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
    const newTitle = `${original.title} (Copy)`;

    return await this.createProject({
      title: newTitle,
      slug: newSlug,
      short_description: original.short_description,
      full_description: original.full_description,
      category: original.category,
      year: original.year,
      role: original.role,
      technologies: [...original.technologies],
      thumbnail: original.thumbnail,
      project_url: original.project_url,
      github_url: original.github_url,
      case_study_content: original.case_study_content,
      results: [...original.results],
      featured: false,
      published: false,
      sort_order: maxSort + 1,
      project_images: (original.project_images || []).map((img) => ({
        image_url: img.image_url,
        caption: img.caption || undefined,
        sort_order: img.sort_order,
      })),
    });
  }

  /**
   * Reorder projects
   */
  static async reorderProjects(orderedIds: string[]): Promise<void> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        for (let i = 0; i < orderedIds.length; i++) {
          await client.from('projects').update({ sort_order: i + 1 }).eq('id', orderedIds[i]);
        }
      }
    } catch {
      // Fallback
    }

    const projects = await ensureDataFile();
    const projectMap = new Map(projects.map((p) => [p.id, p]));

    orderedIds.forEach((id, index) => {
      const p = projectMap.get(id);
      if (p) {
        p.sort_order = index + 1;
        p.updated_at = new Date().toISOString();
      }
    });

    await saveLocalProjects(Array.from(projectMap.values()));
  }

  /**
   * Toggle published flag
   */
  static async togglePublished(id: string): Promise<boolean> {
    const project = await this.getProjectById(id);
    if (!project) throw new Error(`Project ${id} not found`);

    const newStatus = !project.published;
    await this.updateProject(id, { published: newStatus });
    return newStatus;
  }

  /**
   * Toggle featured flag
   */
  static async toggleFeatured(id: string): Promise<boolean> {
    const project = await this.getProjectById(id);
    if (!project) throw new Error(`Project ${id} not found`);

    const newStatus = !project.featured;
    await this.updateProject(id, { featured: newStatus });
    return newStatus;
  }
}
