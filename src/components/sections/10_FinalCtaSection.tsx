'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceCapabilities } from '@/hooks/useMediaQuery';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { VERIFIED_CONTACT_DATA, CONVERSION_ACTIONS } from '@/lib/finalConversionData';
import { ConversionConvergenceCanvas } from '@/components/ui/ConversionConvergenceCanvas';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Phone, Mail, ArrowRight, Sparkles } from 'lucide-react';

export function FinalCtaSection() {
  const [scrollProgress, setScrollProgress] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const pinContainerRef = useRef<HTMLDivElement | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const { isDesktop } = useDeviceCapabilities();

  // ─────────────────────────────────────────────────────────────
  // GSAP PINNED SCROLLTRIGGER TIMELINE (Desktop Only, 400vh)
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

  // Smooth navigation helper
  const handleScrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // ─────────────────────────────────────────────────────────────
  // SINGLE SOURCE OF TRUTH DERIVATION
  // ─────────────────────────────────────────────────────────────
  const {
    isIntro,
    introOpacity,
    contentOpacity,
    contentOffsetY,
    actionsOpacity,
    actionsOffsetY,
  } = useMemo(() => {
    const p = Math.min(0.9999, Math.max(0, scrollProgress));

    // 0.00 – 0.20: Entry Intro
    if (p < 0.20) {
      const t = p / 0.20;
      return {
        isIntro: true,
        introOpacity: 1 - Math.pow(t, 2),
        contentOpacity: 0,
        contentOffsetY: 20,
        actionsOpacity: 0,
        actionsOffsetY: 15,
      };
    }

    // 0.20 – 0.50: Convergence Stage (Main headline enters)
    const contentT = Math.min(1, Math.max(0, (p - 0.20) / 0.30));
    const contentOp = contentT;
    const contentY = 20 * (1 - contentT);

    // 0.50 – 0.80: CTA & Actions Bloom
    const actionsT = Math.min(1, Math.max(0, (p - 0.50) / 0.30));
    const actionsOp = actionsT;
    const actionsY = 15 * (1 - actionsT);

    return {
      isIntro: false,
      introOpacity: 0,
      contentOpacity: contentOp,
      contentOffsetY: contentY,
      actionsOpacity: actionsOp,
      actionsOffsetY: actionsY,
    };
  }, [scrollProgress]);

  return (
    <section
      ref={sectionRef}
      id="cta"
      aria-label="Final Conversion Section"
      className="relative z-20 w-full bg-[var(--bg-primary)] text-[var(--text-primary)] select-none border-t border-[var(--border-subtle)]"
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* DESKTOP PINNED CONVERGENCE JOURNEY (≥ 768px, 400vh)           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:block relative w-full min-h-[400vh]">
        <div
          ref={pinContainerRef}
          className="sticky top-0 left-0 h-screen w-full flex flex-col justify-between overflow-hidden px-8 lg:px-16 py-10"
        >
          {/* PROCEDURAL CONVERGENCE VECTOR CANVAS */}
          <ConversionConvergenceCanvas progress={scrollProgress} />

          {/* TOP BAR: Section Tag */}
          <div className="relative z-20 w-full flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
            <div className="flex items-center gap-3">
              <div className="font-mono text-[11px] tracking-[0.3em] text-[var(--accent-primary)] uppercase font-semibold flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
                // 10 FINAL CHAPTER
              </div>
              <span className="text-[var(--border-subtle)]">|</span>
              <span className="font-mono text-xs text-[var(--text-secondary)] font-medium tracking-wider">
                READY TO BUILD?
              </span>
            </div>

            <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
              TAFRISHAALA // NOIDA · HYBRID
            </span>
          </div>

          {/* MAIN CONVERSION HERO STAGE */}
          <div className="relative z-20 flex flex-col items-center justify-center my-auto text-center w-full max-w-4xl mx-auto">
            {/* 1. INTRO NARRATIVE (p ∈ [0.00, 0.20]) */}
            {isIntro && (
              <div
                className="flex flex-col items-center justify-center transition-all duration-200 will-change-transform"
                style={{ opacity: introOpacity }}
              >
                <div className="font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)] uppercase mb-3 font-semibold">
                  // THE CONVERGENCE
                </div>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-tight max-w-2xl">
                  LEARNING BECOMES EXPERIENCE.
                </h2>
                <p className="mt-4 font-mono text-xs text-[var(--text-secondary)] uppercase tracking-widest">
                  NOW IT BEGINS ↓
                </p>
              </div>
            )}

            {/* 2. FINAL MONUMENTAL HEADLINE & CONCISE SOURCE STATEMENT */}
            {!isIntro && (
              <div
                className="flex flex-col items-center justify-center transition-all duration-150 will-change-transform w-full"
                style={{
                  opacity: contentOpacity,
                  transform: `translateY(${contentOffsetY}px)`,
                }}
              >
                <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[var(--text-primary)] leading-[0.95] max-w-3xl">
                  READY TO BUILD?
                </h2>

                <p className="mt-6 font-sans text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed font-normal">
                  Get your questions answered about learning with us.
                </p>

                {/* 3. VERIFIED ACTIONS & DIRECT CONTACT BADGES */}
                <div
                  className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full transition-all duration-200"
                  style={{
                    opacity: actionsOpacity,
                    transform: `translateY(${actionsOffsetY}px)`,
                  }}
                >
                  <MagneticButton
                    variant="primary"
                    cursorText="BUILD"
                    className="px-8 py-3.5 text-xs font-mono tracking-wider"
                    onClick={() => handleScrollToSection('tracks')}
                  >
                    START LEARNING <ArrowRight className="h-3.5 w-3.5 ml-1.5 inline" />
                  </MagneticButton>

                  <a
                    href={VERIFIED_CONTACT_DATA.phoneHref}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] text-[var(--text-primary)] font-mono text-xs tracking-wider transition-colors backdrop-blur-sm"
                  >
                    <Phone className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                    <span>CALL {VERIFIED_CONTACT_DATA.phoneDisplay}</span>
                  </a>

                  <a
                    href={VERIFIED_CONTACT_DATA.emailHref}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] text-[var(--text-primary)] font-mono text-xs tracking-wider transition-colors backdrop-blur-sm"
                  >
                    <Mail className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                    <span>{VERIFIED_CONTACT_DATA.emailDisplay}</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM BAR: Contact Metadata & Footer Bridge */}
          <div className="relative z-20 w-full flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 font-mono text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              <span className="tracking-widest uppercase text-[10px]">
                OFFICIAL ADMISSIONS & COUNSELING ACTIVE
              </span>
            </div>

            <span className="tracking-widest uppercase text-[10px] text-[var(--text-muted)]">
              TAFRISHAALA OVERVIEW ↓
            </span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE NATURAL DOCUMENT FLOW (< 768px)                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="block md:hidden w-full px-6 py-24 space-y-10 text-center">
        <div className="font-mono text-[10px] tracking-[0.3em] text-[var(--accent-primary)] uppercase font-semibold flex items-center justify-center gap-1.5">
          <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
          // 10 FINAL CHAPTER
        </div>

        <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
          READY TO BUILD?
        </h2>

        <p className="font-sans text-sm text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
          Get your questions answered about learning with us.
        </p>

        {/* Mobile Touch Targets (48px+ Height) */}
        <div className="pt-4 flex flex-col gap-3 w-full max-w-sm mx-auto">
          <button
            onClick={() => handleScrollToSection('tracks')}
            className="w-full min-h-[48px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-xs font-bold tracking-wider active:scale-95 transition-transform"
          >
            START LEARNING <ArrowRight className="h-4 w-4" />
          </button>

          <a
            href={VERIFIED_CONTACT_DATA.phoneHref}
            className="w-full min-h-[48px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-mono text-xs font-semibold tracking-wider active:scale-95 transition-transform"
          >
            <Phone className="h-4 w-4 text-[var(--accent-primary)]" />
            <span>CALL {VERIFIED_CONTACT_DATA.phoneDisplay}</span>
          </a>

          <a
            href={VERIFIED_CONTACT_DATA.emailHref}
            className="w-full min-h-[48px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-mono text-xs font-semibold tracking-wider active:scale-95 transition-transform"
          >
            <Mail className="h-4 w-4 text-[var(--accent-primary)]" />
            <span>{VERIFIED_CONTACT_DATA.emailDisplay}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
