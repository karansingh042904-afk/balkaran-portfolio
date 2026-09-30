import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PortfolioService } from '@/lib/services/portfolio-service';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, ExternalLink, CheckCircle2, Calendar, UserCheck } from 'lucide-react';
import { GithubIcon } from '@/components/icons/BrandIcons';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await PortfolioService.getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function SingleProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await PortfolioService.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="pt-32 pb-24 relative">
      <Container size="default">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Project Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="accent">{project.category}</Badge>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {project.year}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
            {project.short_description}
          </p>
        </div>

        {/* Main Cover Image */}
        {project.thumbnail && (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-12 border border-slate-800 shadow-2xl">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* Project Meta Bar & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Main Case Study Text */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Project Overview</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line text-base">
                {project.full_description}
              </p>
            </div>

            {project.case_study_content && (
              <div className="pt-8 border-t border-slate-800">
                <h2 className="text-2xl font-bold text-white mb-4">Engineering Architecture</h2>
                <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line text-base leading-relaxed">
                  {project.case_study_content}
                </div>
              </div>
            )}

            {/* Gallery Images (multiple project images) */}
            {project.project_images && project.project_images.length > 0 && (
              <div className="pt-8 border-t border-slate-800">
                <h2 className="text-2xl font-bold text-white mb-6">Visual Walkthrough</h2>
                <div className="space-y-6">
                  {project.project_images.map((img) => (
                    <figure key={img.id} className="rounded-xl overflow-hidden border border-slate-800">
                      <img
                        src={img.image_url}
                        alt={img.caption || project.title}
                        className="w-full object-cover"
                      />
                      {img.caption && (
                        <figcaption className="p-3 bg-slate-900/80 text-xs text-slate-400 text-center">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-4 pb-2 border-b border-slate-800">
                Metadata &amp; Scope
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Role</span>
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-400" />
                    {project.role}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Category</span>
                  <span className="font-medium text-slate-200">{project.category}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Year</span>
                  <span className="font-medium text-slate-200">{project.year}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block mb-2">Technologies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action links */}
              <div className="pt-6 mt-6 border-t border-slate-800 space-y-3">
                {project.project_url && (
                  <a href={project.project_url} target="_blank" rel="noreferrer" className="block">
                    <Button variant="primary" size="md" className="w-full" icon={<ExternalLink className="w-4 h-4" />}>
                      Visit Live Platform
                    </Button>
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noreferrer" className="block">
                    <Button variant="secondary" size="md" className="w-full" icon={<GithubIcon className="w-4 h-4" />}>
                      View Source Code
                    </Button>
                  </a>
                )}
              </div>
            </Card>

            {/* Results / Key Impact */}
            {project.results && project.results.length > 0 && (
              <Card className="p-6 bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/20">
                <h3 className="text-sm uppercase tracking-wider font-bold text-indigo-300 mb-4 pb-2 border-b border-indigo-500/20">
                  Key Outcomes &amp; Impact
                </h3>
                <ul className="space-y-3">
                  {project.results.map((res, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </article>
  );
}
