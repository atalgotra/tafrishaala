'use client';

import React, { useRef } from 'react';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';
import { Sparkles, BookOpen, Terminal, Hammer, Rocket } from 'lucide-react';

const JOURNEY_STAGES = [
  {
    index: '01',
    name: 'LEARN',
    tagline: 'Understand the foundations',
    description:
      'Build a strong conceptual base. Master core principles, architectural patterns, and foundational logic.',
    icon: BookOpen,
  },
  {
    index: '02',
    name: 'PRACTICE',
    tagline: 'Turn concepts into skill',
    description:
      'Apply what you learn through hands-on technical exercises, real-time feedback, and practical problem solving.',
    icon: Terminal,
  },
  {
    index: '03',
    name: 'BUILD',
    tagline: 'Create real projects',
    description:
      'Design, engineer, and refine end-to-end applications from scratch. Test edge cases and elevate your craft.',
    icon: Hammer,
  },
  {
    index: '04',
    name: 'DEPLOY',
    tagline: 'Ship to the real world',
    description:
      'Take your work beyond the classroom. Launch live projects, build your portfolio, and share what you create.',
    icon: Rocket,
  },
];

export function LearningJourneySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const conduitLineRef = useRef<SVGLineElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const bridgeRef = useRef<HTMLDivElement | null>(null);

  const prefersReducedMotion = useReducedMotion();

  useGsap(
    () => {
      if (prefersReducedMotion || !sectionRef.current) return;

      const cards = cardsContainerRef.current?.querySelectorAll('.journey-card');
      const nodes = cardsContainerRef.current?.querySelectorAll('.conduit-node');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // 1. Header entrance
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, ease: 'power3.out', duration: 0.5 },
        0
      );

      // 2. Horizontal Energy Conduit Line Expansion
      if (conduitLineRef.current) {
        tl.fromTo(
          conduitLineRef.current,
          { strokeDashoffset: 1000, opacity: 0.3 },
          { strokeDashoffset: 0, opacity: 1, ease: 'power2.inOut', duration: 0.8 },
          0.1
        );
      }

      // 3. Staggered Card & Node Illumination (All 4 cards illuminate fully to 100% opacity)
      if (cards && cards.length > 0) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            ease: 'power3.out',
            duration: 0.6,
          },
          0.2
        );
      }

      if (nodes && nodes.length > 0) {
        tl.fromTo(
          nodes,
          { scale: 0.7, opacity: 0.4 },
          {
            scale: 1,
            opacity: 1,
            stagger: 0.1,
            ease: 'back.out(1.5)',
            duration: 0.5,
          },
          0.15
        );
      }

      // 4. Narrative Bridge Handoff
      tl.fromTo(
        bridgeRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4 },
        0.6
      );
    },
    sectionRef,
    [prefersReducedMotion]
  );

  return (
    <section
      ref={sectionRef}
      id="journey"
      aria-label="Learning Journey Section"
      className="relative z-20 flex min-h-[90vh] w-full flex-col justify-center border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] px-6 py-24 lg:px-12 overflow-hidden select-none"
    >
      {/* Background Subtle Spatial Coordinate Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(to_right,var(--text-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--text-primary)_1px,transparent_1px)] [background-size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      />

      <div className="mx-auto max-w-7xl w-full flex flex-col justify-center">
        {/* Section 05 Header */}
        <div ref={headerRef} className="mb-14 will-change-transform">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[var(--accent-primary)] uppercase font-semibold flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
            // 05 THE METHODOLOGY
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)]">
            THE LEARNING JOURNEY.
          </h2>

          <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-normal">
            A continuous path designed to take you from foundational concepts to building and deploying real-world software.
          </p>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* DESKTOP HORIZONTAL CONDUIT PATH (≥ 1024px)                     */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div ref={cardsContainerRef} className="relative hidden lg:block w-full">
          {/* Energy Conduit SVG Line */}
          <div className="absolute top-[28px] left-0 w-full h-[2px] pointer-events-none z-0">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <line
                x1="4%"
                y1="50%"
                x2="96%"
                y2="50%"
                stroke="var(--border-subtle)"
                strokeWidth="1.5"
              />
              <line
                ref={conduitLineRef}
                x1="4%"
                y1="50%"
                x2="96%"
                y2="50%"
                stroke="var(--accent-primary)"
                strokeWidth="2.5"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                className="transition-all duration-75 filter drop-shadow-[0_0_8px_var(--accent-primary)]"
              />
            </svg>
          </div>

          {/* 4 Horizontal Phase Cards (Grid 4-Cols with Equal Width & Full Visibility) */}
          <div className="grid grid-cols-4 gap-5 xl:gap-6 relative z-10 w-full">
            {JOURNEY_STAGES.map((stage) => {
              const Icon = stage.icon;

              return (
                <div key={stage.index} className="flex flex-col items-start w-full">
                  {/* Energy Conduit Node */}
                  <div className="mb-6 flex items-center justify-center">
                    <div
                      className="conduit-node flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--accent-primary)] shadow-md transition-all duration-300 backdrop-blur-md"
                    >
                      <Icon className="h-5 w-5 text-[var(--accent-primary)]" />
                    </div>
                  </div>

                  {/* Stage Content Card */}
                  <div
                    className="journey-card w-full flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent-primary)] hover:bg-[var(--bg-secondary)] hover:shadow-glow-sm will-change-transform min-h-[240px]"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 font-mono text-[10px]">
                        <span className="text-[var(--accent-primary)] font-bold tracking-wider">PHASE {stage.index}</span>
                        <span className="tracking-widest uppercase text-[var(--text-muted)]">ACTIVE</span>
                      </div>

                      <h3 className="mt-4 font-display text-2xl font-black tracking-tight text-[var(--text-primary)]">
                        {stage.name}
                      </h3>

                      <p className="mt-1 font-mono text-xs text-[var(--accent-primary)] font-semibold">
                        {stage.tagline}
                      </p>

                      <p className="mt-3 font-sans text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                        {stage.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] font-mono text-[9px] text-[var(--text-muted)] flex items-center justify-between">
                      <span>STATUS: CALIBRATED</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* MOBILE / TABLET VERTICAL SPINE (< 1024px)                     */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative block lg:hidden w-full pl-6 border-l-2 border-[var(--border-subtle)] space-y-6">
          {JOURNEY_STAGES.map((stage) => {
            const Icon = stage.icon;

            return (
              <div key={stage.index} className="relative group">
                {/* Spine Node Marker */}
                <div className="absolute -left-[35px] top-4 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--accent-primary)] bg-[var(--bg-surface)] text-[var(--accent-primary)] shadow-glow-sm">
                  <Icon className="h-3.5 w-3.5" />
                </div>

                {/* Vertical Card */}
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition-all duration-300 hover:border-[var(--accent-primary)]">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 font-mono text-[10px]">
                    <span className="text-[var(--accent-primary)] font-bold">PHASE {stage.index}</span>
                    <span className="text-[var(--text-muted)] uppercase">PATH</span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-black tracking-tight text-[var(--text-primary)]">
                    {stage.name}
                  </h3>

                  <p className="mt-1 font-mono text-xs text-[var(--accent-primary)] font-semibold">
                    {stage.tagline}
                  </p>

                  <p className="mt-2 font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* SECTION 05 → SECTION 06 NARRATIVE BRIDGE                       */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          ref={bridgeRef}
          className="relative z-10 mt-14 w-full border-t border-[var(--border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between font-mono text-xs text-[var(--text-muted)] gap-4 will-change-transform"
        >
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="tracking-widest uppercase">THE DOMAIN CATALOGUE</span>
          </div>

          <span className="tracking-widest uppercase text-[10px] text-[var(--text-muted)]">
            NEXT: TECHNOLOGY WORLDS — DEEP DIVE ↓
          </span>
        </div>
      </div>
    </section>
  );
}
