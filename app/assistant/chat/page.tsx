'use client';

import ChatAssistant from '@/components/ChatAssistant/ChatAssistant';
import { NavbarNested } from '@/components/NavbarNested/NavbarNested';

export default function Assistant() {
  return (
    <main style={{ display: 'flex', width: '100vw' }}>
      <NavbarNested />
      <div
        style={{
          width: '100%',
          minWidth: '50vw',
          height: '100vh',
          padding: 10,
          justifyContent: 'space-between',
        }}
      >
        <ChatAssistant />
      </div>
    </main>
  );
}
