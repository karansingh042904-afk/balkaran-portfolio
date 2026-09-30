import React from 'react';
import { ProjectDataStore } from '@/lib/services/project-data-store';
import { ProjectManagementClient } from '@/components/admin/ProjectManagementClient';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const projects = await ProjectDataStore.getAllProjects();

  return <ProjectManagementClient initialProjects={projects} />;
}
