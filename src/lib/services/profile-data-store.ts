import fs from 'fs/promises';
import path from 'path';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Profile } from '@/types/portfolio';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'profile.json');

export const INITIAL_CV_PROFILE: Profile = {
  id: 'profile-balkaran-singh',
  full_name: 'Balkaran Singh',
  headline: 'Full Stack Web Developer | AI & Automation Enthusiast',
  short_intro: 'To secure a responsible career opportunity to develop and acquire Professional skills and knowledge and fully utilize my training and skills, while making a significant contribution to the success of the company.',
  bio: 'Computer Science & Information Technology undergraduate at ADYPU with a minor in Artificial Intelligence. Passionate full-stack developer experienced in building AI-powered web applications, automated compliance workflows, and responsive web platforms using React, Next.js, TypeScript, and modern APIs. Focused on building practical, scalable software solutions with clean architecture.',
  education_status: 'Pursuing B.Tech (2025–Present, 7.6 CGPA in 1st year)',
  degree: 'B.Tech in Computer Science & Information Technology',
  specialization: 'Minor in Artificial Intelligence',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  location: 'India (Open to Remote & Relocation)',
  email: 'karansingh042906@gmail.com',
  phone: null,
  linkedin_url: 'https://linkedin.com',
  github_url: 'https://github.com',
  resume_url: null,
  available_for_work: true,
  years_of_experience: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

async function ensureDataFile(): Promise<Profile> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const content = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_CV_PROFILE, null, 2), 'utf-8');
      return INITIAL_CV_PROFILE;
    }
  } catch (error) {
    console.error('Error ensuring profile data file:', error);
    return INITIAL_CV_PROFILE;
  }
}

async function saveLocalProfile(profile: Profile): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(profile, null, 2), 'utf-8');
}

export class ProfileDataStore {
  /**
   * Fetch current profile from Supabase with local fallback
   */
  static async getProfile(): Promise<Profile> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        const { data, error } = await client
          .from('profile')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return {
            ...INITIAL_CV_PROFILE,
            ...data,
          } as Profile;
        }
      }
    } catch {
      // Fallback to local file
    }

    return await ensureDataFile();
  }

  /**
   * Update profile
   */
  static async updateProfile(payload: Partial<Profile>): Promise<Profile> {
    const current = await this.getProfile();
    const now = new Date().toISOString();

    const updated: Profile = {
      ...current,
      ...payload,
      full_name: payload.full_name?.trim() || current.full_name,
      headline: payload.headline?.trim() || current.headline,
      email: payload.email?.trim() || current.email,
      bio: payload.bio?.trim() || current.bio,
      short_intro: payload.short_intro !== undefined ? payload.short_intro?.trim() || null : current.short_intro,
      education_status: payload.education_status !== undefined ? payload.education_status?.trim() || null : current.education_status,
      degree: payload.degree !== undefined ? payload.degree?.trim() || null : current.degree,
      specialization: payload.specialization !== undefined ? payload.specialization?.trim() || null : current.specialization,
      location: payload.location !== undefined ? payload.location?.trim() || null : current.location,
      phone: payload.phone !== undefined ? payload.phone?.trim() || null : current.phone,
      linkedin_url: payload.linkedin_url !== undefined ? payload.linkedin_url?.trim() || null : current.linkedin_url,
      github_url: payload.github_url !== undefined ? payload.github_url?.trim() || null : current.github_url,
      resume_url: payload.resume_url !== undefined ? payload.resume_url?.trim() || null : current.resume_url,
      avatar_url: payload.avatar_url !== undefined ? payload.avatar_url?.trim() || null : current.avatar_url,
      available_for_work: payload.available_for_work !== undefined ? Boolean(payload.available_for_work) : current.available_for_work,
      years_of_experience: typeof payload.years_of_experience === 'number' ? payload.years_of_experience : 0,
      updated_at: now,
    };

    // Attempt Supabase update / upsert
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        const { data: existing } = await client.from('profile').select('id').limit(1).maybeSingle();

        if (existing?.id) {
          const { data, error } = await client
            .from('profile')
            .update(updated)
            .eq('id', existing.id)
            .select()
            .single();

          if (!error && data) {
            await saveLocalProfile(data as Profile);
            return data as Profile;
          }
        } else {
          const { data, error } = await client
            .from('profile')
            .insert(updated)
            .select()
            .single();

          if (!error && data) {
            await saveLocalProfile(data as Profile);
            return data as Profile;
          }
        }
      }
    } catch {
      // Fallback
    }

    await saveLocalProfile(updated);
    return updated;
  }
}
