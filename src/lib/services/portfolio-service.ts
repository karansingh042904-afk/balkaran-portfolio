import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProjectDataStore } from '@/lib/services/project-data-store';
import { ProfileDataStore } from '@/lib/services/profile-data-store';
import { SkillsDataStore } from '@/lib/services/skills-data-store';
import {
  Profile,
  ProjectWithImages,
  Experience,
  Skill,
  Service,
  Testimonial,
  SocialLink,
  EducationJourney,
  PortfolioData,
} from '@/types/portfolio';

// Fallback seed data for development preview when database is not connected
const FALLBACK_PROFILE: Profile = {
  id: 'fallback-profile',
  full_name: 'Balkaran Singh',
  headline: 'Aspiring Software Engineer | B.Tech in CS & IT with Minor in AI',
  short_intro: 'Passionate, forward-thinking fresher driven to solve complex challenges, optimize processes, and deliver impactful, scalable software solutions.',
  bio: 'Detail-oriented and adaptable B.Tech Computer Science & Information Technology student at Ajeenkya DY Patil University with a minor in Artificial Intelligence. Passionate about software development, scalable web architectures, machine learning workflows, and data-driven problem solving. Equipped with strong technical grounding in Java, Python, JavaScript/TypeScript, SQL, and modern frameworks, paired with disciplined analytical skills.',
  education_status: 'Pursuing B.Tech',
  degree: 'B.Tech in Computer Science & Information Technology',
  specialization: 'Minor in Artificial Intelligence',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  location: 'Pune, Maharashtra / Delhi, India',
  email: 'karansingh042906@gmail.com',
  phone: '',
  resume_url: '',
  linkedin_url: 'https://linkedin.com/in/balkaran-singh',
  github_url: 'https://github.com/balkaransingh',
  available_for_work: true,
  years_of_experience: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const FALLBACK_PROJECTS: ProjectWithImages[] = [
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
        image_url: 'https://bmxovhmzczfkgadmplne.supabase.co/storage/v1/object/public/project-images/1789813797363-g3h715.png',
        caption: 'Juro-AI Legal Studio Dashboard',
        sort_order: 1,
        created_at: '2026-09-19T10:33:34.059Z',
      },
      {
        id: '11295b05-9603-4a17-aa6a-98ba351287b1',
        project_id: 'da09eb29-4922-42f0-97c0-93ccd06c5687',
        image_url: 'https://bmxovhmzczfkgadmplne.supabase.co/storage/v1/object/public/project-images/1789813805539-757o9q.png',
        caption: 'Contextual Legal Assistant & Risk Analyzer',
        sort_order: 2,
        created_at: '2026-09-19T10:33:34.059Z',
      },
      {
        id: '28593ef8-775d-4dc8-b637-e3a2dadea0f5',
        project_id: 'da09eb29-4922-42f0-97c0-93ccd06c5687',
        image_url: 'https://bmxovhmzczfkgadmplne.supabase.co/storage/v1/object/public/project-images/1789813880890-jwn1wy.png',
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
import { EducationDataStore } from '@/lib/services/education-data-store';

const FALLBACK_EXPERIENCES: Experience[] = [];

const FALLBACK_SKILLS: Skill[] = [
  { id: 'sk-1', name: 'Next.js', category: 'Frontend', proficiency: 98, icon: 'Globe', sort_order: 1, published: true, created_at: new Date().toISOString() },
  { id: 'sk-2', name: 'React 19', category: 'Frontend', proficiency: 96, icon: 'Atom', sort_order: 2, published: true, created_at: new Date().toISOString() },
  { id: 'sk-3', name: 'TypeScript', category: 'Frontend', proficiency: 95, icon: 'Code2', sort_order: 3, published: true, created_at: new Date().toISOString() },
  { id: 'sk-4', name: 'Tailwind CSS', category: 'Frontend', proficiency: 98, icon: 'Palette', sort_order: 4, published: true, created_at: new Date().toISOString() },
  { id: 'sk-5', name: 'Three.js / R3F', category: 'Creative Tech', proficiency: 90, icon: 'Box', sort_order: 5, published: true, created_at: new Date().toISOString() },
  { id: 'sk-6', name: 'Framer Motion', category: 'Creative Tech', proficiency: 94, icon: 'Sparkles', sort_order: 6, published: true, created_at: new Date().toISOString() },
  { id: 'sk-7', name: 'Supabase / Postgres', category: 'Backend', proficiency: 92, icon: 'Database', sort_order: 7, published: true, created_at: new Date().toISOString() },
  { id: 'sk-8', name: 'Architecture & System Design', category: 'Leadership', proficiency: 92, icon: 'Cpu', sort_order: 8, published: true, created_at: new Date().toISOString() },
];

const FALLBACK_SERVICES: Service[] = [
  {
    id: 'srv-1',
    title: 'Full-Stack Web Architecture',
    slug: 'full-stack-web-architecture',
    description: 'End-to-end architecture and implementation of scalable web platforms using Next.js, TypeScript, and Supabase.',
    icon: 'Layers',
    features: ['SSR & SSG Optimization', 'Type-safe API and Database Design', 'State Management & Caching', 'Authentication & Role-Based Access'],
    sort_order: 1,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'srv-2',
    title: 'Creative 3D & Interactive Experiences',
    slug: 'creative-3d-interactive-experiences',
    description: 'Immersive WebGL and Three.js environments that elevate your brand and create unforgettable user journeys.',
    icon: 'Sparkles',
    features: ['Custom WebGL / Three.js Shaders', 'Micro-interactions & Framer Motion', 'Physics & Spatial Audio', 'High-Performance 60 FPS mobile tuning'],
    sort_order: 2,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'srv-3',
    title: 'Design Systems & UI Engineering',
    slug: 'design-systems-ui-engineering',
    description: 'Building resilient, accessible, and themeable component libraries that accelerate development speed.',
    icon: 'Palette',
    features: ['Accessible Headless Primitives', 'Tailwind CSS Custom Design Tokens', 'Cross-browser & Device Optimization', 'Comprehensive Documentation'],
    sort_order: 3,
    published: true,
    created_at: new Date().toISOString(),
  },
];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    client_name: 'Elena Rostova',
    client_title: 'VP of Product',
    company: 'Apex Horizon',
    quote: 'Balkaran possesses that rare combination of elite aesthetic taste and rock-solid architectural rigor. The 3D telemetry dashboard he engineered transformed how our clients interact with our product.',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    project_id: '11111111-1111-1111-1111-111111111111',
    sort_order: 1,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 't-2',
    client_name: 'Marcus Vance',
    client_title: 'Co-Founder & CEO',
    company: 'Verve Spatial',
    quote: 'Working with Balkaran felt like adding an entire engineering team. His deep mastery of React Three Fiber, Next.js, and clean database design ensured our launch exceeded every metric.',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    project_id: '22222222-2222-2222-2222-222222222222',
    sort_order: 2,
    published: true,
    created_at: new Date().toISOString(),
  },
];

