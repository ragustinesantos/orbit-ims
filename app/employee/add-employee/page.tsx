'use client';

import AddEmployee from '@/components/AddEmployee/AddEmployee';
import { NavbarNested } from '@/components/NavbarNested/NavbarNested';

export default function AddEmployeePage() {
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
        <AddEmployee />
      </div>
    </main>
  );
}
