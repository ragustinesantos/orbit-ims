'use client';

import CreateRorTemplate from '@/components/CreateRorTemplate/CreateRorTemplate';
import { NavbarNested } from '@/components/NavbarNested/NavbarNested';

export default function CreateRorTemplatePage() {
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
        <CreateRorTemplate />
      </div>
    </main>
  );
}
