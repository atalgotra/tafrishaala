'use client';

import React from 'react';
import { MediaProvenance } from '@/lib/humanExperienceData';

interface ExperienceMediaFrameProps {
  media?: MediaProvenance;
  index: string;
  opacity?: number;
  scale?: number;
  blur?: number;
}

export function ExperienceMediaFrame({
  media,
  index,
  opacity = 1,
  scale = 1,
  blur = 0,
}: ExperienceMediaFrameProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none will-change-transform flex items-center justify-end pr-8 lg:pr-20"
      style={{
        opacity,
        transform: `scale(${scale})`,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        transition: 'filter 0.1s linear',
      }}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. PHOTOGRAPHIC LAYER (If Authentic Photo Available)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {media?.image ? (
        <div className="relative w-full max-w-2xl aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl bg-[var(--bg-secondary)]">
          <img
            src={media.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,var(--bg-primary)_100%)] opacity-70" />
          
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-[var(--bg-overlay)] backdrop-blur-md border border-[var(--border-subtle)] font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
            {media.assetSource.toUpperCase()} // AUTHENTIC
          </div>
        </div>
      ) : (
        /* ───────────────────────────────────────────────────────────── */
        /* 2. OPEN MONUMENTAL EDITORIAL BACKDROP (No Card, No Box/Lines) */
        /* ───────────────────────────────────────────────────────────── */
        <div className="relative w-full max-w-3xl h-[420px] flex items-center justify-end overflow-hidden">
          {/* Subtle Atmospheric Radial Glow */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[var(--border-glow)] blur-3xl opacity-20 pointer-events-none" />

          {/* Monumental Watermark Index (Open, Restrained Luxury) */}
          <div className="font-display text-[200px] lg:text-[280px] font-black text-[var(--text-primary)] opacity-[0.04] select-none pointer-events-none leading-none tracking-tighter mr-8">
            {index}
          </div>
        </div>
      )}
    </div>
  );
}
