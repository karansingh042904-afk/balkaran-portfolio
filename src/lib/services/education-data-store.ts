import fs from 'fs/promises';
import path from 'path';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { EducationJourney, EducationJourneyInsert, EducationJourneyUpdate } from '@/types/portfolio';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'education.json');

export const INITIAL_EDUCATION: EducationJourney[] = [
  // Professional Certificates
  {
    id: 'cert-six-sigma-yellow-belt',
    type: 'Certification',
    institution: 'Six Sigma Study',
    title: 'Six Sigma Yellow Belt',
    description: 'Professional certification in quality management, operational efficiency, and Six Sigma methodology fundamentals.',
    start_date: '2024-01-01',
    end_date: null,
    current: false,
    certificate_url: null,
    logo_url: null,
    skills_learned: ['Process Improvement', 'Quality Management', 'Six Sigma Methodologies'],
    technologies: [],
    sort_order: 1,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cert-cisco-cybersecurity',
    type: 'Certification',
    institution: 'CISCO',
    title: 'Introduction to Cybersecurity',
    description: 'Foundational certification covering network security principles, threat analysis, data privacy, and defensive security measures.',
    start_date: '2024-01-01',
    end_date: null,
    current: false,
    certificate_url: null,
    logo_url: null,
    skills_learned: ['Cybersecurity Fundamentals', 'Network Security', 'Threat Intelligence', 'Data Protection'],
    technologies: [],
    sort_order: 2,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cert-cisco-data-science',
    type: 'Certification',
    institution: 'CISCO',
    title: 'Introduction to Data Science',
    description: 'Foundational certification covering data analytics pipelines, exploratory data analysis, and data-driven problem solving.',
    start_date: '2024-01-01',
    end_date: null,
    current: false,
    certificate_url: null,
    logo_url: null,
    skills_learned: ['Data Analysis', 'Exploratory Data Analysis', 'Data Workflows'],
    technologies: ['Python'],
    sort_order: 3,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Academic Qualifications
  {
    id: 'edu-adypu-btech',
    type: 'Education',
    institution: 'ADYPU',
    title: 'B.Tech in Computer Science & Information Technology',
    description: 'Bachelor of Technology in Computer Science & IT with Minor in Artificial Intelligence. Academic standing: 7.6 CGPA in 1st year.',
    start_date: '2025-08-01',
    end_date: null,
    current: true,
    certificate_url: null,
    logo_url: null,
    skills_learned: ['Computer Science', 'Information Technology', 'Artificial Intelligence', 'Data Structures & Algorithms', 'Web Engineering'],
    technologies: ['JavaScript', 'TypeScript', 'Python', 'React', 'Next.js', 'PostgreSQL'],
    sort_order: 4,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'edu-nios-senior-secondary',
    type: 'Education',
    institution: 'NIOS',
    title: 'Senior Secondary (Class XII)',
    description: 'Senior Secondary education completed in 2025 with 68%.',
    start_date: '2024-04-01',
    end_date: '2025-05-01',
    current: false,
    certificate_url: null,
    logo_url: null,
    skills_learned: ['Mathematics', 'Science', 'Computer Science'],
    technologies: [],
    sort_order: 5,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'edu-cbse-higher-secondary',
    type: 'Education',
    institution: 'CBSE',
    title: 'Higher Secondary (Class X)',
    description: 'Secondary education completed in 2022 with 81%.',
    start_date: '2021-04-01',
    end_date: '2022-05-01',
    current: false,
    certificate_url: null,
    logo_url: null,
    skills_learned: ['Foundational Science', 'Mathematics', 'English'],
    technologies: [],
    sort_order: 6,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

async function ensureDataFile(): Promise<EducationJourney[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const content = await fs.readFile(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_EDUCATION, null, 2), 'utf-8');
      return INITIAL_EDUCATION;
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_EDUCATION, null, 2), 'utf-8');
      return INITIAL_EDUCATION;
    }
  } catch (error) {
    console.error('Error ensuring education data file:', error);
    return INITIAL_EDUCATION;
  }
}

async function saveLocalEducation(educationList: EducationJourney[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(educationList, null, 2), 'utf-8');
}

