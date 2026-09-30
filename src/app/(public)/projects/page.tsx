import React from 'react';
import { PortfolioService } from '@/lib/services/portfolio-service';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 60;

export default async function ProjectsDirectoryPage() {
  const allProjects = await PortfolioService.getAllProjects();

  return (
    <div className="pt-32 pb-24">
      <Container size="default">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <ProjectsSection
          projects={allProjects}
          title="All Projects &amp;"
          eyebrow="Portfolio Archive"
          description="Complete catalog of case studies, architectural platforms, open-source repositories, and 3D web applications."
          showViewAll={false}
        />
      </Container>
    </div>
  );
}
