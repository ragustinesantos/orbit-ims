'use client';

import DeleteItem from '@/components/DeleteItem/DeleteItem';
import { NavbarNested } from '@/components/NavbarNested/NavbarNested';

export default function DeleteItemPage() {
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
        <DeleteItem />
      </div>
    </main>
  );
}
