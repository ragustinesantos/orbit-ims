'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import E3AccessPage from '@/components/E3Access/E3Access';

export default function P2Access() {
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
          overflowY: 'scroll',
        }}
      >
        <E3AccessPage />
      </div>
    </main>
  );
} 