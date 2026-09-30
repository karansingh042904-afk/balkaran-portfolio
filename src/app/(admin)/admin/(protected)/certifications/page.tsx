import React from 'react';
import { EducationDataStore } from '@/lib/services/education-data-store';
import { CertificationsManagementClient } from '@/components/admin/CertificationsManagementClient';

export const dynamic = 'force-dynamic';

export default async function AdminCertificationsPage() {
  const allEducation = await EducationDataStore.getAllEducation();
  const certifications = allEducation.filter((item) => item.type === 'Certification');

  return <CertificationsManagementClient initialCertifications={certifications} />;
}
