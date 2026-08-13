'use client';

import React, { useRef } from 'react';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Sparkles, ArrowDown, Activity, Zap, Compass } from 'lucide-react';

const MANIFESTO_PILLARS = [
  {
    index: '01',
    code: 'LEGACY_PARADOX',
    title: 'The Static Syllabus',
    description:
      'Traditional degree programs freeze curriculum for 4–5 years while foundational technology models shift every few months. Passive memorization is obsolete.',
    icon: Compass,
  },
  {
    index: '02',
    code: 'VELOCITY_GAP',
    title: 'The Real-Time Delta',
    description:
      'The chasm between academic coding and production creative technology expands exponentially. Theoretical knowledge without continuous deployment falls behind.',
    icon: Zap,
  },
  {
    index: '03',
    code: 'TAFRISHAALA_MODEL',
    title: 'The Continuous Frequency',
    description:
      'An evolving ecosystem designed for real-time skill synthesis. Direct mastery of autonomous AI, spatial web, and high-performance creative engineering.',
    icon: Activity,
  },
];

export function FutureStatementSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const tagRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const narrativeRef = useRef<HTMLParagraphElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const handoffRef = useRef<HTMLDivElement | null>(null);

  const prefersReducedMotion = useReducedMotion();

  useGsap(
    () => {
      if (prefersReducedMotion || !sectionRef.current) return;

      const cards = cardsContainerRef.current?.querySelectorAll('.manifesto-card');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power3.out' },
      });

      // 1. Tag Entrance
      tl.fromTo(
        tagRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        0
      )
        // 2. Primary Headline Kinetic Focus (Scale & De-blur)
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 35, scale: 0.97, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            clearProps: 'filter',
            duration: 0.7,
            ease: 'power3.out',
          },
          0.1
        )
        // 3. Editorial Narrative Sub-copy
        .fromTo(
          narrativeRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.2
        );

      // 4. Staggered Manifesto Array Reveal (All 3 tiles settle to identical 100% sharpness)
      if (cards && cards.length > 0) {
        tl.fromTo(
          cards,
          {
            opacity: 0,
            y: 40,
            scale: 0.97,
            filter: 'blur(6px)',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            clearProps: 'filter',
            stagger: 0.12,
            duration: 0.7,
            ease: 'power3.out',
          },
          0.3
        );
      }

      // 5. Section 03 Handoff Bar
      tl.fromTo(
        handoffRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4 },
        0.65
      );
    },
    sectionRef,
    [prefersReducedMotion]
  );

  return (
    <section
      ref={sectionRef}
      id="statement"
      aria-label="Future Statement Section"
      className="relative z-20 flex min-h-screen w-full flex-col justify-center border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] px-6 py-32 lg:px-12"
      style={{ perspective: '1200px' }}
    >
      {/* Background Subtle Spatial Coordinate Accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(to_right,var(--text-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--text-primary)_1px,transparent_1px)] [background-size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      />

      <div className="mx-auto max-w-7xl w-full flex flex-col items-start justify-center">
        {/* Section 02 Tag */}
        <div
          ref={tagRef}
          className="mb-6 font-mono text-[11px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold flex items-center gap-2 will-change-transform"
        >
          <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
          // 02 STATEMENT : THE PARADIGM SHIFT
        </div>

        {/* Primary Editorial Headline */}
        <h2
          ref={headlineRef}
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[var(--text-primary)] leading-[0.95] max-w-6xl will-change-transform"
        >
          Technology changes every day.
          <br />
          <span className="text-gradient-theme">Your skills should too.</span>
        </h2>

        {/* Core Manifesto Narrative */}
        <p
          ref={narrativeRef}
          className="mt-8 max-w-3xl text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-sans will-change-transform"
        >
          The half-life of software knowledge is shrinking at an unprecedented velocity. Traditional education freezes curriculum for years, while creative technology accelerates weekly. Tafrishaala is engineered to move you from passive observer to active builder at the bleeding edge.
        </p>

        {/* 3-Pillar Comparative Paradigm Matrix (All 3 tiles equal clarity) */}
        <div
          ref={cardsContainerRef}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 w-full"
        >
          {MANIFESTO_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.index}
                className="manifesto-card group relative flex flex-col justify-between rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 lg:p-8 transition-all duration-300 hover:border-[var(--border-glow)] hover:bg-[var(--bg-secondary)] will-change-transform"
              >
                {/* Card Top Metadata */}
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 font-mono text-[10px] text-[var(--text-muted)]">
                    <span className="text-[var(--accent-primary)] font-bold">{pillar.index}</span>
                    <span className="tracking-widest uppercase">{pillar.code}</span>
                    <Icon className="h-3.5 w-3.5 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors duration-200" />
                  </div>

                  {/* Pillar Title */}
                  <h3 className="mt-6 font-display text-lg lg:text-xl font-bold tracking-tight text-[var(--text-primary)]">
                    {pillar.title}
                  </h3>

                  {/* Pillar Description */}
                  <p className="mt-3 text-xs lg:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>

                {/* Card Bottom Fine Border Accent */}
                <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] font-mono text-[9px] text-[var(--text-muted)] flex items-center justify-between">
                  <span>STATUS: ACTIVE</span>
                  <span className="h-1 w-1 rounded-full bg-[var(--accent-primary)] opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Section 03 Handoff Bar */}
        <div
          ref={handoffRef}
          className="mt-16 w-full flex flex-col sm:flex-row items-center justify-between border-t border-[var(--border-subtle)] pt-8 font-mono text-xs text-[var(--text-muted)] gap-4 will-change-transform"
        >
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="tracking-widest uppercase">FREQUENCY CALIBRATION PROTOCOL</span>
          </div>

          <MagneticButton
            variant="primary"
            cursorText="CHOOSE"
            className="px-6 py-2.5 text-[11px]"
            onClick={() => {
              const el = document.getElementById('frequency');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            CHOOSE YOUR FREQUENCY <ArrowDown className="h-3.5 w-3.5 ml-1 inline" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
