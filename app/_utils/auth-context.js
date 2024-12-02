'use client';

import React from 'react';
import {useContext, createContext, useState, useEffect} from 'react';
import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {auth} from './firebase';

const AuthContext = createContext({
  user: null,
  signInWithEmail: async () => false,
  firebaseSignOut: async () => {}
});

export const AuthContextProvider = ({children}) => {
  const [user, setUser] = useState(null);

  const signInWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('logged in ' + user);
      return true;
    } catch (error) {
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