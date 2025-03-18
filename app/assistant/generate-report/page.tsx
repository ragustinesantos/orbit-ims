'use client';

import GenerateReport from '@/components/GenerateReport/GenerateReport';
import { NavbarNested } from '@/components/NavbarNested/NavbarNested';

export default function Assistant() {
  return (
    <main style={{ display: 'flex', width: '100vw' }}>
      <NavbarNested />
      <div
        style={{
          width: '100%',
          minWidth: '50vw',
          height: '100vh',
          padding: 10,
          justifyContent: 'space-between',
          overflowY: 'scroll',
        }}
      >
        <GenerateReport />
      </div>
    </main>
  );
}
