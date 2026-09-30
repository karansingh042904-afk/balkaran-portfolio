'use client';

import React from 'react';
import { Experience } from '@/types/portfolio';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Briefcase, Calendar, MapPin, Award, Check } from 'lucide-react';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (!experiences || experiences.length === 0) return null;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="experience" className="py-24 relative bg-slate-950/40 border-y border-slate-800/40">
      <Container size="default">
        <SectionHeading
          eyebrow="Career Trajectory"
          title="Professional Experience &amp;"
          highlightedWord="Leadership"
          description="Track record of engineering robust systems, architecting frontends, and scaling high-impact software."
        />

        <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-purple-500/50 before:to-transparent">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-6 sm:-left-10 top-1.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
              </div>

              <Card className="p-6 sm:p-8">
                {/* Role Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {exp.position}
                    </h3>
                    <div className="text-base font-semibold text-indigo-400/90 flex items-center gap-2 mt-1">
                      <span>{exp.company}</span>
                      {exp.location && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs font-normal text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {exp.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    {exp.current_position && (
                      <Badge variant="emerald">Present</Badge>
                    )}
                    <span className="text-xs text-slate-400 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {formatDate(exp.start_date)} –{' '}
                      {exp.current_position ? 'Present' : exp.end_date ? formatDate(exp.end_date) : 'Present'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
                  {exp.description}
                </p>

                {/* Key Achievements */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mb-6 space-y-2 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                    <div className="text-xs uppercase tracking-wider font-semibold text-indigo-300 flex items-center gap-1.5 mb-2">
                      <Award className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Key Highlights &amp; Impacts</span>
                    </div>
                    {exp.achievements.map((ach, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Technologies */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/60">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-900/90 text-slate-400 border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
