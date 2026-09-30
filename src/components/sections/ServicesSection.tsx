'use client';

import React from 'react';
import { Service } from '@/types/portfolio';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Layers, Sparkles, Palette, CheckCircle2 } from 'lucide-react';

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  if (!services || services.length === 0) return null;

  const getServiceIcon = (iconName: string | null) => {
    const key = (iconName || '').toLowerCase();
    if (key.includes('sparkle') || key.includes('3d')) return <Sparkles className="w-6 h-6 text-cyan-400" />;
    if (key.includes('palette') || key.includes('design')) return <Palette className="w-6 h-6 text-purple-400" />;
    return <Layers className="w-6 h-6 text-indigo-400" />;
  };

  return (
    <section id="services" className="py-24 relative bg-slate-950/30 border-t border-slate-800/40">
      <Container size="default">
        <SectionHeading
          eyebrow="Solutions &amp; Scope"
          title="Specialized Services &amp;"
          highlightedWord="Offerings"
          description="High-value architectural consulting, 3D interactive web experiences, and scalable web engineering."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="flex flex-col h-full p-8 border border-slate-800/80">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 w-fit mb-6">
                {getServiceIcon(service.icon)}
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                {service.title}
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-grow">
                {service.description}
              </p>

              {service.features && service.features.length > 0 && (
                <ul className="space-y-2.5 pt-6 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300">
                  {service.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
