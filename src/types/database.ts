export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string;
          full_name: string;
          headline: string;
          bio: string;
          avatar_url: string | null;
          location: string | null;
          email: string;
          phone: string | null;
          resume_url: string | null;
          short_intro: string | null;
          education_status: string | null;
          degree: string | null;
          specialization: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          available_for_work: boolean;
          years_of_experience: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          headline: string;
          bio: string;
          short_intro?: string | null;
          education_status?: string | null;
          degree?: string | null;
          specialization?: string | null;
          avatar_url?: string | null;
          location?: string | null;
          email: string;
          phone?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          resume_url?: string | null;
          available_for_work?: boolean;
          years_of_experience?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          headline?: string;
          bio?: string;
          short_intro?: string | null;
          education_status?: string | null;
          degree?: string | null;
          specialization?: string | null;
          avatar_url?: string | null;
          location?: string | null;
          email?: string;
          phone?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          resume_url?: string | null;
          available_for_work?: boolean;
          years_of_experience?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string;
          full_description: string;
          category: string;
          year: number;
          role: string;
          technologies: string[];
          thumbnail: string;
          project_url: string | null;
          github_url: string | null;
          case_study_content: string | null;
          results: string[];
          featured: boolean;
          published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description: string;
          full_description: string;
          category: string;
          year: number;
          role: string;
          technologies?: string[];
          thumbnail: string;
          project_url?: string | null;
          github_url?: string | null;
          case_study_content?: string | null;
          results?: string[];
          featured?: boolean;
          published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          short_description?: string;
          full_description?: string;
          category?: string;
          year?: number;
          role?: string;
          technologies?: string[];
          thumbnail?: string;
          project_url?: string | null;
          github_url?: string | null;
          case_study_content?: string | null;
          results?: string[];
          featured?: boolean;
          published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      project_images: {
        Row: {
          id: string;
          project_id: string;
          image_url: string;
          caption: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          image_url: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          image_url?: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      experience: {
        Row: {
          id: string;
          company: string;
          position: string;
          location: string | null;
          start_date: string;
          end_date: string | null;
          current_position: boolean;
          description: string;
          responsibilities: string[];
          achievements: string[];
          technologies: string[];
          company_logo: string | null;
          published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          position: string;
          location?: string | null;
          start_date: string;
          end_date?: string | null;
          current_position?: boolean;
          description: string;
          responsibilities?: string[];
          achievements?: string[];
          technologies?: string[];
          company_logo?: string | null;
          published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company?: string;
          position?: string;
          location?: string | null;
          start_date?: string;
          end_date?: string | null;
          current_position?: boolean;
          description?: string;
          responsibilities?: string[];
          achievements?: string[];
          technologies?: string[];
          company_logo?: string | null;
          published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      education_journey: {
        Row: {
          id: string;
          type: 'Education' | 'Certification' | 'Course' | 'Achievement' | 'Learning';
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
        };
        Insert: {
          id?: string;
          type?: 'Education' | 'Certification' | 'Course' | 'Achievement' | 'Learning';
          institution: string;
          title: string;
          description?: string;
          start_date: string;
          end_date?: string | null;
          current?: boolean;
          certificate_url?: string | null;
          logo_url?: string | null;
          skills_learned?: string[];
          technologies?: string[];
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: 'Education' | 'Certification' | 'Course' | 'Achievement' | 'Learning';
          institution?: string;
          title?: string;
          description?: string;
          start_date?: string;
          end_date?: string | null;
          current?: boolean;
          certificate_url?: string | null;
          logo_url?: string | null;
          skills_learned?: string[];
          technologies?: string[];
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          proficiency: number | null;
          icon: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          proficiency?: number | null;
          icon?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          proficiency?: number | null;
          icon?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          icon: string | null;
          features: string[];
          sort_order: number;
          published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          icon?: string | null;
          features?: string[];
          sort_order?: number;
          published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          icon?: string | null;
          features?: string[];
          sort_order?: number;
          published?: boolean;
          created_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          client_title: string;
          company: string;
          quote: string;
          avatar_url: string | null;
          project_id: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          client_title: string;
          company: string;
          quote: string;
          avatar_url?: string | null;
          project_id?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          client_title?: string;
          company?: string;
          quote?: string;
          avatar_url?: string | null;
          project_id?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
        };
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          label: string;
          url: string;
          icon: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          label: string;
          url: string;
          icon?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          platform?: string;
          label?: string;
          url?: string;
          icon?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
