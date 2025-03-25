'use client';

import E2AccessPage from '@/components/E2Access/E2Access';
import { NavbarNested } from '@/components/NavbarNested/NavbarNested';

export default function E2Access() {
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
          background: '#fafbfd',
        }}
      >
        <E2AccessPage />
      </div>
    </main>
  );
}
