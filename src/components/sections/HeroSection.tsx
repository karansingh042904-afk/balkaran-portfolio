'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Profile } from '@/types/portfolio';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Download, MapPin } from 'lucide-react';

interface HeroSectionProps {
  profile: Profile | null;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const name = profile?.full_name || 'Balkaran Singh';
  const headline = profile?.headline || 'Aspiring Software Engineer | B.Tech in CS & IT with Minor in AI';
  const intro = profile?.short_intro || profile?.bio || 'Passionate, forward-thinking fresher driven to solve complex challenges, optimize processes, and deliver impactful, scalable software solutions.';
  const location = profile?.location || 'Pune, Maharashtra / Delhi, India';
  const resumeUrl = profile?.resume_url || '#';

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Background Subtle Gradient Glows */}
      <div className="ambient-glow bg-indigo-600/30 w-[500px] h-[500px] -top-32 -left-32" />
      <div className="ambient-glow bg-purple-600/25 w-[550px] h-[550px] top-1/3 -right-32" />
      <div className="ambient-glow bg-cyan-600/20 w-[400px] h-[400px] bottom-10 left-1/3" />

      <Container size="default" className="relative z-10 text-center">
        {/* Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <div className="glass-panel px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open to Software Engineering Roles &amp; Technical Opportunities</span>
            {location && (
              <>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3 h-3 text-indigo-400" />
                  {location}
                </span>
              </>
            )}
          </div>
        </motion.div>

        {/* Main Hero Header */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]"
        >
          Hi, I&apos;m <span className="text-gradient-accent">{name}</span>
        </motion.h1>

        {/* Subhead / Headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg sm:text-2xl font-semibold text-indigo-400 max-w-2xl mx-auto mb-6"
        >
          {headline}
        </motion.p>

        {/* Dynamic Short Intro Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          {intro}
        </motion.p>

        {/* Hero Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/#projects">
            <Button size="lg" icon={<ArrowRight className="w-4 h-4" />}>
              Explore Projects
            </Button>
          </Link>

          <Link href="/#about">
            <Button variant="secondary" size="lg">
              About &amp; Academic Path
            </Button>
          </Link>

          {resumeUrl && resumeUrl !== '#' && (
            <a href={resumeUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" size="lg" icon={<Download className="w-4 h-4" />}>
                Resume / CV
              </Button>
            </a>
          )}
        </motion.div>

        {/* Metric Badges */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto mt-16 pt-12 border-t border-slate-800/80"
        >
          <div className="text-center p-3 glass-panel rounded-xl">
            <span className="block text-2xl sm:text-3xl font-bold text-white tracking-tight">
              7.6 CGPA
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              Academic Standing (1st Yr)
            </span>
          </div>

          <div className="text-center p-3 glass-panel rounded-xl">
            <span className="block text-2xl sm:text-3xl font-bold text-white tracking-tight">
              35+
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              Technical Competencies
            </span>
          </div>

          <div className="text-center p-3 glass-panel rounded-xl col-span-2 sm:col-span-1">
            <span className="block text-2xl sm:text-3xl font-bold text-gradient-accent tracking-tight">
              3
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              Industry Certifications
            </span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
