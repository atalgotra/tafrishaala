'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { THEMES, THEME_IDS } from '@/lib/themes';
import { Palette, Sparkles, ChevronDown, Check } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme, mounted } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-32 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] opacity-40" />
    );
  }

  const currentConfig = THEMES[theme] || THEMES.heritage;

  return (
    <div ref={dropdownRef} className="relative inline-block select-none">
      {/* World-Class Theme Trigger Capsule */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-overlay)] px-3 py-1.5 backdrop-blur-xl transition-all duration-300 hover:border-[var(--accent-primary)] hover:shadow-glow-sm cursor-pointer"
        aria-label="Select Theme Atmosphere"
        aria-expanded={isOpen}
      >
        {/* Ambient Theme Color Indicator */}
        <div className="flex items-center gap-1.5">
          <Palette className="h-3.5 w-3.5 text-[var(--accent-primary)] transition-transform duration-300 group-hover:rotate-12" />
          <span
            className="h-2 w-2 rounded-full transition-colors duration-500 animate-pulse"
            style={{
              backgroundColor: currentConfig.accent,
              boxShadow: `0 0 8px ${currentConfig.accent}`,
            }}
          />
        </div>

        {/* Theme Name */}
        <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[var(--text-primary)]">
          {currentConfig.name}
        </span>

        <ChevronDown
          className={`h-3 w-3 text-[var(--text-muted)] transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-[var(--accent-primary)]' : 'group-hover:text-[var(--text-primary)]'
          }`}
        />
      </button>

      {/* Atmospheric Theme Deck Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-[var(--border-glow)] bg-[var(--bg-secondary)] p-2 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-3xl z-50 animate-in fade-in zoom-in-95 duration-200">
          {/* Deck Header */}
          <div className="flex items-center justify-between px-3 py-2 mb-1.5 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase">
              <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
              <span>SELECT ATMOSPHERE</span>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--accent-primary)] border border-[var(--border-subtle)]">
              {THEME_IDS.length} THEMES
            </span>
          </div>

          {/* Theme Palette Cards */}
          <div className="space-y-1.5">
            {THEME_IDS.map((id) => {
              const item = THEMES[id];
              const isActive = theme === id;
              const isHeritage = id === 'heritage';

              return (
                <button
                  key={id}
                  onClick={() => {
                    setTheme(id);
                    setIsOpen(false);
                  }}
                  className={`w-full group/card flex items-center justify-between rounded-xl p-2 text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[var(--bg-surface)] border border-[var(--border-glow)] shadow-glow-sm'
                      : 'hover:bg-[var(--bg-surface)]/70 border border-transparent hover:border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* 3-Color Palette Swatch Strip */}
                    <div className="flex items-center gap-0.5 p-1 rounded-lg bg-[var(--bg-primary)]/90 border border-[var(--border-subtle)] shrink-0 shadow-inner">
                      <span
                        className="h-4 w-2 rounded-sm"
                        style={{ backgroundColor: item.accent }}
                      />
                      <span
                        className="h-4 w-2 rounded-sm"
                        style={{ backgroundColor: item.secondary }}
                      />
                      <span
                        className="h-4 w-2 rounded-sm"
                        style={{ backgroundColor: item.bgSecondary }}
                      />
                    </div>

                    {/* Theme Details */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-bold tracking-wide text-xs text-[var(--text-primary)]">
                          {item.name}
                        </span>
                        {isHeritage && (
                          <span className="text-[8px] font-mono font-bold px-1 py-0.2 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] tracking-widest uppercase border border-[var(--accent-primary)]/30">
                            SIGNATURE
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] truncate group-hover/card:text-[var(--text-secondary)] transition-colors">
                        {item.tagline}
                      </span>
                    </div>
                  </div>

                  {/* Active Check Indicator */}
                  {isActive && (
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full shrink-0 shadow-glow-sm"
                      style={{
                        backgroundColor: item.accent,
                        color: item.bgPrimary,
                      }}
                    >
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
