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
          height: '100vh',
          width: '100vw',
          background: '#fafbfd',
          padding: '1.5rem',
        }}
      >
        <CreateRorTemplate />
      </div>
    </main>
  );
}
