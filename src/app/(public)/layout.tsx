import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CanvasWrapper } from '@/components/canvas/CanvasWrapper';
import { PortfolioService } from '@/lib/services/portfolio-service';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const socialLinks = await PortfolioService.getSocialLinks();

  return (
    <div className="min-h-screen flex flex-col relative bg-[#08090C] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* 3D Canvas Ambient Scene */}
      <CanvasWrapper />

      {/* Floating Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow relative z-10">{children}</main>

      {/* Footer */}
      <Footer socialLinks={socialLinks} />
    </div>
  );
}
