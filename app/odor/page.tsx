'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import OdorComponent from '@/components/Odor/Odor';
import classnames from './odorpage.module.css';
import { Text } from '@mantine/core';

export default function OdorPage() {
  return (
    <main style={{ display: 'flex', width: '100vw' }}>
      <NavbarNested />
      <div>
        <OdorComponent/>
      </div>
    </main>
  );
}