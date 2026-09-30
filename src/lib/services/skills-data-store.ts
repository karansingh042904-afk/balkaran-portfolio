import fs from 'fs/promises';
import path from 'path';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Skill } from '@/types/portfolio';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'skills.json');

export const INITIAL_CV_SKILLS: Skill[] = [
  // Languages
  { id: 'sk-lang-1', name: 'JavaScript', category: 'Languages', proficiency: null, icon: 'FileCode', sort_order: 1, published: true, created_at: new Date().toISOString() },
  { id: 'sk-lang-2', name: 'TypeScript', category: 'Languages', proficiency: null, icon: 'FileCode2', sort_order: 2, published: true, created_at: new Date().toISOString() },
  { id: 'sk-lang-3', name: 'Python', category: 'Languages', proficiency: null, icon: 'Code', sort_order: 3, published: true, created_at: new Date().toISOString() },
  { id: 'sk-lang-4', name: 'HTML5', category: 'Languages', proficiency: null, icon: 'Code2', sort_order: 4, published: true, created_at: new Date().toISOString() },
  { id: 'sk-lang-5', name: 'CSS3', category: 'Languages', proficiency: null, icon: 'Palette', sort_order: 5, published: true, created_at: new Date().toISOString() },
  { id: 'sk-lang-6', name: 'Java', category: 'Languages', proficiency: null, icon: 'Coffee', sort_order: 6, published: true, created_at: new Date().toISOString() },
  { id: 'sk-lang-7', name: 'C', category: 'Languages', proficiency: null, icon: 'Terminal', sort_order: 7, published: true, created_at: new Date().toISOString() },
  { id: 'sk-lang-8', name: 'C++', category: 'Languages', proficiency: null, icon: 'Terminal', sort_order: 8, published: true, created_at: new Date().toISOString() },

  // Frontend
  { id: 'sk-fe-1', name: 'React', category: 'Frontend', proficiency: null, icon: 'Atom', sort_order: 9, published: true, created_at: new Date().toISOString() },
  { id: 'sk-fe-2', name: 'Next.js', category: 'Frontend', proficiency: null, icon: 'Globe', sort_order: 10, published: true, created_at: new Date().toISOString() },
  { id: 'sk-fe-3', name: 'Tailwind CSS', category: 'Frontend', proficiency: null, icon: 'Sparkles', sort_order: 11, published: true, created_at: new Date().toISOString() },

  // Backend & APIs
  { id: 'sk-be-1', name: 'Node.js', category: 'Backend & APIs', proficiency: null, icon: 'Server', sort_order: 12, published: true, created_at: new Date().toISOString() },
  { id: 'sk-be-2', name: 'Express.js', category: 'Backend & APIs', proficiency: null, icon: 'Cpu', sort_order: 13, published: true, created_at: new Date().toISOString() },
  { id: 'sk-be-3', name: 'APIs Integration & REST APIs', category: 'Backend & APIs', proficiency: null, icon: 'Network', sort_order: 14, published: true, created_at: new Date().toISOString() },

  // Databases
  { id: 'sk-db-1', name: 'MongoDB', category: 'Databases', proficiency: null, icon: 'Database', sort_order: 15, published: true, created_at: new Date().toISOString() },
  { id: 'sk-db-2', name: 'PostgreSQL', category: 'Databases', proficiency: null, icon: 'Database', sort_order: 16, published: true, created_at: new Date().toISOString() },
  { id: 'sk-db-3', name: 'MySQL', category: 'Databases', proficiency: null, icon: 'Database', sort_order: 17, published: true, created_at: new Date().toISOString() },

  // Tools & Platforms
  { id: 'sk-tool-1', name: 'Git', category: 'Tools & Platforms', proficiency: null, icon: 'GitBranch', sort_order: 18, published: true, created_at: new Date().toISOString() },
  { id: 'sk-tool-2', name: 'GitHub', category: 'Tools & Platforms', proficiency: null, icon: 'Github', sort_order: 19, published: true, created_at: new Date().toISOString() },
  { id: 'sk-tool-3', name: 'VS Code', category: 'Tools & Platforms', proficiency: null, icon: 'Code', sort_order: 20, published: true, created_at: new Date().toISOString() },
  { id: 'sk-tool-4', name: 'Antigravity IDE', category: 'Tools & Platforms', proficiency: null, icon: 'Box', sort_order: 21, published: true, created_at: new Date().toISOString() },

  // AI & Automation
  { id: 'sk-ai-1', name: 'AI Generalist (Workflow Automation)', category: 'AI & Automation', proficiency: null, icon: 'Workflow', sort_order: 22, published: true, created_at: new Date().toISOString() },
  { id: 'sk-ai-2', name: 'Model Evaluation', category: 'AI & Automation', proficiency: null, icon: 'Binary', sort_order: 23, published: true, created_at: new Date().toISOString() },
  { id: 'sk-ai-3', name: 'Prompt Engineering', category: 'AI & Automation', proficiency: null, icon: 'Sparkles', sort_order: 24, published: true, created_at: new Date().toISOString() },

  // Design & Multimedia
  { id: 'sk-des-1', name: 'UI/UX Design (Figma, User Research)', category: 'Design & Multimedia', proficiency: null, icon: 'Figma', sort_order: 25, published: true, created_at: new Date().toISOString() },
  { id: 'sk-des-2', name: 'Video Editing (Premiere Pro, CapCut, Clipchamp)', category: 'Design & Multimedia', proficiency: null, icon: 'Video', sort_order: 26, published: true, created_at: new Date().toISOString() },
  { id: 'sk-des-3', name: 'Graphic Design (Canva, InDesign, Photoshop)', category: 'Design & Multimedia', proficiency: null, icon: 'Image', sort_order: 27, published: true, created_at: new Date().toISOString() },

  // Professional Skills
  { id: 'sk-prof-1', name: 'Full Stack Web Development', category: 'Professional Skills', proficiency: null, icon: 'Layers', sort_order: 28, published: true, created_at: new Date().toISOString() },
  { id: 'sk-prof-2', name: 'Technical Writing & E-Book Publishing', category: 'Professional Skills', proficiency: null, icon: 'BookOpen', sort_order: 29, published: true, created_at: new Date().toISOString() },
  { id: 'sk-prof-3', name: 'Copywriting & Copy Editing', category: 'Professional Skills', proficiency: null, icon: 'FileText', sort_order: 30, published: true, created_at: new Date().toISOString() },

  // Productivity
  { id: 'sk-off-1', name: 'MS Office Suite (Word, Excel, PowerPoint)', category: 'Productivity', proficiency: null, icon: 'Briefcase', sort_order: 31, published: true, created_at: new Date().toISOString() },
  { id: 'sk-off-2', name: '48 WPM Typing Speed', category: 'Productivity', proficiency: null, icon: 'Keyboard', sort_order: 32, published: true, created_at: new Date().toISOString() },

  // Linguistic Skills
  { id: 'sk-ling-1', name: 'English (Spoken & Written)', category: 'Linguistic Skills', proficiency: null, icon: 'Languages', sort_order: 33, published: true, created_at: new Date().toISOString() },
  { id: 'sk-ling-2', name: 'Hindi (Spoken & Written)', category: 'Linguistic Skills', proficiency: null, icon: 'Languages', sort_order: 34, published: true, created_at: new Date().toISOString() },
  { id: 'sk-ling-3', name: 'Maithili (Native)', category: 'Linguistic Skills', proficiency: null, icon: 'Languages', sort_order: 35, published: true, created_at: new Date().toISOString() },
];

