'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import ProfilePage from '@/components/ProfilePage/ProfilePage';


export default function AccountSettingsPage () {
    return (
            <main style={{ display: 'flex', width: '100vw' }}>
              <NavbarNested />
              <div
                style={{
                  
                }}
              >
                <ProfilePage/>
              </div>
            </main>
    )
}