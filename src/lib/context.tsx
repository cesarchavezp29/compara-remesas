'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themes, ThemeColors, ThemeId } from '@/lib/themes';
import { translations, Language, TranslationKey } from '@/lib/translations';

interface AppContextType {
  // Theme
  theme: ThemeColors;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  
  // User preferences
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('dark');
  const [language, setLanguage] = useState<Language>('es');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
  
  const value: AppContextType = {
    theme: themes[themeId],
    themeId,
    setThemeId,
    language,
    setLanguage,
    t,
    isAuthenticated,
    setIsAuthenticated,
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
