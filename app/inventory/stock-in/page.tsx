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
          justifyContent: 'center',
          height: '100vh',
          paddingLeft: 32,
          paddingTop: 4,
          overflowY:'scroll',
        }}
      >
        <StockIn />
      </div>
    </main>
  );
}