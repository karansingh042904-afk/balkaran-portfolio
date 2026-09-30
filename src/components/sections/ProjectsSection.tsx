'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectWithImages } from '@/types/portfolio';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ExternalLink, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '@/components/icons/BrandIcons';

interface ProjectsSectionProps {
  projects: ProjectWithImages[];
  title?: string;
  eyebrow?: string;
  description?: string;
  showViewAll?: boolean;
}

export function ProjectsSection({
  projects,
  title = 'Featured Case Studies &',
  eyebrow = 'Selected Work',
  description = 'A curation of production applications, interactive 3D studios, and high-performance cloud platforms.',
  showViewAll = true,
}: ProjectsSectionProps) {
  if (!projects || projects.length === 0) {
    return (
      <section id="projects" className="py-24 relative">
        <Container size="default">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            highlightedWord="Projects"
            description={description}
          />
          <Card className="text-center py-12">
            <p className="text-slate-400">No projects published yet. Connect Supabase to publish your first case study.</p>
          </Card>
        </Container>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 relative">
      <Container size="default">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          highlightedWord="Projects"
          description={description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col h-full overflow-hidden p-0 border border-slate-800/80 group">
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                    <Layers className="w-12 h-12 stroke-[1.5]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Badges on Thumbnail */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <Badge variant="accent">{project.category}</Badge>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 text-slate-300 backdrop-blur-md border border-white/10">
                    {project.year}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{project.role}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  <Link href={`/projects/${project.slug}`}>
                    {project.title}
                  </Link>
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-grow">
                  {project.short_description}
                </p>

                {/* Key Results / Metrics */}
                {project.results && project.results.length > 0 && (
                  <div className="mb-6 space-y-1.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                    {project.results.slice(0, 2).map((res, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-[11px] bg-slate-900/40">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 5 && (
                    <span className="text-[11px] text-slate-500 self-center pl-1 font-medium">
                      +{project.technologies.length - 5} more
                    </span>
                  )}
                </div>

                {/* Card Footer Links */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4 mt-auto">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="View Source Code"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Live Preview"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {showViewAll && (
          <div className="mt-14 text-center">
            <Link href="/projects">
              <Button variant="outline" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                View All Projects Gallery
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
