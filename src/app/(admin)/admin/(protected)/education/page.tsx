import React from 'react';
import { EducationDataStore } from '@/lib/services/education-data-store';
import { EducationManagementClient } from '@/components/admin/EducationManagementClient';

export const dynamic = 'force-dynamic';

export default async function AdminEducationPage() {
  const initialEducation = await EducationDataStore.getAllEducation();

  return <EducationManagementClient initialEducation={initialEducation} />;
}
