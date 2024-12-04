/* eslint-disable no-console */
'use client';

import { HeaderTabs } from '@/components/HeaderTabs/HeaderTabs';

import Login from '@/components/Login/Login';
import { useUserAuth } from './_utils/auth-context';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, signInWithEmail, firebaseSignOut } = useUserAuth() || {};
  const router = useRouter();

  const handleLogin = async (
    username: string,
    pass: string,
    err: (hasError: boolean) => void,
  ) => {
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
      {!user ? <Login
        handleLogin={handleLogin}
      /> : <HeaderTabs />}
    </main>
  );
}
