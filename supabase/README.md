# Supabase Portfolio CMS Setup Guide

This directory contains the database schema, security policies, storage configuration, and seed data for the portfolio CMS.

---

## Quick Setup Steps

### 1. Execute the Database Schema
1. Open your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** in the left sidebar.
3. Click **New query**.
4. Copy the entire contents of [`schema.sql`](./schema.sql) and paste it into the editor.
5. Click **Run** (or `Cmd + Enter` / `Ctrl + Enter`).
6. *Result:* All tables (`profile`, `projects`, `project_images`, `experience`, `skills`, `services`, `testimonials`, `social_links`), RLS policies, indexes, and storage buckets (`project-images`, `profile-images`, `company-logos`, `resume`) will be created!

### 2. Populate Seed Data (Optional but Recommended)
1. Open a new query in the **SQL Editor**.
2. Copy and paste [`seed.sql`](./seed.sql).
3. Click **Run**.
4. *Result:* Realistic sample projects, work experiences, skills, services, and testimonials will populate your tables immediately.

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` in your root folder:
```bash
cp .env.example .env.local
```
Update with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # For administrative scripts
```

---

## Security & Row Level Security (RLS) Details

| Table | Public Visitors (Unauthenticated) | Authenticated Admin |
| :--- | :--- | :--- |
| `profile` | Read-only (`SELECT`) | Full CRUD (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) |
| `projects` | Read-only where `published = true` | Full CRUD |
| `project_images` | Read-only where parent project is published | Full CRUD |
| `experience` | Read-only where `published = true` | Full CRUD |
| `skills` | Read-only where `published = true` | Full CRUD |
| `services` | Read-only where `published = true` | Full CRUD |
| `testimonials` | Read-only where `published = true` | Full CRUD |
| `social_links` | Read-only where `published = true` | Full CRUD |
| Storage Buckets | Read-only (`SELECT`) | Upload, Update, Delete (`INSERT`, `UPDATE`, `DELETE`) |

---

## Storage Buckets Created
- `project-images`: High-resolution thumbnails, screenshots, and diagrams.
- `profile-images`: Profile avatars and biography photos.
- `company-logos`: Logos for work experience items.
- `resume`: PDF downloadable resume.
