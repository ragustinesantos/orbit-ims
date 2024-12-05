'use client';

import React, { ReactNode } from 'react';
import {useContext, createContext, useState, useEffect} from 'react';
import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import {auth} from './firebase';


interface AuthContextType {
  user: User | null;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  firebaseSignOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signInWithEmail: async () => false,
  firebaseSignOut: async () => {}
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('logged in ' + user);
      return true;
    } catch (error : any) {
      console.log(error.code);
      console.log(error.message);
      return false;
    }
  };

  const firebaseSignOut = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithEmail,
        firebaseSignOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within an AuthContextProvider');
  }
  return context;
};