const FALLBACK_SOCIAL_LINKS: SocialLink[] = [
  { id: 'soc-1', platform: 'GitHub', label: 'github.com/balkaran', url: 'https://github.com', icon: 'Github', sort_order: 1, published: true, created_at: new Date().toISOString() },
  { id: 'soc-2', platform: 'LinkedIn', label: 'linkedin.com/in/balkaran', url: 'https://linkedin.com', icon: 'Linkedin', sort_order: 2, published: true, created_at: new Date().toISOString() },
  { id: 'soc-3', platform: 'Twitter/X', label: 'x.com/balkaran', url: 'https://twitter.com', icon: 'Twitter', sort_order: 3, published: true, created_at: new Date().toISOString() },
  { id: 'soc-4', platform: 'Email', label: 'balkaran@example.com', url: 'mailto:balkaran@example.com', icon: 'Mail', sort_order: 4, published: true, created_at: new Date().toISOString() },
];

export class PortfolioService {
  /**
   * Fetch site owner profile information
   */
  static async getProfile(): Promise<Profile | null> {
    try {
      return await ProfileDataStore.getProfile();
    } catch {
      return FALLBACK_PROFILE;
    }
  }

  /**
   * Fetch featured published projects with their gallery images
   */
  static async getFeaturedProjects(): Promise<ProjectWithImages[]> {
    try {
      const allProjects = await ProjectDataStore.getAllProjects();
      const featured = allProjects.filter((p) => p.published && p.featured);
      return featured;
    } catch {
      return FALLBACK_PROJECTS.filter((p) => p.featured);
    }
  }

