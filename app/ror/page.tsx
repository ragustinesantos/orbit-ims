'use client';

import CreateRor from '@/components/CreateRor/CreateRor';
import { NavbarNested } from '@/components/NavbarNested/NavbarNested';

export default function CreateRORPage() {
  return (
    <main style={{ display: 'flex', width: '100vw' }}>
      <NavbarNested />
      <div
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: '100vh',
          padding: 32,
        }}
      >
        <CreateRor />
      </div>
    </main>
  );
}
