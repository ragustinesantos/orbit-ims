/* eslint-disable no-console */
'use client';

import Login from '@/components/Login/Login';
import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import { useUserAuth } from './_utils/auth-context';

export default function HomePage() {
  const { user, signInWithEmail } = useUserAuth() || {};

  const handleLogin = async (username: string, pass: string, err: (hasError: boolean) => void) => {
    if (signInWithEmail) {
      try {
        const success = await signInWithEmail(username, pass);
        if (success) {
          // temporary route
          // router.push('/manage-inventory');
        } else {
          err(true);
        }
      } catch (error) {
        console.log(error);
        err(true);
      }
    }
  };

  return (
    <main className="h-screen">
      {!user ? <Login handleLogin={handleLogin} /> : <NavbarNested />}
    </main>
  );
}
