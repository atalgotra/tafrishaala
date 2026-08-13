'use client';

import React from 'react';
import { FadeUp } from '@/components/ui/FadeUp';
import { SplitText } from '@/components/ui/SplitText';

export function FrequencySection() {
  return (
    <section
      id="frequency"
      aria-label="Choose Your Frequency Section"
      className="relative z-10 flex min-h-[50vh] w-full flex-col justify-center border-t border-[var(--border-subtle)] px-6 py-20 lg:px-12"
    >
      <div className="mx-auto max-w-7xl w-full">
        <div className="mb-4 font-mono text-[11px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold">
          // 03 FREQUENCY
        </div>

        <SplitText
          as="h2"
          splitType="words"
          className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)]"
        >
          Choose Your Frequency.
        </SplitText>

        <FadeUp delay={0.15} className="mt-4 max-w-xl text-base text-[var(--text-secondary)] leading-relaxed font-sans">
          Calibrated tracks designed for continuous acceleration. Select the domain, intensity, and rhythm that matches your trajectory.
        </FadeUp>
      </div>
    </section>
  );
}
