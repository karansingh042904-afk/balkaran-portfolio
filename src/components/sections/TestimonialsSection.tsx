'use client';

import React from 'react';
import { Testimonial } from '@/types/portfolio';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 relative">
      <Container size="default">
        <SectionHeading
          eyebrow="Social Proof"
          title="Endorsements &amp;"
          highlightedWord="Testimonials"
          description="What collaborators, engineering leaders, and founders say about my architectural contributions."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <Card key={t.id} className="p-8 flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-indigo-400/40 mb-4" />
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic mb-8">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-800/80">
                {t.avatar_url && (
                  <img
                    src={t.avatar_url}
                    alt={t.client_name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-700"
                  />
                )}
                <div>
                  <h4 className="text-sm font-bold text-white">{t.client_name}</h4>
                  <p className="text-xs text-slate-400">
                    {t.client_title}, <span className="text-indigo-400">{t.company}</span>
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
