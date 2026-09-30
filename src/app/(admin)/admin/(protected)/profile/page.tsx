import React from 'react';
import { ProfileDataStore } from '@/lib/services/profile-data-store';
import { ProfileEditorClient } from '@/components/admin/ProfileEditorClient';

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const profile = await ProfileDataStore.getProfile();

  return <ProfileEditorClient initialProfile={profile} />;
}
