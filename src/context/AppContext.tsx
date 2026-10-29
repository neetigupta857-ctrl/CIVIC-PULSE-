'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lang, DICTIONARY } from '../lib/dictionary';
import { UserSession } from '../types/incident';
import { getCurrentUser, signOutUser } from '../api/authApi';

interface AppContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof DICTIONARY['en'];
  user: UserSession | null;
  setUser: (u: UserSession | null) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (o: boolean) => void;
  logout: () => Promise<void>;
  isMounted: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [user, setUser] = useState<UserSession | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Read persisted language on the client side only after mount
    try {
      const savedLang = localStorage.getItem('civicpulse_lang') as Lang;
      if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
        setLangState(savedLang);
      }
    } catch (e) {
      console.warn('Could not read localStorage language preference:', e);
    }

    // Clean up any legacy mock auth tokens in localStorage
    try {
      localStorage.removeItem('civicpulse_current_user_v1');
    } catch {}

    // Read user session after mount from secure backend session
    getCurrentUser().then(setUser);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('civicpulse_lang', l);
    } catch (e) {
      console.warn('Could not persist language to localStorage:', e);
    }
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
  };

  // During SSR and initial hydration pass, always ensure predictable baseline dictionary
  const activeLang = isMounted ? lang : 'en';
  const t = DICTIONARY[activeLang];

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        user,
        setUser,
        isDrawerOpen,
        setIsDrawerOpen,
        logout,
        isMounted
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
