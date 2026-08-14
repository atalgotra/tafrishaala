'use client';

import React, { useRef } from 'react';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';
import { MagneticButton } from '@/components/ui/MagneticButton';
import {
  Sparkles,
  ArrowDown,
  Activity,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Radio,
  Layers,
} from 'lucide-react';

const SIMPLE_PILLARS = [
  {
    index: '01',
    title: 'Always Current',
    description: 'Learn today’s tools and AI workflows, not 5-year-old textbooks.',
    icon: Activity,
  },
  {
    index: '02',
    title: 'Real Portfolio',
    description: 'Build and deploy actual apps and interactive projects you can show off.',
    icon: Cpu,
  },
  {
    index: '03',
    title: 'Studio Mentorship',
    description: 'Build side-by-side with experienced creators in our Noida studio or online.',
    icon: Layers,
  },
];

export function FutureStatementSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const tagRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const narrativeRef = useRef<HTMLParagraphElement | null>(null);
  const matrixContainerRef = useRef<HTMLDivElement | null>(null);
  const metricsContainerRef = useRef<HTMLDivElement | null>(null);
  const handoffRef = useRef<HTMLDivElement | null>(null);

  const prefersReducedMotion = useReducedMotion();

  useGsap(
    () => {
      if (prefersReducedMotion || !sectionRef.current) return;

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
        // 2. Primary Headline Focus
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 30, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            clearProps: 'filter',
            duration: 0.7,
          },
          0.1
        )
        // 3. Editorial Narrative Sub-copy
        .fromTo(
          narrativeRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.2
        )
        // 4. Matrix Comparison Deck
        .fromTo(
          matrixContainerRef.current?.children || [],
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.12,
            duration: 0.6,
          },
          0.25
        )
        // 5. Metrics Cards Strip
        .fromTo(
          metricsContainerRef.current?.children || [],
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
          },
          0.45
        )
        // 6. Section Handoff Bar
        .fromTo(
          handoffRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4 },
          0.6
        );
    },
    sectionRef,
    [prefersReducedMotion]
  );

  const handleScrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="statement"
      aria-label="Why Tafrishaala Section"
      className="relative z-20 flex w-full flex-col justify-center border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] px-6 py-16 lg:py-20 lg:px-12"
      style={{ perspective: '1200px' }}
    >
      {/* Background Spatial Grid Accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(to_right,var(--text-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--text-primary)_1px,transparent_1px)] [background-size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      />

      <div className="mx-auto max-w-7xl w-full flex flex-col items-start justify-center">
        {/* Section Tag */}
        <div
          ref={tagRef}
          className="mb-3 font-mono text-[11px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold flex items-center gap-2 will-change-transform"
        >
          <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
          // 02 WHY TAFRISHAALA
        </div>

        {/* Primary Headline */}
        <h2
          ref={headlineRef}
          className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.02] max-w-4xl will-change-transform"
        >
          Technology changes every day.
          <br />
          <span className="text-gradient-theme">Your skills should too.</span>
        </h2>

        {/* Human, Punchy Subtitle */}
        <p
          ref={narrativeRef}
          className="mt-4 max-w-2xl text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-sans will-change-transform font-normal"
        >
          Traditional courses teach yesterday’s tools. We teach you how to build what’s happening right now with real projects, modern AI, and direct mentorship.
        </p>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* SIMPLE & CLEAR COMPARISON DECK                                */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          ref={matrixContainerRef}
          className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 w-full"
        >
          {/* Card 1: Old Way */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-7 transition-all duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 font-mono text-[10px] text-[var(--text-muted)]">
                <span className="font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  THE OLD WAY
                </span>
                <span className="px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[9px] uppercase tracking-widest text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  TRADITIONAL COURSES
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-secondary)]">
                Outdated & Passive
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Stuck in memorizing theory and textbook exams that haven't changed in years.
              </p>

              <div className="mt-5 space-y-2.5 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-2.5">
                  <XCircle className="h-4 w-4 text-red-500/70 shrink-0" />
                  <span>Years spent on outdated theory and memorization</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <XCircle className="h-4 w-4 text-red-500/70 shrink-0" />
                  <span>Toy assignments that never get launched online</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <XCircle className="h-4 w-4 text-red-500/70 shrink-0" />
                  <span>No real-world AI, 3D web, or modern engineering</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-muted)] flex items-center justify-between">
              <span>RESULT</span>
              <span className="text-red-400 font-semibold">Unprepared for Modern Tech</span>
            </div>
          </div>

          {/* Card 2: Tafrishaala Way */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-glow)] bg-[var(--bg-secondary)] p-6 sm:p-7 transition-all duration-200 shadow-glow-sm">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 font-mono text-[10px]">
                <span className="font-bold uppercase tracking-wider text-[var(--accent-primary)] flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
                  THE TAFRISHAALA WAY
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/15 text-[9px] uppercase tracking-widest text-[var(--accent-primary)] font-bold border border-[var(--accent-primary)]/30">
                  HANDS-ON CREATION
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Build Real Things from Day 1
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Master modern engineering, AI tools, and creative technology by making real projects.
              </p>

              <div className="mt-5 space-y-2.5 text-xs text-[var(--text-primary)]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent-primary)] shrink-0" />
                  <span>Always updated with the tools top tech teams actually use</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent-primary)] shrink-0" />
                  <span>Build real production apps and AI workflows for your portfolio</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent-primary)] shrink-0" />
                  <span>Direct mentorship in our Noida studio or live online</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-muted)] flex items-center justify-between">
              <span className="text-[var(--accent-primary)] font-medium">OUTCOME</span>
              <span className="text-[var(--accent-primary)] font-bold">Ready to Build the Future</span>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3 CRISP ADVANTAGE CARDS                                       */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          ref={metricsContainerRef}
          className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-3 w-full"
        >
          {SIMPLE_PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.index}
                className="group flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 transition-all duration-200 hover:border-[var(--accent-primary)]/40 hover:bg-[var(--bg-secondary)]"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 font-mono text-[10px] text-[var(--text-muted)]">
                  <span className="text-[var(--accent-primary)] font-bold">0{item.index}</span>
                  <Icon className="h-3.5 w-3.5 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors" />
                </div>
                <h4 className="mt-2.5 font-display text-sm font-bold text-[var(--text-primary)]">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* CLEAN CALL TO ACTION                                          */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          ref={handoffRef}
          className="mt-8 w-full flex flex-col sm:flex-row items-center justify-between border-t border-[var(--border-subtle)] pt-5 font-mono text-xs text-[var(--text-muted)] gap-3 will-change-transform"
        >
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <span className="tracking-wider uppercase font-medium">
              SEE WHAT YOU WILL LEARN
            </span>
          </div>

          <MagneticButton
            variant="primary"
            cursorText="BUILD"
            className="px-6 py-2.5 text-xs font-bold rounded-full shadow-glow-sm"
            onClick={() => handleScrollToSection('build')}
          >
            WHAT DO YOU WANT TO BUILD? <ArrowDown className="h-3.5 w-3.5 ml-1.5 inline" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

