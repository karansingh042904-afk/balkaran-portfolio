import { Database } from './database';

export type Profile = Database['public']['Tables']['profile']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type ProjectImage = Database['public']['Tables']['project_images']['Row'];
export type ProjectWithImages = Project & {
  project_images?: ProjectImage[];
};

export type Experience = Database['public']['Tables']['experience']['Row'];
export type ExperienceInsert = Database['public']['Tables']['experience']['Insert'];
export type ExperienceUpdate = Database['public']['Tables']['experience']['Update'];

// Education & Journey Types
export type EducationJourneyType = 'Education' | 'Certification' | 'Course' | 'Achievement' | 'Learning';

export interface EducationJourney {
  id: string;
  type: EducationJourneyType;
  institution: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  certificate_url: string | null;
  logo_url: string | null;
  skills_learned: string[];
  technologies: string[];
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type EducationJourneyInsert = Omit<EducationJourney, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type EducationJourneyUpdate = Partial<EducationJourneyInsert>;

export type Skill = Database['public']['Tables']['skills']['Row'];
export type SkillCategory = 'Frontend' | 'Backend' | 'Creative Tech' | 'DevOps' | 'Leadership' | string;

export type Service = Database['public']['Tables']['services']['Row'];
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type SocialLink = Database['public']['Tables']['social_links']['Row'];

// Portfolio Aggregated Data Container
export interface PortfolioData {
  profile: Profile | null;
  featuredProjects: ProjectWithImages[];
  allProjects: ProjectWithImages[];
  experiences: Experience[];
  educationJourney: EducationJourney[];
  certifications: EducationJourney[];
  skills: Skill[];
  services: Service[];
  testimonials: Testimonial[];
  socialLinks: SocialLink[];
}

// Admin CMS Statistics
export interface AdminDashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalEducation: number;
  totalCertifications: number;
  totalSkills: number;
  totalServices: number;
  totalTestimonials: number;
}
