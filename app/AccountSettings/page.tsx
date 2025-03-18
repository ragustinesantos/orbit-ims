'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import ProfilePage from '@/components/ProfilePage/ProfilePage';

export default function AccountSettingsPage() {
  return (
    <main style={{ display: 'flex', width: '100vw' }}>
      <NavbarNested />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minWidth: '50vw',
          height: '100vh',
        }}
      >
        <ProfilePage />
      </div>
    </main>
  );
}
