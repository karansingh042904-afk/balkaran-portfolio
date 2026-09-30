'use client';

import React from 'react';
import { Skill } from '@/types/portfolio';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Code, Cpu, Server, Sparkles, Terminal } from 'lucide-react';

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills || skills.length === 0) return null;

  // Group skills by category
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('front')) return <Code className="w-4 h-4 text-indigo-400" />;
    if (lower.includes('back')) return <Server className="w-4 h-4 text-cyan-400" />;
    if (lower.includes('creative') || lower.includes('3d')) return <Sparkles className="w-4 h-4 text-purple-400" />;
    if (lower.includes('devops')) return <Terminal className="w-4 h-4 text-emerald-400" />;
    return <Cpu className="w-4 h-4 text-slate-400" />;
  };

  return (
    <section id="skills" className="py-24 relative">
      <Container size="default">
        <SectionHeading
          eyebrow="Capabilities &amp; Tech"
          title="Technical Mastery &amp;"
          highlightedWord="Tooling"
          description="Proficiencies across modern web engineering, graphics shaders, database architecture, and distributed systems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const categorySkills = skills.filter((s) => s.category === cat);
            return (
              <Card key={cat} className="p-6">
                <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-800/80">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    {getCategoryIcon(cat)}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {cat}
                  </h3>
                </div>

                {categorySkills.some((s) => s.proficiency !== null && s.proficiency !== undefined) ? (
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                          <span className="text-slate-200">{skill.name}</span>
                          {skill.proficiency && (
                            <span className="text-slate-500 font-mono">
                              {skill.proficiency}%
                            </span>
                          )}
                        </div>
                        {skill.proficiency && (
                          <div className="h-1.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="group/pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-indigo-500/40 hover:bg-slate-800/90 transition-all duration-200"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover/pill:bg-cyan-400 transition-colors shrink-0" />
                        <span>{skill.name}</span>
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
