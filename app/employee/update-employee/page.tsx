'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import UpdateEmployee from '@/components/UpdateEmployee/UpdateEmployee';

export default function UpdateEmployeePage() {
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
        <UpdateEmployee />
      </div>
    </main>
  );
}
