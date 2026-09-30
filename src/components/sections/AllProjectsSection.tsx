'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectWithImages } from '@/types/portfolio';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, ExternalLink, Search, Layers } from 'lucide-react';
import { GithubIcon } from '@/components/icons/BrandIcons';

interface AllProjectsSectionProps {
  projects: ProjectWithImages[];
}

export function AllProjectsSection({ projects }: AllProjectsSectionProps) {
  // Only published projects
  const publishedProjects = useMemo(() => projects.filter((p) => p.published), [projects]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(publishedProjects.map((p) => p.category)));
    return ['All', ...cats];
  }, [publishedProjects]);

  // Filtered list
  const filteredProjects = useMemo(() => {
    return publishedProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.short_description.toLowerCase().includes(query) ||
        project.technologies.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [publishedProjects, selectedCategory, searchQuery]);

  if (publishedProjects.length === 0) return null;

  return (
    <section id="projects" className="py-24 relative bg-slate-950/40 border-t border-slate-800/40">
      <Container size="default">
        <SectionHeading
          eyebrow="Complete Portfolio"
          title="All Technical"
          highlightedWord="Projects"
          description="Explore all open-source repositories, AI prototypes, and full-stack solutions with instant filtering."
        />

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tech or title..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Project Grid */}
        <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 ? (
            <Card className="text-center py-12 border-dashed border-slate-800">
              <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">
                No projects found matching &ldquo;{searchQuery}&rdquo; in {selectedCategory}.
              </p>
            </Card>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex"
                >
                  <Card className="flex flex-col h-full w-full overflow-hidden p-0 border border-slate-800/80 hover:border-indigo-500/30 transition-all duration-300 group">
                    {/* Thumbnail */}
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
                          <Layers className="w-10 h-10 stroke-[1.5]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] bg-slate-950/80 backdrop-blur-md">
                          {project.category}
                        </Badge>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/60 text-slate-300 backdrop-blur-md border border-white/10">
                          {project.year}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors leading-snug">
                          <Link href={`/projects/${project.slug}`}>
                            {project.title}
                          </Link>
                        </h4>

                        <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4">
                          {project.short_description}
                        </p>
                      </div>

                      <div>
                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1 mb-4 pt-3 border-t border-slate-800/60">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="text-[10px] text-slate-500 self-center pl-1 font-mono">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>

                          <div className="flex items-center gap-1.5">
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                title="GitHub"
                              >
                                <GithubIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {project.project_url && (
                              <a
                                href={project.project_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                title="Live Demo"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
