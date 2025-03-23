'use client';

import E3AccessPage from '@/components/E3Access/E3Access';
import { NavbarNested } from '@/components/NavbarNested/NavbarNested';

export default function E3Access() {
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
          overflowY: 'scroll',
        }}
      >
        <E3AccessPage />
      </div>
    </main>
  );
}
