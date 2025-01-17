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
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minWidth: '50vw',
          //height: '100vh',
          padding: 10,
        }}
      >
        <CreateRorTemplate />
      </div>
    </main>
  );
}
