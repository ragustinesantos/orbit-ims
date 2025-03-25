/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import Login from '@/components/Login/Login';
import { useUserAuth } from './_utils/auth-context';
import { auth } from './_utils/firebase';

export default function HomePage() {
  const { user, signInWithEmail } = useUserAuth() || {};

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsLoading(false);
      if (firebaseUser) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, []);

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
    <main className="h-screen">{!isLoading && !user && <Login handleLogin={handleLogin} />}</main>
  );
}
