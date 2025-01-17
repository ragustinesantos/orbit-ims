'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import DeleteEmployee from '@/components/DeleteEmployee/DeleteEmployee';

export default function DeleteEmployeePage() {

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
        <DeleteEmployee />
      </div>
    </main>
  );
}