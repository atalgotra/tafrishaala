export type ThemeId = 'void' | 'cyber' | 'neon' | 'aurora' | 'solar' | 'heritage';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  accent: string;
  secondary: string;
  bgPrimary: string;
  bgSecondary: string;
  glow: string;
  particleColor: string;
  borderSubtle: string;
  borderGlow: string;
  textColor: string;
  textSecondary: string;
  textMuted: string;
}

export type CursorMode = 'default' | 'pointer' | 'magnetic' | 'text' | 'hidden' | 'explore';

export interface CursorState {
  mode: CursorMode;
  text?: string;
  targetEl?: HTMLElement | null;
}

export interface SectionMeta {
  id: string;
  index: string;
  title: string;
  tagline: string;
}
