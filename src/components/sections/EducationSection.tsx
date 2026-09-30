'use client';

import React from 'react';
import { EducationJourney } from '@/types/portfolio';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  GraduationCap,
  Award,
  BookOpen,
  Trophy,
  Compass,
  Calendar,
  ExternalLink,
  Code2,
  CheckCircle2,
} from 'lucide-react';

interface EducationSectionProps {
  educationJourney: EducationJourney[];
}

export function EducationSection({ educationJourney }: EducationSectionProps) {
  if (!educationJourney || educationJourney.length === 0) return null;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getTypeIcon = (type: EducationJourney['type']) => {
    switch (type) {
      case 'Education':
        return <GraduationCap className="w-4 h-4 text-indigo-400" />;
      case 'Certification':
        return <Award className="w-4 h-4 text-emerald-400" />;
      case 'Course':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'Achievement':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'Learning':
        return <Compass className="w-4 h-4 text-purple-400" />;
      default:
        return <GraduationCap className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getTypeBadgeVariant = (type: EducationJourney['type']): 'default' | 'accent' | 'emerald' | 'outline' => {
    switch (type) {
      case 'Education':
        return 'accent';
      case 'Certification':
        return 'emerald';
      case 'Course':
        return 'default';
      case 'Achievement':
        return 'accent';
      case 'Learning':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <section id="education" className="py-24 relative bg-slate-950/40 border-y border-slate-800/40">
      <Container size="default">
        <SectionHeading
          eyebrow="My Academic &amp; Technical Path"
          title="Education &amp;"
          highlightedWord="Journey"
          description="A timeline of my formal education, specialized certifications, coursework, achievements, and self-directed technical growth."
        />

        <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 via-purple-500/50 before:to-transparent">
          {educationJourney.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-6 sm:-left-10 top-1.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
              </div>

              <Card className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    {item.logo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.logo_url}
                        alt={item.institution}
                        className="w-12 h-12 rounded-xl object-contain bg-slate-900 border border-slate-800 p-1 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge variant={getTypeBadgeVariant(item.type)}>
                          <span className="flex items-center gap-1.5">
                            {getTypeIcon(item.type)}
                            <span>{item.type}</span>
                          </span>
                        </Badge>

                        {item.current && (
                          <Badge variant="emerald">Currently Pursuing</Badge>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-base font-semibold text-indigo-400/90 mt-0.5">
                        {item.institution}
                      </p>
                    </div>
                  </div>

                  {/* Dates & Certificate Link */}
                  <div className="flex flex-col sm:items-end gap-2 self-start sm:self-auto shrink-0">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {formatDate(item.start_date)} –{' '}
                      {item.current ? 'Present' : item.end_date ? formatDate(item.end_date) : 'Present'}
                    </span>

                    {item.certificate_url && (
                      <a
                        href={item.certificate_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Certificate / Credential</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
                    {item.description}
                  </p>
                )}

                {/* Skills Learned */}
                {item.skills_learned && item.skills_learned.length > 0 && (
                  <div className="mb-4 space-y-2 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                    <div className="text-xs uppercase tracking-wider font-semibold text-indigo-300 flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Key Learnings &amp; Competencies</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-300">
                      {item.skills_learned.map((skill, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800/60">
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mr-1">
                      <Code2 className="w-3.5 h-3.5" />
                      Technologies:
                    </span>
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-900/90 text-slate-300 border border-slate-800"
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
