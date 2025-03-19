'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import SearchItem from '../../../components/SearchItem/SearchItem';

export default function SearchItemPage() {
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
          padding: '1.5rem',
        }}
      >
        <SearchItem />
      </div>
    </main>
  );
}
