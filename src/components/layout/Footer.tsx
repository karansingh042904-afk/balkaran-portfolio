import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SocialLink } from '@/types/portfolio';
import { Mail, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/icons/BrandIcons';

interface FooterProps {
  socialLinks?: SocialLink[];
}

export function Footer({ socialLinks = [] }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const getSocialIcon = (iconName: string | null, platform: string) => {
    const key = (iconName || platform).toLowerCase();
    if (key.includes('github')) return <GithubIcon className="w-4 h-4" />;
    if (key.includes('linkedin')) return <LinkedinIcon className="w-4 h-4" />;
    if (key.includes('twitter') || key.includes('x')) return <TwitterIcon className="w-4 h-4" />;
    return <Mail className="w-4 h-4" />;
  };

  return (
    <footer className="relative border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md pt-16 pb-12">
      <Container size="wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-slate-800/60">
          <div>
            <span className="text-xl font-bold text-white tracking-tight">
              Balkaran Singh
            </span>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">
              Aspiring Software Engineer | B.Tech CS &amp; IT with Minor in AI.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all"
                aria-label={link.platform}
              >
                {getSocialIcon(link.icon, link.platform)}
              </a>
            ))}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Balkaran Singh. All rights reserved. Built with Next.js, TypeScript &amp; Supabase.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-slate-300 flex items-center gap-1 transition-colors">
              <span>Admin Portal</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="text-emerald-400 font-medium">Systems Operational</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
