'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceCapabilities } from '@/hooks/useMediaQuery';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { EXPERIENCE_CHAPTERS, ExperienceChapter } from '@/lib/humanExperienceData';
import { ExperienceMediaFrame } from '@/components/ui/ExperienceMediaFrame';
import { Users } from 'lucide-react';

export function RealExperienceSection() {
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

  // Jump smoothly to chapter anchor
  const handleJumpToChapter = (index: number) => {
    if (!sectionRef.current) return;

    if (scrollTriggerInstance.current) {
      const st = scrollTriggerInstance.current;
      const targetProgress = EXPERIENCE_CHAPTERS[index].targetProgress;
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      const el = document.getElementById(`mobile-experience-${EXPERIENCE_CHAPTERS[index].id}`);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // SINGLE SOURCE OF TRUTH DERIVATION
  // ─────────────────────────────────────────────────────────────
  const {
    isIntro,
    chapterIndex,
    introOpacity,
    textOpacity,
    textOffsetY,
    mediaOpacity,
    mediaScale,
    mediaBlur,
    exitIndicator,
  } = useMemo(() => {
    const p = Math.min(0.9999, Math.max(0, scrollProgress));

    // 0.00 – 0.10: ENTRY INTRO
    if (p < 0.10) {
      const t = p / 0.10;
      const introOp = 1 - Math.pow(t, 2);
      return {
        isIntro: true,
        chapterIndex: 0,
        introOpacity: introOp,
        textOpacity: 0,
        textOffsetY: 15,
        mediaOpacity: Math.min(1, t * 1.5),
        mediaScale: 0.98 + 0.02 * t,
        mediaBlur: 3 * (1 - t),
        exitIndicator: false,
      };
    }

    // Explicit Deterministic Boundaries
    let cIdx = 0;
    let startP = 0.10;
    if (p < 0.28) {
      cIdx = 0;
      startP = 0.10;
    } else if (p < 0.46) {
      cIdx = 1;
      startP = 0.28;
    } else if (p < 0.64) {
      cIdx = 2;
      startP = 0.46;
    } else if (p < 0.82) {
      cIdx = 3;
      startP = 0.64;
    } else {
      cIdx = 4;
      startP = 0.82;
    }

    const localT = (p - startP) / 0.18; // 0.0 -> 1.0 within active chapter

    let txtOp = 1.0;
    let txtY = 0;
    let mScale = 1.0;
    let mBlur = 0;
    let mOp = 1.0;

    // Transition Window
    // Chapters 0-3: Enter 0-25%, Steady 25-75%, Exit 75-100%
    // Chapter 4 (Final): Enter 0-20%, Steady Hold 20-90%, Soft Exit 90-100%
    const steadyThreshold = cIdx === 4 ? 0.90 : 0.75;
    const enterThreshold = cIdx === 4 ? 0.20 : 0.25;

    if (localT < enterThreshold) {
      const enterProgress = localT / enterThreshold;
      txtOp = enterProgress;
      txtY = 10 * (1 - enterProgress);
      mScale = 0.98 + 0.02 * enterProgress;
      mBlur = 3 * (1 - enterProgress);
      mOp = 1.0;
    } else if (localT <= steadyThreshold) {
      txtOp = 1.0;
      txtY = 0;
      mScale = 1.0;
      mBlur = 0;
      mOp = 1.0;
    } else {
      const exitT = (localT - steadyThreshold) / (1.0 - steadyThreshold); // 0 -> 1
      if (exitT <= 0.40) {
        const fadeProgress = exitT / 0.40;
        txtOp = 1 - fadeProgress;
        txtY = -10 * fadeProgress;
      } else {
        // Zero text in middle transition gap
        txtOp = 0;
        txtY = 10;
      }
      mScale = 1.0 + 0.03 * exitT;
      mBlur = 4 * exitT;
      mOp = 1 - exitT * 0.3;
    }

    return {
      isIntro: false,
      chapterIndex: cIdx,
      introOpacity: 0,
      textOpacity: txtOp,
      textOffsetY: txtY,
      mediaOpacity: mOp,
      mediaScale: mScale,
      mediaBlur: mBlur,
      exitIndicator: cIdx === 4 && localT > 0.70,
    };
  }, [scrollProgress]);

  const activeChapter: ExperienceChapter = EXPERIENCE_CHAPTERS[chapterIndex];

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-label="Real Learning Real People Section"
      className="relative z-20 w-full bg-[var(--bg-primary)] text-[var(--text-primary)] select-none border-t border-[var(--border-subtle)]"
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* DESKTOP PINNED EDITORIAL SCROLL JOURNEY (≥ 768px, 500vh)      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:block relative w-full min-h-[500vh]">
        <div
          ref={pinContainerRef}
          className="sticky top-0 left-0 h-screen w-full flex flex-col justify-between overflow-hidden px-8 lg:px-16 py-10"
        >
          {/* SINGLE ACTIVE BACKGROUND MEDIA / OPEN WATERMARK FRAME */}
          <ExperienceMediaFrame
            index={activeChapter.index}
            media={activeChapter.media}
            opacity={mediaOpacity}
            scale={mediaScale}
            blur={mediaBlur}
          />

          {/* TOP BAR: Section Identifier & Header */}
          <div className="relative z-20 w-full flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
            <div className="flex items-center gap-3">
              <div className="font-mono text-[11px] tracking-[0.3em] text-[var(--accent-primary)] uppercase font-semibold flex items-center gap-2">
                <Users className="h-3 w-3 text-[var(--accent-primary)]" />
                // 09 REAL EVIDENCE
              </div>
              <span className="text-[var(--border-subtle)]">|</span>
              <span className="font-mono text-xs text-[var(--text-secondary)] font-medium tracking-wider">
                REAL LEARNING. REAL PEOPLE.
              </span>
            </div>

            <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
              LEARNING BECOMES MEANINGFUL WHEN KNOWLEDGE MEETS PRACTICE
            </span>
          </div>

          {/* MAIN BODY: Frosted Glass Chapter Index + Single Active Chapter Text */}
          <div className="relative z-20 grid grid-cols-12 gap-8 items-center my-auto w-full max-w-7xl mx-auto">
            {/* LEFT: Frosted Glass Luxury Chapter Index (4 cols) */}
            <div className="col-span-4 flex flex-col space-y-2 p-5 rounded-2xl bg-[var(--bg-secondary)]/90 backdrop-blur-2xl border border-[var(--border-subtle)] shadow-2xl">
              <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-bold mb-1 px-3">
                HUMAN JOURNEY
              </div>

              {EXPERIENCE_CHAPTERS.map((chap, idx) => {
                const isActive = chapterIndex === idx && !isIntro;

                return (
                  <button
                    key={chap.id}
                    onClick={() => handleJumpToChapter(idx)}
                    aria-label={`Jump to chapter ${chap.index} ${chap.tag}`}
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
                      {chap.index}
                    </span>
                    <span
                      className={`font-mono text-xs tracking-wider uppercase font-semibold transition-colors ${
                        isActive
                          ? 'text-[var(--text-primary)] font-bold'
                          : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {chap.tag}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* CENTER / RIGHT: Single Editorial Text Component (8 cols) */}
            <div className="col-span-8 flex flex-col items-start justify-center pl-6 lg:pl-12 min-h-[360px]">
              {/* 1. INTRO NARRATIVE (p ∈ [0.00, 0.10]) */}
              {isIntro && (
                <div
                  className="flex flex-col items-start justify-center transition-all duration-200 will-change-transform"
                  style={{ opacity: introOpacity }}
                >
                  <div className="font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)] uppercase mb-3 font-semibold">
                    // HUMAN EVIDENCE
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-tight max-w-xl">
                    REAL LEARNING. REAL PEOPLE.
                  </h2>
                  <p className="mt-4 font-mono text-sm text-[var(--accent-primary)] uppercase tracking-widest font-medium">
                    SEE HOW LEARNING BECOMES EXPERIENCE ↓
                  </p>
                </div>
              )}

              {/* 2. EXACTLY ONE ACTIVE EDITORIAL TEXT LAYER (Zero Duplicate Text) */}
              {!isIntro && (
                <div
                  key={activeChapter.id}
                  className="flex flex-col items-start justify-center transition-all duration-150 will-change-transform max-w-xl"
                  style={{
                    opacity: textOpacity,
                    transform: `translateY(${textOffsetY}px)`,
                  }}
                >
                  <div className="font-mono text-xs tracking-[0.25em] text-[var(--accent-primary)] uppercase mb-2 font-semibold">
                    {activeChapter.index} // {activeChapter.tag}
                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
                    {activeChapter.title}
                  </h2>

                  <p className="mt-4 font-sans text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
                    {activeChapter.sourceStatement}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM BAR: Scroll Indicator & Section 10 Bridge */}
          <div className="relative z-20 w-full flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 font-mono text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              <span className="tracking-widest uppercase text-[10px]">
                {isIntro
                  ? 'EXPLORING HUMAN EXPERIENCE'
                  : `CHAPTER ${activeChapter.index} / 05 — SCROLL TO EXPLORE`}
              </span>
            </div>

            <span className="tracking-widest uppercase text-[10px] text-[var(--text-muted)]">
              {exitIndicator
                ? 'CONTINUING THE JOURNEY ↓ NEXT: SECTION 10'
                : 'NEXT: SECTION 10 ↓'}
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
            <Users className="h-3 w-3 text-[var(--accent-primary)]" />
            // 09 REAL EVIDENCE
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)]">
            REAL LEARNING. REAL PEOPLE.
          </h2>
          <p className="mt-2 font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
            Learning becomes meaningful when knowledge meets practice.
          </p>
        </div>

        {/* 5 Chapters Mobile Stack */}
        <div className="space-y-8">
          {EXPERIENCE_CHAPTERS.map((chap) => (
            <div
              key={chap.id}
              id={`mobile-experience-${chap.id}`}
              className="border-l-2 border-[var(--accent-primary)] pl-4 py-2 space-y-2"
            >
              <div className="font-mono text-[10px] text-[var(--accent-primary)] uppercase tracking-widest font-semibold">
                CHAPTER {chap.index} // {chap.tag}
              </div>
              <h3 className="font-display text-2xl font-black tracking-tight text-[var(--text-primary)]">
                {chap.title}
              </h3>
              <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                {chap.sourceStatement}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-[var(--border-subtle)] text-center font-mono text-xs text-[var(--text-muted)] tracking-widest uppercase">
          CONTINUING THE JOURNEY ↓ NEXT: SECTION 10
        </div>
      </div>
    </section>
  );
}
