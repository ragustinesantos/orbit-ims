'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import SearchEmp from '../../../components/SearchEmployee/SearchEmployee';

export default function SearchEmpPage() {
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
        <SearchEmp />
      </div>
    </main>
  );
}
