'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Profile } from '@/types/portfolio';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  GraduationCap,
  Sparkles,
  MapPin,
  Mail,
  Download,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons';

interface AboutSectionProps {
  profile: Profile | null;
}

export function AboutSection({ profile }: AboutSectionProps) {
  if (!profile) return null;

  const email = profile.email || 'karansingh042906@gmail.com';
  const degree = profile.degree || 'B.Tech in Computer Science & Information Technology';
  const specialization = profile.specialization || 'Minor in Artificial Intelligence';
  const educationStatus = profile.education_status || 'Pursuing B.Tech';
  const location = profile.location || 'Pune, Maharashtra / Delhi, India';

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-slate-950/30 border-t border-slate-800/40">
      {/* Background Subtle Ambient Glow */}
      <div className="ambient-glow bg-indigo-600/10 w-[500px] h-[500px] -top-32 left-1/4" />
      <div className="ambient-glow bg-purple-600/10 w-[400px] h-[400px] bottom-0 right-10" />

      <Container size="default">
        <SectionHeading
          eyebrow="Profile &amp; Background"
          title="About Me &amp;"
          highlightedWord="Academic Foundation"
          description="Aspiring software engineer dedicated to building scalable systems, AI-powered solutions, and disciplined software architecture."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Bio & Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            <Card className="p-6 sm:p-8 border-indigo-500/20">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="accent" className="text-xs">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Fresher &amp; Aspiring Software Engineer</span>
                  </span>
                </Badge>
                <Badge variant="emerald" className="text-xs">
                  {educationStatus}
                </Badge>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                {profile.full_name || 'Balkaran Singh'}
              </h3>

              <p className="text-base font-semibold text-indigo-400 mb-4">
                {profile.headline || 'B.Tech in CS & IT with Minor in Artificial Intelligence'}
              </p>

              {profile.short_intro && (
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-sm sm:text-base leading-relaxed mb-6 font-medium italic">
                  &ldquo;{profile.short_intro}&rdquo;
                </div>
              )}

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-6">
                {profile.bio ||
                  'Detail-oriented and adaptable B.Tech Computer Science & Information Technology student at Ajeenkya DY Patil University with a minor in Artificial Intelligence. Passionate about software development, scalable web architectures, machine learning workflows, and data-driven problem solving.'}
              </p>

              {/* Core Strengths Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-slate-800/80">
                {[
                  'Full-Stack Web Development',
                  'AI & Machine Learning Workflows',
                  'Process Optimization & Quality (Six Sigma)',
                  'Network & Cybersecurity Principles',
                ].map((strength, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>

              {/* Actions: Resume & Social */}
              <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-slate-800/80">
                {profile.resume_url && (
                  <a href={profile.resume_url} target="_blank" rel="noreferrer">
                    <Button size="sm" icon={<Download className="w-4 h-4" />}>
                      Download Resume
                    </Button>
                  </a>
                )}

                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4 text-blue-400" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {profile.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <GithubIcon className="w-4 h-4 text-slate-200" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Academic & Status Sidebar Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 space-y-6"
          >
            <Card className="p-6 sm:p-7 border-slate-800 space-y-6">
              <h4 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <span>Academic Information</span>
              </h4>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                    Degree
                  </span>
                  <span className="text-white font-medium mt-0.5 block">{degree}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                    Minor / Specialization
                  </span>
                  <span className="text-indigo-400 font-medium mt-0.5 block">{specialization}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                    University / Institution
                  </span>
                  <span className="text-white font-medium mt-0.5 block">
                    Ajeenkya DY Patil University (ADYPU)
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                    Current Status
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 font-medium text-xs">
                      {educationStatus} • 7.6 CGPA (1st Year)
                    </span>
                  </div>
                </div>
              </div>

              {/* Location & Email Details */}
              <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                    {email}
                  </a>
                </div>
              </div>
            </Card>

            {/* Fresh Perspective Callout Card */}
            <Card className="p-6 bg-gradient-to-br from-indigo-950/30 to-purple-950/20 border-indigo-500/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white mb-1">
                    Authentic &amp; Dedicated Developer
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Driven by curiosity and high engineering standards, eager to contribute fresh energy, rapid learning agility, and disciplined execution to ambitious tech teams.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
