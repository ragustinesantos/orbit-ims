'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import UpdateItem from '@/components/UpdateItem/UpdateItem';

export default function UpdateItemPage() {
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
        <UpdateItem />
      </div>
    </main>
  );
}