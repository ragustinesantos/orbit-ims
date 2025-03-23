'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import P2AccessPage from '@/components/P2Access/P2Access';

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
          background: '#fafbfd',
          padding: 32,
        }}
      >
        <P2AccessPage />
      </div>
    </main>
  );
}
