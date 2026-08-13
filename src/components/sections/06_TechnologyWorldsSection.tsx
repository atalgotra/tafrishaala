'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceCapabilities } from '@/hooks/useMediaQuery';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { TECH_WORLDS_DATA, TechWorldConfig } from '@/lib/technologyWorldsData';
import { CinematicWorldMedia } from '@/components/ui/CinematicWorldMedia';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Sparkles, ArrowRight } from 'lucide-react';

const P_INTRO_END = 0.04;
const P_WORLDS_END = 0.90;

export function TechnologyWorldsSection() {
  const [scrollProgress, setScrollProgress] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const pinContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const { isDesktop } = useDeviceCapabilities();

  // ─────────────────────────────────────────────────────────────
  // GSAP PINNED SCROLLTRIGGER TIMELINE (Desktop Only, 600vh)
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
  const handleJumpToWorld = (index: number) => {
    if (!sectionRef.current) return;

    if (scrollTriggerInstance.current) {
      const st = scrollTriggerInstance.current;
      const targetProgress = TECH_WORLDS_DATA[index].targetProgress;
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      const el = document.getElementById(`mobile-world-${TECH_WORLDS_DATA[index].id}`);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // PURE MATHEMATICAL DERIVATION: ZERO GHOSTING, PURE REVERSIBILITY
  // ─────────────────────────────────────────────────────────────
  const {
    isIntro,
    introOpacity,
    isExit,
    exitOpacity,
    activeIndex,
    textOpacity,
    textOffsetY,
    worldWeights,
  } = useMemo(() => {
    const p = Math.min(0.9999, Math.max(0, scrollProgress));
    const N = TECH_WORLDS_DATA.length; // 6

    const weights: Record<number, { opacity: number; scale: number; blur: number }> = {};
    for (let k = 0; k < N; k++) {
      weights[k] = { opacity: 0, scale: 1, blur: 0 };
    }

    // 1. INTRO ZONE: p ∈ [0.00, 0.04]
    if (p < P_INTRO_END) {
      const introT = p / P_INTRO_END;
      const introOp = 1 - Math.pow(introT, 2);
      weights[0] = { opacity: introT, scale: 0.98 + 0.02 * introT, blur: 3 * (1 - introT) };

      return {
        isIntro: true,
        introOpacity: introOp,
        isExit: false,
        exitOpacity: 0,
        activeIndex: 0,
        textOpacity: 0,
        textOffsetY: 15,
        worldWeights: weights,
      };
    }

    // 2. FINAL EXIT ZONE: p > 0.90
    if (p > P_WORLDS_END) {
      const exitT = (p - P_WORLDS_END) / (1.0 - P_WORLDS_END); // 0 -> 1
      weights[5] = { opacity: Math.max(0, 1 - exitT * 1.2), scale: 1.0 + 0.05 * exitT, blur: 4 * exitT };

      // Exit text reveals after brief spatial pause (exitT > 0.35)
      let exitOp = 0;
      if (exitT > 0.35) {
        exitOp = Math.min(1, (exitT - 0.35) / 0.45);
      }

      return {
        isIntro: false,
        introOpacity: 0,
        isExit: true,
        exitOpacity: exitOp,
        activeIndex: 5,
        textOpacity: 0,
        textOffsetY: -15,
        worldWeights: weights,
      };
    }

    // 3. 6 WORLD CHAPTERS: p ∈ [0.04, 0.90]
    const totalSpan = P_WORLDS_END - P_INTRO_END;
    const worldSpan = totalSpan / N;
    const relP = p - P_INTRO_END;
    const floatIdx = relP / worldSpan;
    const baseIdx = Math.min(N - 1, Math.floor(floatIdx));
    const sub = floatIdx - baseIdx; // 0.0 -> 1.0 within chapter

    let txtOp = 1.0;
    let txtY = 0;
    let focalActive = baseIdx;

    if (sub >= 0.75 && baseIdx < N - 1) {
      // Transition to baseIdx + 1
      const u = (sub - 0.75) / 0.25; // 0.0 -> 1.0

      // Media Cross-Fade & Morph
      weights[baseIdx] = {
        opacity: 1 - u,
        scale: 1.0 + 0.05 * u,
        blur: 5 * u,
      };
      weights[baseIdx + 1] = {
        opacity: u,
        scale: 0.95 + 0.05 * u,
        blur: 5 * (1 - u),
      };

      // GHOST-FREE TEXT SEQUENCING:
      // u ∈ [0.0, 0.30] -> Outgoing text exits
      // u ∈ [0.30, 0.70] -> ZERO TEXT (Environment is the hero)
      // u ∈ [0.70, 1.00] -> Incoming text enters
      if (u <= 0.30) {
        const exitProgress = u / 0.30;
        txtOp = 1 - exitProgress;
        txtY = -12 * exitProgress;
        focalActive = baseIdx;
      } else if (u < 0.70) {
        txtOp = 0;
        txtY = 12;
        focalActive = u > 0.5 ? baseIdx + 1 : baseIdx;
      } else {
        const enterProgress = (u - 0.70) / 0.30;
        txtOp = enterProgress;
        txtY = 12 * (1 - enterProgress);
        focalActive = baseIdx + 1;
      }
    } else {
      // Stable World Plateau
      weights[baseIdx] = { opacity: 1, scale: 1.0, blur: 0 };
      txtOp = 1.0;
      txtY = 0;
      focalActive = baseIdx;
    }

    return {
      isIntro: false,
      introOpacity: 0,
      isExit: false,
      exitOpacity: 0,
      activeIndex: focalActive,
      textOpacity: txtOp,
      textOffsetY: txtY,
      worldWeights: weights,
    };
  }, [scrollProgress]);

  const activeWorld: TechWorldConfig = TECH_WORLDS_DATA[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="worlds"
      aria-label="Technology Worlds Section"
      className="relative z-20 w-full bg-[var(--bg-primary)] text-[var(--text-primary)] select-none"
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* DESKTOP PINNED CINEMATIC SCROLL JOURNEY (≥ 768px, 600vh)      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:block relative w-full min-h-[600vh]">
        <div
          ref={pinContainerRef}
          className="sticky top-0 left-0 h-screen w-full flex flex-col justify-between overflow-hidden px-8 lg:px-16 py-12"
        >
          {/* BACKGROUND MEDIA LAYERS: Strict Maximum 2 Media Layers Active (Zero Procedural Shapes) */}
          {TECH_WORLDS_DATA.map((world, idx) => {
            const w = worldWeights[idx];
            if (!w || w.opacity <= 0.001) return null;

            return (
              <CinematicWorldMedia
                key={world.id}
                world={world}
                opacity={w.opacity}
                scale={w.scale}
                blur={w.blur}
                isActive={activeIndex === idx}
              />
            );
          })}

          {/* TOP BAR: Section Tag & Minimal Editorial Chapter Index */}
          <div className="relative z-20 w-full flex items-center justify-between border-b border-[var(--border-subtle)] pb-5">
            <div className="flex items-center gap-3">
              <div className="font-mono text-[11px] tracking-[0.3em] text-[var(--accent-primary)] uppercase font-semibold flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
                // 06 THE DOMAIN CATALOGUE
              </div>
              <span className="text-[var(--border-subtle)]">|</span>
              <span className="font-mono text-xs text-[var(--text-secondary)] font-medium tracking-wider">
                TECHNOLOGY WORLDS
              </span>
            </div>

            {/* Minimal Editorial Chapter Navigation Index */}
            <div
              role="tablist"
              aria-label="Technology Worlds Chapters"
              className="flex items-center gap-4 lg:gap-6 font-mono text-[11px] tracking-wider"
            >
              {TECH_WORLDS_DATA.map((world, idx) => {
                const isActive = activeIndex === idx && !isIntro && !isExit;

                return (
                  <button
                    key={world.id}
                    onClick={() => handleJumpToWorld(idx)}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Jump to Chapter ${world.index} ${world.name}`}
                    className={`flex items-center gap-1.5 transition-all duration-300 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] ${
                      isActive
                        ? 'text-[var(--accent-primary)] font-bold border-b border-[var(--accent-primary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] border-b border-transparent'
                    }`}
                  >
                    <span className="text-[9px] opacity-60">{world.index}</span>
                    <span>{world.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CENTER: Contextual Editorial Display */}
          <div className="relative z-20 my-auto mx-auto max-w-4xl w-full text-center flex flex-col items-center justify-center py-6 min-h-[360px]">
            {/* 1. INTRO NARRATIVE (p ∈ [0.00, 0.04]) */}
            {isIntro && (
              <div
                className="flex flex-col items-center justify-center transition-all duration-200 will-change-transform"
                style={{ opacity: introOpacity }}
              >
                <div className="font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)] uppercase mb-4 font-semibold">
                  // THE HANDOFF
                </div>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-tight max-w-2xl">
                  YOU&apos;VE LEARNED HOW TO BUILD.
                </h2>
                <p className="mt-4 font-mono text-sm text-[var(--accent-primary)] uppercase tracking-widest font-medium">
                  NOW EXPLORE WHAT YOU CAN BUILD WITH ↓
                </p>
              </div>
            )}

            {/* 2. ACTIVE WORLD EDITORIAL BLOCK (Zero Ghosting Guaranteed) */}
            {!isIntro && !isExit && (
              <div
                className="flex flex-col items-center justify-center transition-all duration-150 will-change-transform"
                style={{
                  opacity: textOpacity,
                  transform: `translateY(${textOffsetY}px)`,
                }}
              >
                {/* 1st: Chapter Tag */}
                <div className="font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)] uppercase mb-3">
                  {activeWorld.index} // THE DOMAIN
                </div>

                {/* 2nd: World Title */}
                <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[var(--text-primary)] leading-none">
                  {activeWorld.name}
                </h2>

                {/* 3rd: Tagline & Grounded Copy */}
                <p className="mt-4 font-mono text-sm sm:text-base text-[var(--accent-primary)] font-semibold tracking-wide">
                  {activeWorld.tagline}
                </p>

                <p className="mt-4 font-sans text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto font-normal">
                  {activeWorld.description}
                </p>

                {/* 4th: CTA Button */}
                <div className="mt-8 flex items-center justify-center gap-4">
                  <MagneticButton
                    variant="primary"
                    cursorText="EXPLORE"
                    className="px-8 py-3.5 text-xs font-mono font-bold tracking-widest"
                    onClick={() => {
                      const el = document.getElementById('learners') || document.getElementById('cta');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    EXPLORE {activeWorld.name} WORLD <ArrowRight className="h-3.5 w-3.5 ml-1 inline" />
                  </MagneticButton>
                </div>
              </div>
            )}

            {/* 3. FINAL EXIT NARRATIVE (p > 0.90) */}
            {isExit && (
              <div
                className="flex flex-col items-center justify-center transition-all duration-300 will-change-transform"
                style={{ opacity: exitOpacity }}
              >
                <div className="font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)] uppercase mb-4 font-semibold">
                  // THE PORTFOLIO
                </div>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-tight max-w-2xl">
                  YOU&apos;VE SEEN THE WORLDS.
                </h2>
                <p className="mt-4 font-mono text-sm sm:text-base text-[var(--accent-primary)] uppercase tracking-widest font-semibold">
                  NOW SEE WHAT YOU CAN BUILD WITH THEM ↓
                </p>
              </div>
            )}
          </div>

          {/* BOTTOM BAR: Scroll Indicator & Section 07 Narrative Bridge */}
          <div className="relative z-20 w-full flex items-center justify-between border-t border-[var(--border-subtle)] pt-5 font-mono text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              <span className="tracking-widest uppercase text-[10px]">
                {isIntro
                  ? 'EXPLORING THE PROTOCOL'
                  : isExit
                  ? "YOU'VE SEEN THE WORLDS"
                  : `CHAPTER ${activeWorld.index} / 06 — SCROLL TO TRAVEL`}
              </span>
            </div>

            <span className="tracking-widest uppercase text-[10px] text-[var(--text-muted)]">
              {isExit
                ? 'ENTERING WHAT YOU CAN BUILD ↓'
                : 'NEXT: WHAT YOU CAN BUILD — EXPLORE THE DOMAINS ↓'}
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
            <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
            // 06 THE DOMAIN CATALOGUE
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)]">
            TECHNOLOGY WORLDS.
          </h2>
          <p className="mt-2 font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
            Explore the technologies that turn ideas into real things.
          </p>
        </div>

        {TECH_WORLDS_DATA.map((world) => (
          <div
            key={world.id}
            id={`mobile-world-${world.id}`}
            className="relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden p-8 flex flex-col justify-between min-h-[460px]"
          >
            <img
              src={world.posterUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-[var(--bg-secondary)] opacity-90 pointer-events-none" />

            <div className="relative z-10">
              <div className="font-mono text-[10px] text-[var(--accent-primary)] uppercase tracking-widest font-semibold">
                PHASE {world.index} // DOMAIN
              </div>
              <h3 className="mt-2 font-display text-4xl font-black tracking-tight text-[var(--text-primary)]">
                {world.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-[var(--accent-primary)] font-semibold">
                {world.tagline}
              </p>
              <p className="mt-3 font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                {world.description}
              </p>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => {
                  const el = document.getElementById('learners') || document.getElementById('cta');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full rounded bg-[var(--accent-primary)] py-3 text-center font-mono text-xs font-bold uppercase tracking-widest text-[var(--bg-primary)]"
              >
                EXPLORE {world.name} →
              </button>
            </div>
          </div>
        ))}

        <div className="pt-6 border-t border-[var(--border-subtle)] text-center font-mono text-xs text-[var(--text-muted)] tracking-widest uppercase">
          NOW SEE WHAT PEOPLE BUILD WITH THEM ↓
        </div>
      </div>
    </section>
  );
}
