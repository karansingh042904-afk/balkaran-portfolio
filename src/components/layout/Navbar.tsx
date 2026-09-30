'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Sparkles, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Projects', href: '/#featured-projects' },
    { label: 'Education', href: '/#education' },
    { label: 'Certifications', href: '/#certifications' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-4 sm:px-6">
      <Container size="wide">
        <div className="glass-panel rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl shadow-black/40">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                Balkaran
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Portfolio &amp; Lab
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action / Admin Link */}
          <div className="hidden sm:flex items-center gap-3">
            <Badge variant="emerald" className="hidden lg:inline-flex">
              Available for work
            </Badge>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg transition-all"
              title="Admin CMS Portal"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin CMS</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 mx-auto max-w-lg"
          >
            <div className="glass-panel rounded-2xl p-5 shadow-2xl flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-sm text-slate-200 hover:text-white rounded-xl hover:bg-white/5 font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <Badge variant="emerald">Available for work</Badge>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-medium"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin CMS
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
