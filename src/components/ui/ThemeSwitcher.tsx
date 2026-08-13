'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { THEMES, THEME_IDS } from '@/lib/themes';
import { Radio, ChevronDown } from 'lucide-react';

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
      <div className="h-8 w-28 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] opacity-40" />
    );
  }

  const currentConfig = THEMES[theme] || THEMES.void;

  return (
    <div ref={dropdownRef} className="relative inline-block font-mono text-xs select-none">
      {/* Frequency Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-overlay)] px-3 py-1.5 backdrop-blur-md transition-all duration-300 hover:border-[var(--accent-primary)] hover:shadow-glow-sm cursor-pointer"
        aria-label="Select Frequency"
        aria-expanded={isOpen}
      >
        <span
          className="h-1.5 w-1.5 rounded-full transition-colors duration-500"
          style={{ backgroundColor: currentConfig.accent, boxShadow: `0 0 6px ${currentConfig.accent}` }}
        />
        <span className="text-[10px] text-[var(--text-muted)] tracking-wider">FREQ //</span>
        <span className="tracking-wider uppercase text-[var(--text-primary)] font-bold">
          {currentConfig.name}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-[var(--text-muted)] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[var(--accent-primary)]' : ''
          }`}
        />
      </button>

      {/* Frequency Selector Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded border border-[var(--border-glow)] bg-[var(--bg-secondary)] p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1 mb-1 border-b border-[var(--border-subtle)]">
            <p className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1">
              <Radio className="h-2.5 w-2.5 text-[var(--accent-primary)]" />
              CHOOSE FREQUENCY
            </p>
          </div>

          <div className="space-y-0.5">
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
                  className={`w-full flex items-center justify-between rounded px-2.5 py-1.5 text-left transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: item.accent,
                        boxShadow: isActive ? `0 0 8px ${item.accent}` : 'none',
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="font-bold tracking-wider text-xs">{item.name}</span>
                      {isHeritage && (
                        <span className="text-[8px] text-[var(--accent-primary)] tracking-widest uppercase">
                          ORIGINAL
                        </span>
                      )}
                    </div>
                  </div>
                  {isActive && (
                    <span className="text-[8px] text-[var(--accent-primary)] font-bold tracking-widest">
                      ACTIVE
                    </span>
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
