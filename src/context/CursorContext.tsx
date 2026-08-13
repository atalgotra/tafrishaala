'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CursorMode, CursorState } from '@/types';

interface CursorContextValue {
  cursorState: CursorState;
  setCursorMode: (mode: CursorMode, text?: string, targetEl?: HTMLElement | null) => void;
  resetCursor: () => void;
}

const CursorContext = createContext<CursorContextValue | null>(null);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: 'default',
    text: undefined,
    targetEl: null,
  });

  const setCursorMode = useCallback(
    (mode: CursorMode, text?: string, targetEl?: HTMLElement | null) => {
      setCursorState({ mode, text, targetEl: targetEl || null });
    },
    []
  );

  const resetCursor = useCallback(() => {
    setCursorState({ mode: 'default', text: undefined, targetEl: null });
  }, []);

  return (
    <CursorContext.Provider value={{ cursorState, setCursorMode, resetCursor }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
}