  /**
   * Fetch all published projects
   */
  static async getAllProjects(): Promise<ProjectWithImages[]> {
    try {
      const allProjects = await ProjectDataStore.getAllProjects();
      const published = allProjects.filter((p) => p.published);
      return published;
    } catch {
      return FALLBACK_PROJECTS;
    }
  }

  /**
   * Fetch a single published project by slug
   */
  static async getProjectBySlug(slug: string): Promise<ProjectWithImages | null> {
    try {
      const project = await ProjectDataStore.getProjectBySlug(slug);
      if (!project || !project.published) return null;
      return project;
    } catch {
      return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
    }
  }

  /**
   * Fetch all published work experiences
   * User is a fresher with no corporate work experience - returns empty array
   */
  static async getExperiences(): Promise<Experience[]> {
    return [];
  }

  /**
   * Fetch all published education & journey entries
   */
  static async getEducationJourney(): Promise<EducationJourney[]> {
    try {
      const allEducation = await EducationDataStore.getAllEducation();
      return allEducation.filter((item) => item.published);
    } catch {
      return [];
    }
  }

  /**
   * Fetch all published skills
   */
  static async getSkills(): Promise<Skill[]> {
    try {
      const skills = await SkillsDataStore.getAllSkills();
      return skills.filter((s) => s.published);
    } catch {
      return [];
    }
  }

  /**
   * Fetch all published certifications from education_journey
   */
  static async getCertifications(): Promise<EducationJourney[]> {
    try {
      const allEducation = await EducationDataStore.getAllEducation();
      return allEducation.filter((item) => item.published && item.type === 'Certification');
    } catch {
      return [];
    }
  }

  /**
   * Fetch all published services
   */
  static async getServices(): Promise<Service[]> {
    try {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return FALLBACK_SERVICES;

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return FALLBACK_SERVICES;
      }
      return data;
    } catch {
      return FALLBACK_SERVICES;
    }
  }

  /**
   * Fetch all published testimonials
   */
  static async getTestimonials(): Promise<Testimonial[]> {
    try {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return FALLBACK_TESTIMONIALS;

      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return FALLBACK_TESTIMONIALS;
      }
      return data;
    } catch {
      return FALLBACK_TESTIMONIALS;
    }
  }

  /**
   * Fetch all published social links
   */
  static async getSocialLinks(): Promise<SocialLink[]> {
    try {
      const supabase = await createServerSupabaseClient();
      if (!supabase) return FALLBACK_SOCIAL_LINKS;

      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return FALLBACK_SOCIAL_LINKS;
      }
      return data;
    } catch {
      return FALLBACK_SOCIAL_LINKS;
    }
  }

  /**
   * Aggregate all portfolio data in parallel for the landing page
   */
  static async getPortfolioData(): Promise<PortfolioData> {
    const [
      profile,
      featuredProjects,
      allProjects,
      experiences,
      educationJourney,
      certifications,
      skills,
      services,
      testimonials,
      socialLinks,
    ] = await Promise.all([
      this.getProfile(),
      this.getFeaturedProjects(),
      this.getAllProjects(),
      this.getExperiences(),
      this.getEducationJourney(),
      this.getCertifications(),
      this.getSkills(),
      this.getServices(),
      this.getTestimonials(),
      this.getSocialLinks(),
    ]);

    return {
      profile,
      featuredProjects,
      allProjects,
      experiences,
      educationJourney,
      certifications,
      skills,
      services,
      testimonials,
      socialLinks,
    };
  }
}
