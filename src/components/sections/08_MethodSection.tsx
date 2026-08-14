'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceCapabilities } from '@/hooks/useMediaQuery';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { METHOD_PRINCIPLES, PRACTICAL_MILESTONES, MethodPrinciple } from '@/lib/tafrishaalaMethodData';
import { MethodProceduralCanvas } from '@/components/ui/MethodProceduralCanvas';
import { Compass } from 'lucide-react';

const P_INTRO_END = 0.12;
const P_PRINCIPLES_END = 0.78;

export function MethodSection() {
  const [scrollProgress, setScrollProgress] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const pinContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const { isDesktop } = useDeviceCapabilities();

  // ─────────────────────────────────────────────────────────────
  // GSAP PINNED SCROLLTRIGGER TIMELINE (Desktop Only, 500vh)
  // ─────────────────────────────────────────────────────────────
  useGsap(
    () => {
      if (prefersReducedMotion || !isDesktop || !sectionRef.current || !pinContainerRef.current) return;

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinContainerRef.current,
        scrub: 0.8,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });

      scrollTriggerInstance.current = trigger;

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);

      return () => {
        clearTimeout(timer);
        trigger.kill();
      };
    },
    sectionRef,
    [isDesktop, prefersReducedMotion]
  );

  // Jump smoothly to principle anchor via page scroll
  const handleJumpToPrinciple = (index: number) => {
    if (!sectionRef.current) return;

    if (scrollTriggerInstance.current) {
      const st = scrollTriggerInstance.current;
      const targetProgress = index < 4 ? METHOD_PRINCIPLES[index].targetProgress : 0.88;
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      const el = document.getElementById(`mobile-principle-${index}`);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // PURE MATHEMATICAL DERIVATION: ZERO GHOSTING & REVERSIBILITY
  // ─────────────────────────────────────────────────────────────
  const {
    isIntro,
    introOpacity,
    isClimax,
    climaxOpacity,
    climaxPhaseProgress,
    activePrincipleIdx,
    textOpacity,
    textOffsetY,
  } = useMemo(() => {
    const p = Math.min(0.9999, Math.max(0, scrollProgress));

    // 1. INTRO ZONE: p ∈ [0.00, 0.12]
    if (p < P_INTRO_END) {
      const t = p / P_INTRO_END;
      const introOp = 1 - Math.pow(t, 2);

      return {
        isIntro: true,
        introOpacity: introOp,
        isClimax: false,
        climaxOpacity: 0,
        climaxPhaseProgress: 0,
        activePrincipleIdx: 0,
        textOpacity: 0,
        textOffsetY: 15,
      };
    }

    // 2. PRACTICAL CLIMAX ZONE: p > 0.78
    if (p >= P_PRINCIPLES_END) {
      const t = (p - P_PRINCIPLES_END) / (1.0 - P_PRINCIPLES_END); // 0 -> 1
      const climOp = Math.min(1, t / 0.25);

      return {
        isIntro: false,
        introOpacity: 0,
        isClimax: true,
        climaxOpacity: climOp,
        climaxPhaseProgress: t,
        activePrincipleIdx: 3,
        textOpacity: 0,
        textOffsetY: 0,
      };
    }

    // 3. 4 PRINCIPLE CHAPTERS: p ∈ [0.12, 0.78]
    const totalSpan = P_PRINCIPLES_END - P_INTRO_END; // 0.66
    const spanPerPrinciple = totalSpan / 4; // 0.165
    const relP = p - P_INTRO_END;
    const floatIdx = relP / spanPerPrinciple;
    const baseIdx = Math.min(3, Math.floor(floatIdx));
    const sub = floatIdx - baseIdx; // 0.0 -> 1.0 within principle

    let txtOp = 1.0;
    let txtY = 0;
    let focalIdx = baseIdx;

    if (sub >= 0.75 && baseIdx < 3) {
      const u = (sub - 0.75) / 0.25; // 0.0 -> 1.0

      // GHOST-FREE TRANSITION (0.25–0.60 no center text)
      if (u <= 0.25) {
        const exitProgress = u / 0.25;
        txtOp = 1 - exitProgress;
        txtY = -10 * exitProgress;
        focalIdx = baseIdx;
      } else if (u < 0.60) {
        txtOp = 0;
        txtY = 10;
        focalIdx = u > 0.45 ? baseIdx + 1 : baseIdx;
      } else {
        const enterProgress = (u - 0.60) / 0.40;
        txtOp = enterProgress;
        txtY = 10 * (1 - enterProgress);
        focalIdx = baseIdx + 1;
      }
    } else {
      txtOp = 1.0;
      txtY = 0;
      focalIdx = baseIdx;
    }

    return {
      isIntro: false,
      introOpacity: 0,
      isClimax: false,
      climaxOpacity: 0,
      climaxPhaseProgress: 0,
      activePrincipleIdx: focalIdx,
      textOpacity: txtOp,
      textOffsetY: txtY,
    };
  }, [scrollProgress]);

  const activePrinciple: MethodPrinciple = METHOD_PRINCIPLES[activePrincipleIdx];

  return (
    <section
      ref={sectionRef}
      id="method"
      aria-label="The Tafrishaala Method Section"
      className="relative z-20 w-full bg-[var(--bg-primary)] text-[var(--text-primary)] select-none border-t border-[var(--border-subtle)]"
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* DESKTOP PINNED PROCEDURAL SCROLL JOURNEY (≥ 768px, 500vh)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:block relative w-full min-h-[500vh]">
        <div
          ref={pinContainerRef}
          className="sticky top-0 left-0 h-screen w-full flex flex-col justify-between overflow-hidden px-8 lg:px-16 py-10"
        >
          {/* CONTINUOUS PROCEDURAL CANVAS SYSTEM */}
          <MethodProceduralCanvas progress={scrollProgress} />

          {/* TOP BAR: Section Tag & Statement */}
          <div className="relative z-20 w-full flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
            <div className="flex items-center gap-3">
              <div className="font-mono text-[11px] tracking-[0.3em] text-[var(--accent-primary)] uppercase font-semibold flex items-center gap-2">
                <Compass className="h-3 w-3 text-[var(--accent-primary)]" />
                // 07 THE METHOD
              </div>
              <span className="text-[var(--border-subtle)]">|</span>
              <span className="font-mono text-xs text-[var(--text-secondary)] font-medium tracking-wider">
                THE TAFRISHAALA METHOD
              </span>
            </div>

            <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
              LEARNING SHOULD NOT STOP AT KNOWING
            </span>
          </div>

          {/* MAIN BODY: Frosted Glass Chapter Index (Left) + Principle / Climax Display */}
          <div className="relative z-20 w-full max-w-7xl mx-auto my-auto">
            {/* 1. PRINCIPLES VIEW (p < 0.78): Frosted Glass Chapter Index + Principle Display */}
            {!isClimax && (
              <div className="grid grid-cols-12 gap-8 items-center">
                {/* LEFT: Frosted Glass Luxury Chapter Index (4 cols) */}
                <div className="col-span-4 flex flex-col space-y-2 p-5 rounded-2xl bg-[var(--bg-secondary)]/90 backdrop-blur-2xl border border-[var(--border-subtle)] shadow-2xl">
                  <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-bold mb-1 px-3">
                    CORE PILLARS
                  </div>

                  {METHOD_PRINCIPLES.map((principle, idx) => {
                    const isActive = activePrincipleIdx === idx && !isIntro;

                    return (
                      <button
                        key={principle.id}
                        onClick={() => handleJumpToPrinciple(idx)}
                        aria-label={`Jump to pillar ${principle.index} ${principle.title}`}
                        className={`group flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] ${
                          isActive
                            ? 'text-[var(--text-primary)] border-l-[3px] border-[var(--accent-primary)] bg-[var(--bg-surface)] shadow-sm'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/60 border-l-[3px] border-transparent'
                        }`}
                      >
                        <span
                          className={`font-mono text-xs font-bold transition-colors ${
                            isActive
                              ? 'text-[var(--accent-primary)]'
                              : 'text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]'
                          }`}
                        >
                          {principle.index}
                        </span>
                        <span
                          className={`font-mono text-xs tracking-wider uppercase font-semibold transition-colors ${
                            isActive
                              ? 'text-[var(--text-primary)] font-bold'
                              : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {principle.title}
                        </span>
                      </button>
                    );
                  })}

                  {/* Climax Pillar Anchor */}
                  <button
                    onClick={() => handleJumpToPrinciple(4)}
                    aria-label="Jump to practical implementation climax"
                    className="group flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/60 border-l-[3px] border-transparent"
                  >
                    <span className="font-mono text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors">
                      05
                    </span>
                    <span className="font-mono text-xs tracking-wider uppercase font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                      THE CONDUIT
                    </span>
                  </button>
                </div>

                {/* CENTER / RIGHT: Contextual Active Principle Display (8 cols) */}
                <div className="col-span-8 flex flex-col items-start justify-center pl-6 lg:pl-12 min-h-[360px]">
                  {/* Intro Narrative */}
                  {isIntro && (
                    <div
                      className="flex flex-col items-start justify-center transition-all duration-200 will-change-transform"
                      style={{ opacity: introOpacity }}
                    >
                      <div className="font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)] uppercase mb-3 font-semibold">
                        // PHILOSOPHY
                      </div>
                      <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-tight max-w-xl">
                        THE TAFRISHAALA METHOD.
                      </h2>
                      <p className="mt-4 font-mono text-sm text-[var(--accent-primary)] uppercase tracking-widest font-medium">
                        LEARNING SHOULD NOT STOP AT KNOWING ↓
                      </p>
                    </div>
                  )}

                  {/* Principle Active State */}
                  {!isIntro && (
                    <div
                      className="flex flex-col items-start justify-center transition-all duration-150 will-change-transform max-w-xl"
                      style={{
                        opacity: textOpacity,
                        transform: `translateY(${textOffsetY}px)`,
                      }}
                    >
                      <div className="font-mono text-xs tracking-[0.25em] text-[var(--accent-primary)] uppercase mb-2 font-semibold">
                        {activePrinciple.index} // CORE PILLAR
                      </div>

                      <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
                        {activePrinciple.title}
                      </h2>

                      <p className="mt-4 font-sans text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
                        {activePrinciple.sourceStatement}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. PRACTICAL CLIMAX VIEW (p ≥ 0.78): Pure Conduit as the Hero (No Cards, No Grid Boxes) */}
            {isClimax && (
              <div
                className="w-full flex flex-col items-center justify-center transition-all duration-300 will-change-transform text-center"
                style={{ opacity: climaxOpacity }}
              >
                {/* Refined Headline Supporting the Conduit */}
                <div className="font-mono text-[11px] tracking-[0.3em] text-[var(--accent-primary)] uppercase font-semibold mb-2">
                  // THE LEARNING CONDUIT
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-tight mb-2">
                  FROM KNOWLEDGE TO APPLICATION.
                </h2>
                <div className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-28">
                  KNOWLEDGE → APPLICATION → EXPERIENCE
                </div>

                {/* 4 Milestone Labels Positioned Directly Along the Centered Horizontal Conduit */}
                <div className="w-full max-w-5xl grid grid-cols-4 gap-4 px-4">
                  {PRACTICAL_MILESTONES.map((milestone, mIdx) => {
                    const isMilestoneActive = climaxPhaseProgress >= (mIdx / 3) * 0.75;
                    const isCurrent =
                      isMilestoneActive &&
                      (mIdx === 3 || climaxPhaseProgress < ((mIdx + 1) / 3) * 0.75);

                    return (
                      <div
                        key={milestone.id}
                        className={`flex flex-col items-center text-center transition-all duration-300 ${
                          isCurrent
                            ? 'text-[var(--text-primary)] scale-105 opacity-100'
                            : isMilestoneActive
                            ? 'text-[var(--text-secondary)] opacity-80'
                            : 'text-[var(--text-muted)] opacity-35'
                        }`}
                      >
                        <span
                          className={`font-mono text-[10px] uppercase tracking-widest font-bold mb-2 ${
                            isCurrent
                              ? 'text-[var(--accent-primary)]'
                              : isMilestoneActive
                              ? 'text-[var(--text-primary)]'
                              : 'text-[var(--text-muted)]'
                          }`}
                        >
                          {milestone.index} // {milestone.phaseLabel}
                        </span>
                        <h4 className="font-display text-base sm:text-lg font-black tracking-tight uppercase leading-snug">
                          {milestone.title}
                        </h4>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM BAR: Scroll Indicator & Section 09 Bridge */}
          <div className="relative z-20 w-full flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 font-mono text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              <span className="tracking-widest uppercase text-[10px]">
                {isIntro
                  ? 'EXPLORING THE PHILOSOPHY'
                  : isClimax
                  ? 'FROM KNOWLEDGE TO APPLICATION'
                  : `PILLAR ${activePrinciple.index} / 04 — SCROLL TO EXPLORE`}
              </span>
            </div>

            <span className="tracking-widest uppercase text-[10px] text-[var(--text-muted)]">
              {isClimax
                ? 'FROM KNOWLEDGE TO APPLICATION ↓ NEXT: SECTION 09'
                : 'NEXT: SECTION 09 ↓'}
            </span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE NATURAL DOCUMENT FLOW (< 768px)                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="block md:hidden w-full px-6 py-20 space-y-16">
        <div className="text-center mb-12">
          <div className="mb-2 font-mono text-[10px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold flex items-center justify-center gap-1.5">
            <Compass className="h-3 w-3 text-[var(--accent-primary)]" />
            // 07 THE METHOD
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)]">
            THE TAFRISHAALA METHOD.
          </h2>
          <p className="mt-2 font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
            Learning should not stop at knowing.
          </p>
        </div>

        {/* 4 Core Principles Mobile Stack */}
        <div className="space-y-6">
          {METHOD_PRINCIPLES.map((principle, idx) => (
            <div
              key={principle.id}
              id={`mobile-principle-${idx}`}
              className="border-l-2 border-[var(--accent-primary)] pl-4 py-2 space-y-2"
            >
              <div className="font-mono text-[10px] text-[var(--accent-primary)] uppercase tracking-widest font-semibold">
                PILLAR {principle.index}
              </div>
              <h3 className="font-display text-2xl font-black tracking-tight text-[var(--text-primary)]">
                {principle.title}
              </h3>
              <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                {principle.sourceStatement}
              </p>
            </div>
          ))}
        </div>

        {/* Practical Milestones Mobile Conduit Flow (Zero Cards) */}
        <div className="pt-8 border-t border-[var(--border-subtle)] space-y-8">
          <div className="text-center">
            <div className="font-mono text-[10px] text-[var(--accent-primary)] uppercase tracking-widest font-semibold mb-1">
              // THE LEARNING CONDUIT
            </div>
            <h3 className="font-display text-xl font-black text-[var(--text-primary)]">
              FROM KNOWLEDGE TO APPLICATION.
            </h3>
            <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-1">
              KNOWLEDGE → APPLICATION → EXPERIENCE
            </p>
          </div>

          <div className="relative pl-6 space-y-8 border-l-2 border-[var(--border-subtle)]">
            {PRACTICAL_MILESTONES.map((milestone) => (
              <div key={milestone.id} className="relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-[var(--accent-primary)] ring-4 ring-[var(--bg-primary)]" />
                <div className="font-mono text-[10px] text-[var(--accent-primary)] font-bold">
                  {milestone.index} // {milestone.phaseLabel}
                </div>
                <h4 className="font-display text-base font-black text-[var(--text-primary)] uppercase mt-0.5">
                  {milestone.title}
                </h4>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border-subtle)] text-center font-mono text-xs text-[var(--text-muted)] tracking-widest uppercase">
          FROM KNOWLEDGE TO APPLICATION ↓ NEXT: SECTION 09
        </div>
      </div>
    </section>
  );
}
