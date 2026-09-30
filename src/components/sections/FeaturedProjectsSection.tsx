'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProjectWithImages } from '@/types/portfolio';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, ExternalLink, Sparkles, CheckCircle2, Layers } from 'lucide-react';
import { GithubIcon } from '@/components/icons/BrandIcons';

interface FeaturedProjectsSectionProps {
  projects: ProjectWithImages[];
}

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  const featured = projects.filter((p) => p.published && p.featured);

  if (featured.length === 0) return null;

  return (
    <section id="featured-projects" className="py-24 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="ambient-glow bg-indigo-600/15 w-[500px] h-[500px] -top-32 right-10" />
      <div className="ambient-glow bg-cyan-600/10 w-[400px] h-[400px] bottom-10 left-10" />

      <Container size="default">
        <SectionHeading
          eyebrow="Spotlight Work"
          title="Featured AI &amp;"
          highlightedWord="Projects"
          description="Flagship systems demonstrating agentic AI workflows, computer vision compliance, and scalable full-stack web engineering."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featured.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex"
            >
              <Card className="flex flex-col h-full w-full overflow-hidden p-0 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 group">
                {/* Thumbnail Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 shrink-0">
                  {project.thumbnail ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
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
                  <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                    <Badge variant="accent" className="text-xs">
                      {project.category}
                    </Badge>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-slate-300 backdrop-blur-md border border-white/10">
                      {project.year}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <Badge variant="emerald" className="text-[10px] py-0.5">
                      <Sparkles className="w-3 h-3 mr-1 text-emerald-400" />
                      Featured
                    </Badge>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-400/90">
                      {project.role}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors leading-snug">
                      <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                      {project.short_description}
                    </p>

                    {/* Key Results / Outcomes */}
                    {project.results && project.results.length > 0 && (
                      <div className="mb-6 space-y-1.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        {project.results.slice(0, 2).map((res, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{res}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-slate-800/80">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-[11px] text-slate-500 self-center pl-1 font-medium font-mono">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Footer Links */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <span>Case Study</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <div className="flex items-center gap-1.5">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="GitHub Repository"
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
                            title="Live Demo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
