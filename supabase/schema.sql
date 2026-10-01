-- ==============================================================================
-- SUPABASE SCHEMA: PREMIUM PERSONAL PORTFOLIO & CMS
-- ==============================================================================
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Helper Functions
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. Profile Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    full_name TEXT NOT NULL,
    headline TEXT NOT NULL,
    short_intro TEXT,
    bio TEXT NOT NULL,
    education_status TEXT,
    degree TEXT,
    specialization TEXT,
    avatar_url TEXT,
    location TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    resume_url TEXT,
    available_for_work BOOLEAN NOT NULL DEFAULT true,
    years_of_experience INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS short_intro TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS education_status TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS degree TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS github_url TEXT;

CREATE TRIGGER set_profile_updated_at
    BEFORE UPDATE ON public.profile
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 3. Projects Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    category TEXT NOT NULL,
    year INTEGER NOT NULL,
    role TEXT NOT NULL,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    thumbnail TEXT NOT NULL,
    project_url TEXT,
    github_url TEXT,
    case_study_content TEXT,
    results TEXT[] NOT NULL DEFAULT '{}',
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published_sort ON public.projects(published, sort_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured) WHERE featured = true;

CREATE TRIGGER set_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. Project Images Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id, sort_order ASC);

-- ------------------------------------------------------------------------------
-- 5. Experience Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    location TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    current_position BOOLEAN NOT NULL DEFAULT false,
    description TEXT NOT NULL,
    responsibilities TEXT[] NOT NULL DEFAULT '{}',
    achievements TEXT[] NOT NULL DEFAULT '{}',
    technologies TEXT[] NOT NULL DEFAULT '{}',
    company_logo TEXT,
    published BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    CONSTRAINT check_experience_dates CHECK (
        current_position = true OR end_date IS NOT NULL OR end_date >= start_date
    )
);

CREATE INDEX IF NOT EXISTS idx_experience_published_sort ON public.experience(published, sort_order ASC, start_date DESC);

CREATE TRIGGER set_experience_updated_at
    BEFORE UPDATE ON public.experience
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 5B. Education & Journey Table (for freshers, students, continuous learners)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education_journey (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    type TEXT NOT NULL DEFAULT 'Education', -- 'Education', 'Certification', 'Course', 'Achievement', 'Learning'
    institution TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN NOT NULL DEFAULT false,
    certificate_url TEXT,
    logo_url TEXT,
    skills_learned TEXT[] NOT NULL DEFAULT '{}',
    technologies TEXT[] NOT NULL DEFAULT '{}',
    sort_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

CREATE INDEX IF NOT EXISTS idx_education_journey_published_sort ON public.education_journey(published, sort_order ASC, start_date DESC);

CREATE TRIGGER set_education_journey_updated_at
    BEFORE UPDATE ON public.education_journey
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 6. Skills Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    proficiency INTEGER CHECK (proficiency >= 1 AND proficiency <= 100),
    icon TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

CREATE INDEX IF NOT EXISTS idx_skills_category_sort ON public.skills(category, sort_order ASC);

-- ------------------------------------------------------------------------------
-- 7. Services Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    features TEXT[] NOT NULL DEFAULT '{}',
    sort_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

CREATE INDEX IF NOT EXISTS idx_services_sort ON public.services(published, sort_order ASC);

-- ------------------------------------------------------------------------------
-- 8. Testimonials Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_title TEXT NOT NULL,
    company TEXT NOT NULL,
    quote TEXT NOT NULL,
    avatar_url TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

CREATE INDEX IF NOT EXISTS idx_testimonials_sort ON public.testimonials(published, sort_order ASC);

-- ------------------------------------------------------------------------------
-- 9. Social Links Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

CREATE INDEX IF NOT EXISTS idx_social_links_sort ON public.social_links(published, sort_order ASC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- 1. Profile Policies
CREATE POLICY "Allow public read access to profile"
    ON public.profile FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated full access to profile"
    ON public.profile FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 2. Projects Policies
CREATE POLICY "Allow public read access to published projects"
    ON public.projects FOR SELECT
    USING (published = true);

CREATE POLICY "Allow authenticated full access to projects"
    ON public.projects FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3. Project Images Policies
CREATE POLICY "Allow public read access to published project images"
    ON public.project_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_images.project_id
            AND projects.published = true
        )
    );

CREATE POLICY "Allow authenticated full access to project images"
    ON public.project_images FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Experience Policies
CREATE POLICY "Allow public read access to published experience"
    ON public.experience FOR SELECT
    USING (published = true);

CREATE POLICY "Allow authenticated full access to experience"
    ON public.experience FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4B. Education & Journey Policies
CREATE POLICY "Allow public read access to published education_journey"
    ON public.education_journey FOR SELECT
    USING (published = true);

CREATE POLICY "Allow authenticated full access to education_journey"
    ON public.education_journey FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Skills Policies
CREATE POLICY "Allow public read access to published skills"
    ON public.skills FOR SELECT
    USING (published = true);

CREATE POLICY "Allow authenticated full access to skills"
    ON public.skills FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. Services Policies
CREATE POLICY "Allow public read access to published services"
    ON public.services FOR SELECT
    USING (published = true);

CREATE POLICY "Allow authenticated full access to services"
    ON public.services FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. Testimonials Policies
CREATE POLICY "Allow public read access to published testimonials"
    ON public.testimonials FOR SELECT
    USING (published = true);

CREATE POLICY "Allow authenticated full access to testimonials"
    ON public.testimonials FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 8. Social Links Policies
CREATE POLICY "Allow public read access to published social links"
    ON public.social_links FOR SELECT
    USING (published = true);

CREATE POLICY "Allow authenticated full access to social links"
    ON public.social_links FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKETS & STORAGE POLICIES
-- ==============================================================================

-- Create Storage Buckets (if storage schema exists)
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('project-images', 'project-images', true),
    ('profile-images', 'profile-images', true),
    ('company-logos', 'company-logos', true),
    ('resume', 'resume', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies: Public Read Access
CREATE POLICY "Allow public select for portfolio buckets"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('project-images', 'profile-images', 'company-logos', 'resume'));

-- Storage RLS Policies: Authenticated Admin Insert/Update/Delete
CREATE POLICY "Allow authenticated upload for portfolio buckets"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id IN ('project-images', 'profile-images', 'company-logos', 'resume'));

CREATE POLICY "Allow authenticated update for portfolio buckets"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id IN ('project-images', 'profile-images', 'company-logos', 'resume'))
    WITH CHECK (bucket_id IN ('project-images', 'profile-images', 'company-logos', 'resume'));

CREATE POLICY "Allow authenticated delete for portfolio buckets"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id IN ('project-images', 'profile-images', 'company-logos', 'resume'));
