'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { EducationJourney } from '@/types/portfolio';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Award, CheckCircle2, ExternalLink, ShieldCheck, Binary, Sparkles } from 'lucide-react';

interface CertificationsSectionProps {
  certifications: EducationJourney[];
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  if (!certifications || certifications.length === 0) return null;

  const getCertIcon = (title: string, institution: string) => {
    const combined = `${title} ${institution}`.toLowerCase();
    if (combined.includes('cyber') || combined.includes('security')) {
      return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
    }
    if (combined.includes('data') || combined.includes('science')) {
      return <Binary className="w-6 h-6 text-cyan-400" />;
    }
    if (combined.includes('sigma') || combined.includes('quality')) {
      return <Award className="w-6 h-6 text-amber-400" />;
    }
    return <Sparkles className="w-6 h-6 text-indigo-400" />;
  };

  return (
    <section id="certifications" className="py-24 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="ambient-glow bg-emerald-600/15 w-[450px] h-[450px] -top-24 right-10" />
      <div className="ambient-glow bg-cyan-600/15 w-[400px] h-[400px] bottom-0 left-10" />

      <Container size="default">
        <SectionHeading
          eyebrow="Accredited Certifications"
          title="Professional &amp; Technical"
          highlightedWord="Credentials"
          description="Verified certifications covering quality management, network defense, threat analysis, and data science fundamentals."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col justify-between p-6 sm:p-7 relative group hover:border-emerald-500/40 transition-all duration-300">
                <div>
                  {/* Header: Icon & Verification Badge */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-md group-hover:scale-105 transition-transform">
                      {cert.logo_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={cert.logo_url}
                          alt={cert.institution}
                          className="w-7 h-7 object-contain"
                        />
                      ) : (
                        getCertIcon(cert.title, cert.institution)
                      )}
                    </div>

                    <Badge variant="emerald" className="text-[11px] py-1 px-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                      Verified
                    </Badge>
                  </div>

                  {/* Title & Organization */}
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug mb-1">
                    {cert.title}
                  </h3>

                  <div className="text-sm font-semibold text-emerald-400/90 mb-3">
                    {cert.institution}
                  </div>

                  {/* Description */}
                  {cert.description && (
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                      {cert.description}
                    </p>
                  )}

                  {/* Competencies / Skills Learned */}
                  {cert.skills_learned && cert.skills_learned.length > 0 && (
                    <div className="space-y-1.5 mb-6 pt-4 border-t border-slate-800/80">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                        Core Competencies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cert.skills_learned.map((skill, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{skill}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Link / Verification */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Issued: {cert.start_date ? new Date(cert.start_date).getFullYear() : 'Verified'}
                  </span>

                  {cert.certificate_url ? (
                    <a
                      href={cert.certificate_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span>View Credential</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-500">Official Curriculum</span>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
