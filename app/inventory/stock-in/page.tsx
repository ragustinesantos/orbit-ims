'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import StockIn from '@/components/StockIn/StockIn';

export default function StockInPage() {
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
        <StockIn />
      </div>
    </main>
  );
}
