'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';
import { auth, isRealFirebaseConfigured, googleProvider } from '@/lib/firebase/config';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut, signInWithPopup } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginAsDemo: (role: UserRole) => void;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (name: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  language: 'en' | 'bn';
  toggleLanguage: () => void;
}

const DEMO_USERS: Record<UserRole, UserProfile> = {
  passenger: {
    uid: 'usr_passenger_demo',
    fullName: 'Tanvir Hossain',
    email: 'passenger@eksathejabo.com',
    phone: '01712345678',
    role: 'passenger',
    preferredLanguage: 'en',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  operator: {
    uid: 'usr_operator_demo',
    fullName: 'Shamsul Alam (Green Line)',
    email: 'operator@greenline.com',
    phone: '01711547788',
    role: 'operator',
    operatorId: 'op-greenline',
    preferredLanguage: 'en',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  admin: {
    uid: 'usr_admin_demo',
    fullName: 'Super Admin Ek Sathe Jabo',
    email: 'admin@eksathejabo.com',
    phone: '01819000000',
    role: 'admin',
    preferredLanguage: 'en',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    // Check saved session in local storage
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('esj_auth_user');
      const savedLang = localStorage.getItem('esj_lang') as 'en' | 'bn';
      if (savedLang) setLanguage(savedLang);

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error(e);
        }
      } else {
        // Default to passenger demo for quick review
        setUser(DEMO_USERS.passenger);
        localStorage.setItem('esj_auth_user', JSON.stringify(DEMO_USERS.passenger));
      }
    }
    setLoading(false);

    // If real Firebase configured, attach listener
    if (isRealFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          // Sync with Firestore profile if exists
          const profile: UserProfile = {
            uid: fbUser.uid,
            fullName: fbUser.displayName || 'Passenger',
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || '',
            role: 'passenger', // Strict security: defaults to passenger
            photoURL: fbUser.photoURL || undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(profile);
          localStorage.setItem('esj_auth_user', JSON.stringify(profile));
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const loginAsDemo = (role: UserRole) => {
    const demoUser = DEMO_USERS[role];
    setUser(demoUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('esj_auth_user', JSON.stringify(demoUser));
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Check known demo emails first
    if (email === 'admin@eksathejabo.com') {
      loginAsDemo('admin');
      return { success: true };
    }
    if (email === 'operator@greenline.com') {
      loginAsDemo('operator');
      return { success: true };
    }
    if (email === 'passenger@eksathejabo.com') {
      loginAsDemo('passenger');
      return { success: true };
    }

    if (isRealFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const profile: UserProfile = {
          uid: cred.user.uid,
          fullName: cred.user.displayName || email.split('@')[0],
          email: cred.user.email || email,
          phone: '',
          role: 'passenger',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(profile);
        localStorage.setItem('esj_auth_user', JSON.stringify(profile));
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Login failed' };
      }
    }

    // Default simulated login
    const newUser: UserProfile = {
      uid: `usr_${Date.now()}`,
      fullName: email.split('@')[0],
      email,
      phone: '01700000000',
      role: 'passenger',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('esj_auth_user', JSON.stringify(newUser));
    return { success: true };
  };

  const registerWithEmail = async (name: string, email: string, phone: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // New registrations ALWAYS default to passenger role (Strict Security)
    const newUser: UserProfile = {
      uid: `usr_${Date.now()}`,
      fullName: name,
      email,
      phone,
      role: 'passenger',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('esj_auth_user', JSON.stringify(newUser));
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (isRealFirebaseConfigured && auth) {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        const profile: UserProfile = {
          uid: res.user.uid,
          fullName: res.user.displayName || 'Google User',
          email: res.user.email || '',
          phone: '',
          role: 'passenger',
          photoURL: res.user.photoURL || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(profile);
        localStorage.setItem('esj_auth_user', JSON.stringify(profile));
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }

    // Mock Google sign in
    const googleUser: UserProfile = {
      uid: `usr_google_${Date.now()}`,
      fullName: 'Habibur Rahman (Google)',
      email: 'habib.passenger@gmail.com',
      phone: '01711998877',
      role: 'passenger',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUser(googleUser);
    localStorage.setItem('esj_auth_user', JSON.stringify(googleUser));
    return { success: true };
  };

  const logout = () => {
    if (isRealFirebaseConfigured && auth) {
      fbSignOut(auth).catch(console.error);
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('esj_auth_user');
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
    setUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('esj_auth_user', JSON.stringify(updated));
    }
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'bn' : 'en';
    setLanguage(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('esj_lang', next);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginAsDemo,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        updateProfile,
        language,
        toggleLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
