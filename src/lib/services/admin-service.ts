import { createServerSupabaseClient } from '@/lib/supabase/server';
import { EducationDataStore } from '@/lib/services/education-data-store';
import { ProjectDataStore } from '@/lib/services/project-data-store';
import { SkillsDataStore } from '@/lib/services/skills-data-store';
import {
  Project,
  ProjectInsert,
  ProjectUpdate,
  Experience,
  ExperienceInsert,
  ExperienceUpdate,
  AdminDashboardStats,
} from '@/types/portfolio';

export class AdminService {
  /**
   * Fetch aggregate counts for the Admin Dashboard overview
   */
  static async getDashboardStats(): Promise<AdminDashboardStats> {
    try {
      const allProjects = await ProjectDataStore.getAllProjects();
      const allEducation = await EducationDataStore.getAllEducation();
      const allSkills = await SkillsDataStore.getAllSkills();

      return {
        totalProjects: allProjects.length,
        publishedProjects: allProjects.filter((p) => p.published).length,
        totalEducation: allEducation.filter((e) => e.type === 'Education').length,
        totalCertifications: allEducation.filter((e) => e.type === 'Certification').length,
        totalSkills: allSkills.length,
        totalServices: 0,
        totalTestimonials: 0,
      };
    } catch {
      return {
        totalProjects: 0,
        publishedProjects: 0,
        totalEducation: 0,
        totalCertifications: 0,
        totalSkills: 0,
        totalServices: 0,
        totalTestimonials: 0,
      };
    }
  }

  /**
   * Fetch all projects (including unpublished) for admin table
   */
  static async getAdminProjects(): Promise<Project[]> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return (data as Project[]) ?? [];
  }

  /**
   * Create a new project in the CMS
   */
  static async createProject(payload: ProjectInsert): Promise<Project> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase
      .from('projects')
      // @ts-expect-error Supabase SSR generic inference helper
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Project;
  }

  /**
   * Update an existing project
   */
  static async updateProject(id: string, payload: ProjectUpdate): Promise<Project> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase
      .from('projects')
      // @ts-expect-error Supabase SSR generic inference helper
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Project;
  }

  /**
   * Delete a project
   */
  static async deleteProject(id: string): Promise<void> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  /**
   * Fetch all experiences (including unpublished) for admin
   */
  static async getAdminExperiences(): Promise<Experience[]> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return (data as Experience[]) ?? [];
  }

  /**
   * Create experience entry
   */
  static async createExperience(payload: ExperienceInsert): Promise<Experience> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase
      .from('experience')
      // @ts-expect-error Supabase SSR generic inference helper
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Experience;
  }

  /**
   * Update experience entry
   */
  static async updateExperience(id: string, payload: ExperienceUpdate): Promise<Experience> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase
      .from('experience')
      // @ts-expect-error Supabase SSR generic inference helper
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Experience;
  }

  /**
   * Delete experience entry
   */
  static async deleteExperience(id: string): Promise<void> {
    const supabase = await createServerSupabaseClient();
    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
