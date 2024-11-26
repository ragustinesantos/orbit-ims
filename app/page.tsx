/* eslint-disable no-console */
'use client';

import { useState } from 'react';
import { HeaderTabs } from '@/components/HeaderTabs/HeaderTabs';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';

export default function HomePage() {

  return (
    <main className="h-screen">
      <HeaderTabs  />
    </main>
  );
}
