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

const VELOCITY_METRICS = [
  {
    index: '01',
    code: 'METRIC // VELOCITY',
    title: 'Continuous Synthesis',
    description: 'Weekly stack integration vs. traditional 4-year frozen curriculum.',
    icon: Activity,
  },
  {
    index: '02',
    code: 'METRIC // CRAFT',
    title: '100% Production Grade',
    description: 'Autonomous AI agents & spatial systems vs. toy homework code.',
    icon: Cpu,
  },
  {
    index: '03',
    code: 'METRIC // ACCESS',
    title: 'Noida Studio & Hybrid',
    description: 'Collaborative in-person creative studio + 24/7 digital lab access.',
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
        // 2. Primary Headline Kinetic Focus
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
      aria-label="Future Statement Section"
      className="relative z-20 flex w-full flex-col justify-center border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] px-6 py-20 lg:py-24 lg:px-12"
      style={{ perspective: '1200px' }}
    >
      {/* Background Spatial Grid Accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(to_right,var(--text-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--text-primary)_1px,transparent_1px)] [background-size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      />

      <div className="mx-auto max-w-7xl w-full flex flex-col items-start justify-center">
        {/* Section 02 Tag */}
        <div
          ref={tagRef}
          className="mb-4 font-mono text-[11px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold flex items-center gap-2 will-change-transform"
        >
          <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
          // 02 STATEMENT : THE PARADIGM SHIFT
        </div>

        {/* Primary Editorial Headline */}
        <h2
          ref={headlineRef}
          className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[var(--text-primary)] leading-[0.98] max-w-5xl will-change-transform"
        >
          Technology changes every day.
          <br />
          <span className="text-gradient-theme">Your skills should too.</span>
        </h2>

        {/* Core Manifesto Narrative */}
        <p
          ref={narrativeRef}
          className="mt-5 max-w-3xl text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans will-change-transform"
        >
          The half-life of software knowledge is shrinking at an unprecedented velocity. Traditional education freezes curriculum for years, while creative technology accelerates weekly. Tafrishaala is engineered to move you from passive observer to active builder at the bleeding edge.
        </p>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* INTERACTIVE SPLIT-SPECTRUM PARADIGM MATRIX                    */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          ref={matrixContainerRef}
          className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 w-full"
        >
          {/* Card 1: The Legacy Paradox */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 transition-all duration-300 hover:border-[var(--border-subtle)]/80 backdrop-blur-md">
            <div>
              {/* Card Top Metadata */}
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3.5 font-mono text-[10px] text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  <span className="font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    01 // TRADITIONAL ACADEMIA
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[9px] uppercase tracking-widest text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  STATIC SYLLABUS
                </span>
              </div>

              {/* Title & Concept */}
              <h3 className="mt-5 font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                The 4-Year Freeze
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Curriculum locked in bureaucratic review cycles while foundational models and creative stacks shift weekly.
              </p>

              {/* Comparison Checkpoints */}
              <div className="mt-6 space-y-2.5 text-xs text-[var(--text-secondary)] font-mono">
                <div className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-red-500/70 shrink-0 mt-0.5" />
                  <span>4–5 year static degree syllabus with theoretical memorization</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-red-500/70 shrink-0 mt-0.5" />
                  <span>Toy homework assignments with zero real production traffic</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-red-500/70 shrink-0 mt-0.5" />
                  <span>Zero hands-on exposure to autonomous AI agents & WebGL 3D</span>
                </div>
              </div>
            </div>

            {/* Footer Telemetry */}
            <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-muted)] flex items-center justify-between">
              <span>LEGACY OBSOLESCENCE: HIGH</span>
              <span className="text-red-500/80 font-bold">FALLING BEHIND</span>
            </div>
          </div>

          {/* Card 2: The Tafrishaala Model */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-glow)] bg-[var(--bg-secondary)] p-6 sm:p-8 transition-all duration-300 hover:shadow-glow-md backdrop-blur-xl shadow-glow-sm">
            <div>
              {/* Card Top Metadata */}
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3.5 font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <Radio className="h-3.5 w-3.5 text-[var(--accent-primary)] animate-pulse" />
                  <span className="font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                    02 // TAFRISHAALA LABS
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/15 text-[9px] uppercase tracking-widest text-[var(--accent-primary)] font-bold border border-[var(--accent-primary)]/30">
                  LIVING FREQUENCY
                </span>
              </div>

              {/* Title & Concept */}
              <h3 className="mt-5 font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                The Real-Time Synthesis Engine
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                An evolving creative tech ecosystem engineered for continuous hands-on creation, deployment, and mastery.
              </p>

              {/* Comparison Checkpoints */}
              <div className="mt-6 space-y-2.5 text-xs text-[var(--text-primary)] font-mono">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                  <span>Continuous weekly curriculum synthesis with cutting-edge production stacks</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                  <span>100% project-based building with live interactive deployments from Day 1</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                  <span>Direct mastery of Autonomous AI, Spatial 3D WebGL, and Creative Engineering</span>
                </div>
              </div>
            </div>

            {/* Footer Telemetry */}
            <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-muted)] flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[var(--accent-primary)] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-ping" />
                ACTIVE 2026 SYNTHESIS
              </span>
              <span className="text-[var(--accent-primary)] font-bold">BLEEDING EDGE</span>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3-COLUMN VELOCITY METRICS STRIP                               */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          ref={metricsContainerRef}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 w-full"
        >
          {VELOCITY_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.index}
                className="group relative flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 transition-all duration-200 hover:border-[var(--accent-primary)]/50 hover:bg-[var(--bg-secondary)]"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 font-mono text-[9px] text-[var(--text-muted)]">
                  <span className="text-[var(--accent-primary)] font-bold">{metric.index}</span>
                  <span className="tracking-widest uppercase">{metric.code}</span>
                  <Icon className="h-3 w-3 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors" />
                </div>
                <h4 className="mt-3 font-display text-sm font-bold text-[var(--text-primary)]">
                  {metric.title}
                </h4>
                <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)] leading-relaxed group-hover:text-[var(--text-secondary)] transition-colors">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* STREAMLINED SECTION HANDOFF BAR                                */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          ref={handoffRef}
          className="mt-10 w-full flex flex-col sm:flex-row items-center justify-between border-t border-[var(--border-subtle)] pt-6 font-mono text-xs text-[var(--text-muted)] gap-4 will-change-transform"
        >
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <span className="tracking-widest uppercase font-semibold">
              TECHNOLOGY WORLDS & ECOSYSTEMS
            </span>
          </div>

          <MagneticButton
            variant="primary"
            cursorText="WORLDS"
            className="px-6 py-2.5 text-[11px] font-bold rounded-full shadow-glow-sm"
            onClick={() => handleScrollToSection('worlds')}
          >
            EXPLORE TECHNOLOGY WORLDS <ArrowDown className="h-3.5 w-3.5 ml-1.5 inline" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
