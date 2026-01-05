'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themes, ThemeColors, ThemeId } from '@/lib/themes';
import { translations, Language, TranslationKey } from '@/lib/translations';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AppContextType {
  // Theme
  theme: ThemeColors;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('dark');
  const [language, setLanguage] = useState<Language>('es');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as ThemeId;
      const savedLanguage = localStorage.getItem('language') as Language;
      
      if (savedTheme && themes[savedTheme]) {
        setThemeId(savedTheme);
      }
      if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  
  // Save preferences to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', themeId);
      localStorage.setItem('language', language);
    }
  }, [themeId, language]);
  
  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  
  const value: AppContextType = {
    theme: themes[themeId],
    themeId,
    setThemeId,
    language,
    setLanguage,
    t,
    user,
    setUser,
    loading,
    signOut,
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Convenience hooks
export function useTheme() {
  const { theme, themeId, setThemeId } = useApp();
  return { theme, themeId, setThemeId };
}

export function useLanguage() {
  const { language, setLanguage, t } = useApp();
  return { language, setLanguage, t };
}

export function useTranslation() {
  const { t, language, setLanguage } = useApp();
  return { t, language, setLanguage };
}

export function useAuth() {
  const { user, setUser, loading, signOut } = useApp();
  return { user, setUser, loading, signOut };
}
