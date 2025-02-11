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
          paddingLeft: 32,
          paddingTop: 4,
        }}
      >
        <UpdateEmployee />
      </div>
    </main>
  );
}