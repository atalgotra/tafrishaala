'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceCapabilities } from '@/hooks/useMediaQuery';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { LEARNING_TRACKS_DATA, LearningTrackConfig } from '@/lib/learningTracksData';
import { CinematicTrackMedia } from '@/components/ui/CinematicTrackMedia';
import { Compass, ArrowRight } from 'lucide-react';

export function LearningTracksSection() {
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

  // Jump smoothly to track anchor
  const handleJumpToTrack = (index: number) => {
    if (!sectionRef.current) return;

    if (scrollTriggerInstance.current) {
      const st = scrollTriggerInstance.current;
      const targetProgress = LEARNING_TRACKS_DATA[index].targetProgress;
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      const el = document.getElementById(`mobile-track-${LEARNING_TRACKS_DATA[index].id}`);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // MATHEMATICAL INTERPOLATION & STATE DERIVATION
  // ─────────────────────────────────────────────────────────────
  const {
    isIntro,
    introOpacity,
    isExit,
    exitOpacity,
    activeIndex,
    textOpacity,
    textOffsetY,
    trackWeights,
  } = useMemo(() => {
    const p = Math.min(0.9999, Math.max(0, scrollProgress));

    // 1. INTRO NARRATIVE (0.00 – 0.04)
    if (p < 0.04) {
      const t = p / 0.04;
      const introOp = 1 - Math.pow(t, 2);
      const weights: Record<number, { opacity: number; scale: number; blur: number }> = {
        0: { opacity: Math.min(1, t * 1.5), scale: 0.96 + 0.04 * t, blur: 4 * (1 - t) },
      };

      return {
        isIntro: true,
        introOpacity: introOp,
        isExit: false,
        exitOpacity: 0,
        activeIndex: 0,
        textOpacity: 0,
        textOffsetY: 15,
        trackWeights: weights,
      };
    }

    // 2. EXIT BRIDGE (0.96 – 1.00)
    if (p >= 0.96) {
      const t = (p - 0.96) / 0.04;
      const exitOp = Math.pow(t, 2);
      const weights: Record<number, { opacity: number; scale: number; blur: number }> = {
        5: { opacity: Math.max(0.2, 1 - t * 0.7), scale: 1.0 + 0.03 * t, blur: 4 * t },
      };

      return {
        isIntro: false,
        introOpacity: 0,
        isExit: true,
        exitOpacity: exitOp,
        activeIndex: 5,
        textOpacity: Math.max(0, 1 - t * 2),
        textOffsetY: -10 * t,
        trackWeights: weights,
      };
    }

    // 3. CORE TRACK TRANSITIONS (0.04 – 0.96 -> 6 Tracks, 5 Transition Intervals)
    const normalized = (p - 0.04) / 0.92; // 0.0 -> 1.0
    const rawPos = normalized * 5; // 0.0 -> 5.0
    const baseIdx = Math.floor(rawPos);
    const u = rawPos - baseIdx; // fractional progress within [baseIdx, baseIdx + 1]

    const weights: Record<number, { opacity: number; scale: number; blur: number }> = {};
    let focalActive = baseIdx;
    let txtOp = 1.0;
    let txtY = 0;

    if (baseIdx < 5) {
      weights[baseIdx] = {
        opacity: 1 - u,
        scale: 1.0 + 0.04 * u,
        blur: 4 * u,
      };
      weights[baseIdx + 1] = {
        opacity: u,
        scale: 0.96 + 0.04 * u,
        blur: 4 * (1 - u),
      };

      // GHOST-FREE TEXT SEQUENCING (0.25–0.60 no center text)
      if (u <= 0.25) {
        const exitProgress = u / 0.25;
        txtOp = 1 - exitProgress;
        txtY = -10 * exitProgress;
        focalActive = baseIdx;
      } else if (u < 0.60) {
        txtOp = 0;
        txtY = 10;
        focalActive = u > 0.45 ? baseIdx + 1 : baseIdx;
      } else {
        const enterProgress = (u - 0.60) / 0.40;
        txtOp = enterProgress;
        txtY = 10 * (1 - enterProgress);
        focalActive = baseIdx + 1;
      }
    } else {
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
      trackWeights: weights,
    };
  }, [scrollProgress]);

  const activeTrack: LearningTrackConfig = LEARNING_TRACKS_DATA[activeIndex];

  // Helper for text position alignment
  const positionClasses = useMemo(() => {
    switch (activeTrack.textPosition) {
      case 'lower-center':
        return 'items-center justify-end pb-8 text-center';
      case 'upper-left':
        return 'items-start justify-start pt-8 pl-6 lg:pl-12 text-left';
      case 'lower-left':
      default:
        return 'items-start justify-end pb-8 pl-6 lg:pl-12 text-left';
    }
  }, [activeTrack.textPosition]);

  return (
    <section
      ref={sectionRef}
      id="tracks"
      aria-label="Learning Tracks Section"
      className="relative z-20 w-full bg-[var(--bg-primary)] text-[var(--text-primary)] select-none border-t border-[var(--border-subtle)]"
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* DESKTOP PINNED CINEMATIC SCROLL JOURNEY (≥ 768px, 600vh)      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:block relative w-full min-h-[600vh]">
        <div
          ref={pinContainerRef}
          className="sticky top-0 left-0 h-screen w-full flex flex-col justify-between overflow-hidden px-8 lg:px-16 py-10"
        >
          {/* BACKGROUND MEDIA LAYERS */}
          {LEARNING_TRACKS_DATA.map((track, idx) => {
            const w = trackWeights[idx];
            if (!w || w.opacity <= 0.001) return null;

            return (
              <CinematicTrackMedia
                key={track.id}
                track={track}
                opacity={w.opacity}
                scale={w.scale}
                blur={w.blur}
                isActive={activeIndex === idx}
              />
            );
          })}

          {/* TOP BAR: Section Identifier & Header */}
          <div className="relative z-20 w-full flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
            <div className="flex items-center gap-3">
              <div className="font-mono text-[11px] tracking-[0.3em] text-[var(--accent-primary)] uppercase font-semibold flex items-center gap-2">
                <Compass className="h-3 w-3 text-[var(--accent-primary)]" />
                // 06 LEARNING TRACKS
              </div>
              <span className="text-[var(--border-subtle)]">|</span>
              <span className="font-mono text-xs text-[var(--text-secondary)] font-medium tracking-wider">
                LEARNING TRACKS
              </span>
            </div>

            <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
              SIX WAYS TO TURN TECHNOLOGY INTO PRACTICAL SKILLS
            </span>
          </div>

          {/* MAIN BODY: Frosted Glass Chapter Index + Foreground Editorial Track Display */}
          <div className="relative z-20 grid grid-cols-12 gap-8 items-center my-auto w-full max-w-7xl mx-auto">
            {/* LEFT: Frosted Glass Luxury Chapter Index (4 cols) */}
            <div className="col-span-4 flex flex-col space-y-2 p-5 rounded-2xl bg-[var(--bg-secondary)]/90 backdrop-blur-2xl border border-[var(--border-subtle)] shadow-2xl">
              <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-bold mb-1 px-3">
                CURRICULUM CHAPTERS
              </div>

              {LEARNING_TRACKS_DATA.map((track, idx) => {
                const isActive = activeIndex === idx && !isIntro && !isExit;

                return (
                  <button
                    key={track.id}
                    onClick={() => handleJumpToTrack(idx)}
                    aria-label={`Jump to track ${track.index} ${track.title}`}
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
                      {track.index}
                    </span>
                    <span
                      className={`font-mono text-xs tracking-wider uppercase font-semibold transition-colors ${
                        isActive
                          ? 'text-[var(--text-primary)] font-bold'
                          : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {track.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* CENTER / RIGHT: Contextual Active Track Display (8 cols) */}
            <div className={`col-span-8 flex flex-col min-h-[340px] ${positionClasses}`}>
              {/* 1. INTRO NARRATIVE (p ∈ [0.00, 0.04]) */}
              {isIntro && (
                <div
                  className="flex flex-col items-start justify-center transition-all duration-200 will-change-transform"
                  style={{ opacity: introOpacity }}
                >
                  <div className="font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)] uppercase mb-3 font-semibold">
                    // THE BRIDGE
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-tight max-w-xl">
                    LEARNING TRACKS.
                  </h2>
                  <p className="mt-4 font-mono text-sm text-[var(--accent-primary)] uppercase tracking-widest font-medium">
                    YOU KNOW THE TECHNOLOGY. NOW EXPLORE THE PATHS TO MASTER IT ↓
                  </p>
                </div>
              )}

              {/* 2. ACTIVE TRACK DISPLAY BLOCK (Low Density, Clean Source Copy, Zero Ghosting) */}
              {!isIntro && !isExit && (
                <div
                  className="flex flex-col items-start justify-center transition-all duration-150 will-change-transform max-w-xl"
                  style={{
                    opacity: textOpacity,
                    transform: `translateY(${textOffsetY}px)`,
                  }}
                >
                  {/* Clean Track Index Tag */}
                  <div className="font-mono text-xs tracking-[0.25em] text-[var(--accent-primary)] uppercase mb-2 font-semibold">
                    {activeTrack.index} // LEARNING TRACK
                  </div>

                  {/* Verified Course Title */}
                  <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
                    {activeTrack.title}
                  </h2>

                  {/* Concise Source-Derived Description */}
                  <p className="mt-4 font-sans text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
                    {activeTrack.sourceDescription}
                  </p>

                  {/* Single Clean Action CTA */}
                  <div className="mt-7 flex items-center gap-4">
                    <a
                      href={activeTrack.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                      VIEW TRACK <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </a>

                    <button
                      onClick={() => handleJumpToTrack((activeIndex + 1) % LEARNING_TRACKS_DATA.length)}
                      className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-2 py-3 cursor-pointer"
                    >
                      NEXT TRACK ↓
                    </button>
                  </div>
                </div>
              )}

              {/* 3. EXIT NARRATIVE (p ∈ [0.96, 1.00]) */}
              {isExit && (
                <div
                  className="flex flex-col items-start justify-center transition-all duration-200 will-change-transform"
                  style={{ opacity: exitOpacity }}
                >
                  <div className="font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)] uppercase mb-3 font-semibold">
                    // BEYOND CURRICULUM
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-tight max-w-xl">
                    HOW WE TEACH.
                  </h2>
                  <p className="mt-4 font-mono text-sm text-[var(--accent-primary)] uppercase tracking-widest font-medium">
                    NEXT: SECTION 08 — THE METHOD ↓
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM BAR: Scroll Indicator & Section 08 Bridge */}
          <div className="relative z-20 w-full flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 font-mono text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              <span className="tracking-widest uppercase text-[10px]">
                {isIntro
                  ? 'COMMENCING PATHWAYS'
                  : isExit
                  ? 'PREPARING METHODOLOGY'
                  : `TRACK ${activeTrack.index} / 06 — SCROLL TO NAVIGATE`}
              </span>
            </div>

            <span className="tracking-widest uppercase text-[10px] text-[var(--text-muted)]">
              {isExit ? 'TRANSITIONING TO METHOD ↓' : 'NEXT: SECTION 08 — THE METHOD ↓'}
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
            // 06 LEARNING TRACKS
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)]">
            LEARNING TRACKS
          </h2>
          <p className="mt-2 font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
            Six ways to turn technology into practical skills.
          </p>
        </div>

        {/* 6 Vertical Stack Cards with Mobile Media */}
        <div className="space-y-12">
          {LEARNING_TRACKS_DATA.map((track) => (
            <div
              key={track.id}
              id={`mobile-track-${track.id}`}
              className="relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden shadow-lg"
            >
              {/* Media Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-[var(--bg-primary)]">
                {track.videoMp4 ? (
                  <video
                    src={track.videoMp4}
                    poster={track.posterUrl}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={track.posterUrl}
                    alt={track.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent" />
              </div>

              {/* Text Body */}
              <div className="p-6 space-y-4">
                <div className="font-mono text-[10px] text-[var(--accent-primary)] uppercase tracking-widest font-semibold">
                  TRACK {track.index} // 06
                </div>

                <h3 className="font-display text-2xl font-black tracking-tight text-[var(--text-primary)]">
                  {track.title}
                </h3>

                <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                  {track.sourceDescription}
                </p>

                <a
                  href={track.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-xs font-bold uppercase tracking-widest"
                >
                  VIEW TRACK <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-[var(--border-subtle)] text-center font-mono text-xs text-[var(--text-muted)] tracking-widest uppercase">
          NEXT: SECTION 08 — THE METHOD ↓
        </div>
      </div>
    </section>
  );
}
