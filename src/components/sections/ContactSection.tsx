'use client';

import React from 'react';
import { Profile, SocialLink } from '@/types/portfolio';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, Send, ArrowUpRight, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons';

interface ContactSectionProps {
  profile: Profile | null;
  socialLinks: SocialLink[];
}

export function ContactSection({ profile, socialLinks }: ContactSectionProps) {
  const email = profile?.email || 'karansingh042906@gmail.com';
  const location = profile?.location || 'Pune, Maharashtra / Delhi, India';

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="ambient-glow bg-indigo-600/20 w-[500px] h-[500px] -bottom-32 right-10" />

      <Container size="default">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Let's Build Something"
          highlightedWord="Impactful"
          description="Interested in collaborating, hiring for software engineering roles, or discussing innovative AI projects? My inbox is always open."
        />

        <Card className="max-w-3xl mx-auto p-8 sm:p-12 text-center border-indigo-500/20">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-indigo-400" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Start a Conversation
          </h3>

          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 mb-6">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>{location}</span>
          </div>

          <p className="text-slate-300 max-w-lg mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Whether you want to discuss full-stack architectures, agentic AI workflows, or technical opportunities, feel free to reach out directly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <a href={`mailto:${email}`}>
              <Button size="lg" icon={<Send className="w-4 h-4" />}>
                Send Email ({email})
              </Button>
            </a>
          </div>

          {/* Social Links List */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            {profile?.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1.5 transition-colors font-medium text-slate-300"
              >
                <LinkedinIcon className="w-4 h-4 text-blue-400" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            )}

            {profile?.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1.5 transition-colors font-medium text-slate-300"
              >
                <GithubIcon className="w-4 h-4 text-slate-200" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            )}

            {socialLinks
              .filter((link) => link.url !== profile?.github_url && link.url !== profile?.linkedin_url)
              .map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors font-medium"
                >
                  <span>{link.platform}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </a>
              ))}
          </div>
        </Card>
      </Container>
    </section>
  );
}
