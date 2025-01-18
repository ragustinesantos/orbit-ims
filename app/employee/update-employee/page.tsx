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
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minWidth: '50vw',
          padding: 10,
        }}
      >
        <UpdateEmployee/>
      </div>
    </main>
  );
}