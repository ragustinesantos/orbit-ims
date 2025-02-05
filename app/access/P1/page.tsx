'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import P1AccessPage from '@/components/P1Access/P1Access';

export default function CreateRorTemplatePage() {
  return (
    <main style={{ display: 'flex', width: '100vw' }}>
      <NavbarNested />
      <div
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-start',
          height: '100vh',
          padding: 32,
        }}
      >
        <P1AccessPage />
      </div>
    </main>
  );
}
