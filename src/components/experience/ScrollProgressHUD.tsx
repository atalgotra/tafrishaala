'use client';

import React, { useEffect, useState } from 'react';

const SECTION_IDS = [
  'hero',
  'statement',
  'build',
  'journey',
  'worlds',
  'tracks',
  'method',
  'experience',
  'cta',
];

export function ScrollProgressHUD() {
  const [progress, setProgress] = useState(0);
  const [sectionIndex, setSectionIndex] = useState('01');

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const current = window.scrollY;
      const pct = Math.min(100, Math.max(0, (current / totalHeight) * 100));
      setProgress(Math.round(pct));

      // Deterministic max-visible-area section detection
      const vh = window.innerHeight;
      let maxVisible = -1;
      let activeIndex = 0;

      for (let i = 0; i < SECTION_IDS.length; i++) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(vh, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);

          if (visibleHeight > maxVisible) {
            maxVisible = visibleHeight;
            activeIndex = i;
          }
        }
      }

      setSectionIndex((activeIndex + 1).toString().padStart(2, '0'));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <aside
      aria-label="Scroll Indicator"
      className="pointer-events-none fixed bottom-8 right-8 z-40 hidden md:flex items-center gap-3 font-mono text-[10px] tracking-widest select-none text-[var(--text-secondary)]"
    >
      <div className="flex items-center gap-1 border border-[var(--border-subtle)] bg-[var(--bg-overlay)] px-2.5 py-1 rounded backdrop-blur-md">
        <span className="text-[var(--accent-primary)] font-bold">{sectionIndex}</span>
        <span className="text-[var(--border-subtle)]">/</span>
        <span className="text-[var(--text-muted)]">09</span>
        <span className="text-[var(--border-subtle)] mx-1">|</span>
        <span className="text-[var(--text-primary)] min-w-[28px] text-right font-medium">
          {progress}%
        </span>
      </div>

      <div className="relative h-8 w-[1.5px] bg-[var(--border-subtle)] rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full bg-[var(--accent-primary)] transition-all duration-150"
          style={{ height: `${progress}%` }}
        />
      </div>
    </aside>
  );
}
