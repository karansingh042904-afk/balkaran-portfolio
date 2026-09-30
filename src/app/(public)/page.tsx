import React from 'react';
import { PortfolioService } from '@/lib/services/portfolio-service';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { FeaturedProjectsSection } from '@/components/sections/FeaturedProjectsSection';
import { AllProjectsSection } from '@/components/sections/AllProjectsSection';
import { EducationSection } from '@/components/sections/EducationSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { ContactSection } from '@/components/sections/ContactSection';

export const revalidate = 60; // ISR revalidation every 60 seconds

export default async function HomePage() {
  const data = await PortfolioService.getPortfolioData();

  // Formal education & learning milestones (excluding certifications which have their own dedicated showcase)
  const formalEducation = data.educationJourney.filter((item) => item.type !== 'Certification');

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <HeroSection profile={data.profile} />

      {/* 2. ABOUT */}
      <AboutSection profile={data.profile} />

      {/* 3. SKILLS */}
      <SkillsSection skills={data.skills} />

      {/* 4. FEATURED PROJECTS */}
      <FeaturedProjectsSection projects={data.featuredProjects} />

      {/* 5. ALL PROJECTS */}
      <AllProjectsSection projects={data.allProjects} />

      {/* 6. EDUCATION & JOURNEY */}
      <EducationSection educationJourney={formalEducation.length > 0 ? formalEducation : data.educationJourney} />

      {/* 7. CERTIFICATIONS */}
      <CertificationsSection certifications={data.certifications} />

      {/* 8. CONTACT */}
      <ContactSection profile={data.profile} socialLinks={data.socialLinks} />
    </div>
  );
}