export class EducationDataStore {
  /**
   * Fetch all education & journey entries sorted by sort_order
   */
  static async getAllEducation(): Promise<EducationJourney[]> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        const { data, error } = await client
          .from('education_journey')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && data) {
          return data as EducationJourney[];
        }
      }
    } catch {
      // Fallback to local storage
    }

    const localList = await ensureDataFile();
    return localList.sort((a, b) => a.sort_order - b.sort_order);
  }

  /**
   * Fetch single entry by ID
   */
  static async getEducationById(id: string): Promise<EducationJourney | null> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        const { data, error } = await client
          .from('education_journey')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          return data as EducationJourney;
        }
      }
    } catch {
      // Fallback
    }

    const list = await ensureDataFile();
    return list.find((item) => item.id === id) || null;
  }

  /**
   * Create new education / journey entry
   */
  static async createEducation(payload: EducationJourneyInsert): Promise<EducationJourney> {
    const newId = payload.id || crypto.randomUUID();
    const now = new Date().toISOString();

    const createdItem: EducationJourney = {
      id: newId,
      type: payload.type || 'Education',
      institution: payload.institution.trim(),
      title: payload.title.trim(),
      description: payload.description?.trim() || '',
      start_date: payload.start_date,
      end_date: payload.current ? null : payload.end_date || null,
      current: Boolean(payload.current),
      certificate_url: payload.certificate_url?.trim() || null,
      logo_url: payload.logo_url?.trim() || null,
      skills_learned: Array.isArray(payload.skills_learned) ? payload.skills_learned : [],
      technologies: Array.isArray(payload.technologies) ? payload.technologies : [],
      sort_order: typeof payload.sort_order === 'number' ? payload.sort_order : 0,
      published: payload.published !== undefined ? Boolean(payload.published) : true,
      created_at: now,
      updated_at: now,
    };

    // Attempt Supabase insert
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        const { data, error } = await client
          .from('education_journey')
          .insert(createdItem)
          .select()
          .single();

        if (!error && data) {
          return data as EducationJourney;
        }
      }
    } catch {
      // Fallback
    }

    // Local file fallback
    const list = await ensureDataFile();
    list.push(createdItem);
    await saveLocalEducation(list);
    return createdItem;
  }

  /**
   * Update existing entry
   */
  static async updateEducation(id: string, payload: EducationJourneyUpdate): Promise<EducationJourney> {
    const now = new Date().toISOString();

    const cleanPayload: Partial<EducationJourney> = {
      ...payload,
      updated_at: now,
    };
    if (cleanPayload.current) {
      cleanPayload.end_date = null;
    }

    // Attempt Supabase update
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        const { data, error } = await client
          .from('education_journey')
          .update(cleanPayload)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return data as EducationJourney;
        }
      }
    } catch {
      // Fallback
    }

    // Local file update
    const list = await ensureDataFile();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Education entry with ID "${id}" not found`);
    }

    const updated: EducationJourney = {
      ...list[index],
      ...cleanPayload,
      updated_at: now,
    };

    list[index] = updated;
    await saveLocalEducation(list);
    return updated;
  }

  /**
   * Delete entry
   */
  static async deleteEducation(id: string): Promise<void> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        await client.from('education_journey').delete().eq('id', id);
      }
    } catch {
      // Fallback
    }

    const list = await ensureDataFile();
    const filtered = list.filter((item) => item.id !== id);
    await saveLocalEducation(filtered);
  }

  /**
   * Reorder entries
   */
  static async reorderEducation(orderedIds: string[]): Promise<void> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        for (let i = 0; i < orderedIds.length; i++) {
          await client.from('education_journey').update({ sort_order: i + 1 }).eq('id', orderedIds[i]);
        }
      }
    } catch {
      // Fallback
    }

    const list = await ensureDataFile();
    const map = new Map(list.map((item) => [item.id, item]));

    orderedIds.forEach((id, index) => {
      const item = map.get(id);
      if (item) {
        item.sort_order = index + 1;
        item.updated_at = new Date().toISOString();
      }
    });

    await saveLocalEducation(Array.from(map.values()));
  }

  /**
   * Toggle published flag
   */
  static async togglePublished(id: string): Promise<boolean> {
    const item = await this.getEducationById(id);
    if (!item) throw new Error(`Education entry ${id} not found`);

    const newStatus = !item.published;
    await this.updateEducation(id, { published: newStatus });
    return newStatus;
  }
}
