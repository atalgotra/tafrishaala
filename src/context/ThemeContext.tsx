'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeConfig, ThemeId } from '@/types';
import { DEFAULT_THEME, THEMES, THEME_IDS } from '@/lib/themes';

interface ThemeContextValue {
  theme: ThemeId;
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemeId) => void;
  cycleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'tafrishaala_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeId;
      if (stored && THEME_IDS.includes(stored)) {
        setThemeState(stored);
        document.documentElement.setAttribute('data-theme', stored);
      } else {
        document.documentElement.setAttribute('data-theme', DEFAULT_THEME);
      }
    } catch {
      document.documentElement.setAttribute('data-theme', DEFAULT_THEME);
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: ThemeId) => {
    if (!THEME_IDS.includes(newTheme)) return;
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn('Unable to persist theme to localStorage', e);
    }
  };

  const cycleTheme = () => {
    const currentIndex = THEME_IDS.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEME_IDS.length;
    setTheme(THEME_IDS[nextIndex]);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig: THEMES[theme] || THEMES.void,
        setTheme,
        cycleTheme,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
