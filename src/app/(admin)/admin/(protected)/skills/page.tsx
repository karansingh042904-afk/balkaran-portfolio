import React from 'react';
import { SkillsDataStore } from '@/lib/services/skills-data-store';
import { SkillsManagementClient } from '@/components/admin/SkillsManagementClient';

export const dynamic = 'force-dynamic';

export default async function AdminSkillsPage() {
  const skills = await SkillsDataStore.getAllSkills();

  return <SkillsManagementClient initialSkills={skills} />;
}
