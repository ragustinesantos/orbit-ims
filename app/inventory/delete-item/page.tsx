'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import DeleteItem from '@/components/DeleteItem/DeleteItem';

export default function DeleteItemPage() {

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
          //height: '100vh',
          padding: 10,
        }}
      >
        <DeleteItem />
      </div>
    </main>
  );
}