async function ensureDataFile(): Promise<Skill[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const content = await fs.readFile(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_CV_SKILLS, null, 2), 'utf-8');
      return INITIAL_CV_SKILLS;
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_CV_SKILLS, null, 2), 'utf-8');
      return INITIAL_CV_SKILLS;
    }
  } catch (error) {
    console.error('Error ensuring skills data file:', error);
    return INITIAL_CV_SKILLS;
  }
}

async function saveLocalSkills(skills: Skill[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(skills, null, 2), 'utf-8');
}

export class SkillsDataStore {
  /**
   * Fetch all skills ordered by sort_order
   */
  static async getAllSkills(): Promise<Skill[]> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        const { data, error } = await client
          .from('skills')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data as Skill[];
        }
      }
    } catch {
      // Fallback
    }

    const localList = await ensureDataFile();
    return localList.sort((a, b) => a.sort_order - b.sort_order);
  }

  /**
   * Fetch single skill by ID
   */
  static async getSkillById(id: string): Promise<Skill | null> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        const { data, error } = await client
          .from('skills')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          return data as Skill;
        }
      }
    } catch {
      // Fallback
    }

    const list = await ensureDataFile();
    return list.find((item) => item.id === id) || null;
  }

  /**
   * Create new skill
   */
  static async createSkill(payload: {
    name: string;
    category: string;
    proficiency?: number | null;
    icon?: string | null;
    sort_order?: number;
    published?: boolean;
  }): Promise<Skill> {
    const newId = crypto.randomUUID();
    const now = new Date().toISOString();

    const createdItem: Skill = {
      id: newId,
      name: payload.name.trim(),
      category: payload.category.trim(),
      proficiency: typeof payload.proficiency === 'number' ? payload.proficiency : null,
      icon: payload.icon?.trim() || null,
      sort_order: typeof payload.sort_order === 'number' ? payload.sort_order : 0,
      published: payload.published !== undefined ? Boolean(payload.published) : true,
      created_at: now,
    };

    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        const { data, error } = await client
          .from('skills')
          .insert(createdItem)
          .select()
          .single();

        if (!error && data) {
          return data as Skill;
        }
      }
    } catch {
      // Fallback
    }

    const list = await ensureDataFile();
    list.push(createdItem);
    await saveLocalSkills(list);
    return createdItem;
  }

  /**
   * Update existing skill
   */
  static async updateSkill(
    id: string,
    payload: {
      name?: string;
      category?: string;
      proficiency?: number | null;
      icon?: string | null;
      sort_order?: number;
      published?: boolean;
    }
  ): Promise<Skill> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        const { data, error } = await client
          .from('skills')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return data as Skill;
        }
      }
    } catch {
      // Fallback
    }

    const list = await ensureDataFile();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Skill with ID "${id}" not found`);
    }

    const updated: Skill = {
      ...list[index],
      ...payload,
    };

    list[index] = updated;
    await saveLocalSkills(list);
    return updated;
  }

  /**
   * Delete skill
   */
  static async deleteSkill(id: string): Promise<void> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        await client.from('skills').delete().eq('id', id);
      }
    } catch {
      // Fallback
    }

    const list = await ensureDataFile();
    const filtered = list.filter((item) => item.id !== id);
    await saveLocalSkills(filtered);
  }

  /**
   * Reorder skills
   */
  static async reorderSkills(orderedIds: string[]): Promise<void> {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const client = supabase as any;
        for (let i = 0; i < orderedIds.length; i++) {
          await client.from('skills').update({ sort_order: i + 1 }).eq('id', orderedIds[i]);
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
      }
    });

    await saveLocalSkills(Array.from(map.values()));
  }

  /**
   * Toggle published flag
   */
  static async togglePublished(id: string): Promise<boolean> {
    const item = await this.getSkillById(id);
    if (!item) throw new Error(`Skill ${id} not found`);

    const newStatus = !item.published;
    await this.updateSkill(id, { published: newStatus });
    return newStatus;
  }
}
