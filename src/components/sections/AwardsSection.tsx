'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';
import { AWARDS_DATA, AwardItem, AwardCategory } from '@/lib/awardsData';
import { MagneticButton } from '@/components/ui/MagneticButton';
import {
  Trophy,
  Award,
  Sparkles,
  ArrowRight,
  ArrowDown,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export function AwardsSection() {
  const [activeCategory, setActiveCategory] = useState<AwardCategory>('all');
  const [selectedAward, setSelectedAward] = useState<AwardItem | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const handoffRef = useRef<HTMLDivElement | null>(null);

  const prefersReducedMotion = useReducedMotion();

  const filteredAwards = AWARDS_DATA.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  // Modal navigation handlers
  const handleNext = useCallback(() => {
    if (!selectedAward) return;
    const currentIndex = filteredAwards.findIndex((a) => a.id === selectedAward.id);
    const nextIndex = (currentIndex + 1) % filteredAwards.length;
    setSelectedAward(filteredAwards[nextIndex]);
  }, [selectedAward, filteredAwards]);

  const handlePrev = useCallback(() => {
    if (!selectedAward) return;
    const currentIndex = filteredAwards.findIndex((a) => a.id === selectedAward.id);
    const prevIndex = (currentIndex - 1 + filteredAwards.length) % filteredAwards.length;
    setSelectedAward(filteredAwards[prevIndex]);
  }, [selectedAward, filteredAwards]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAward) return;
      if (e.key === 'Escape') setSelectedAward(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAward, handleNext, handlePrev]);

  // GSAP Entrance
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

      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        0
      )
        .fromTo(
          gridRef.current?.children || [],
          { opacity: 0, y: 30, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.04,
            duration: 0.5,
          },
          0.2
        )
        .fromTo(
          handoffRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4 },
          0.5
        );
    },
    sectionRef,
    [prefersReducedMotion]
  );

  return (
    <section
      ref={sectionRef}
      id="awards"
      aria-label="Awards & Accreditations Section"
      className="relative z-20 w-full bg-[var(--bg-primary)] px-6 py-20 lg:py-28 lg:px-12 border-t border-[var(--border-subtle)] select-none"
    >
      {/* Background Subtle Spatial Coordinate Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(to_right,var(--text-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--text-primary)_1px,transparent_1px)] [background-size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      />

      <div className="mx-auto max-w-7xl w-full flex flex-col items-start justify-center">
        {/* Section Header */}
        <div ref={headerRef} className="w-full flex flex-col items-start will-change-transform">
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[var(--accent-primary)] uppercase font-semibold flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
            // 09 AWARDS & RECOGNITION
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between w-full gap-6">
            <div>
              <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.02] max-w-4xl">
                Honored by Industry.
                <br />
                <span className="text-gradient-theme">Verified by Excellence.</span>
              </h2>

              <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-normal">
                Explore our national awards, government accreditations, and industry certifications recognizing Tafrishaala’s experiential creative tech curriculum.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <button
                onClick={() => setActiveCategory('all')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                  activeCategory === 'all'
                    ? 'border-[var(--accent-primary)] bg-[var(--bg-secondary)] text-[var(--accent-primary)] font-bold shadow-glow-sm'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-glow)]'
                }`}
              >
                <span>ALL RECOGNITION</span>
                <span className="text-[10px] opacity-70">({AWARDS_DATA.length})</span>
              </button>

              <button
                onClick={() => setActiveCategory('trophies')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                  activeCategory === 'trophies'
                    ? 'border-[var(--accent-primary)] bg-[var(--bg-secondary)] text-[var(--accent-primary)] font-bold shadow-glow-sm'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-glow)]'
                }`}
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>TROPHIES & AWARDS</span>
                <span className="text-[10px] opacity-70">(12)</span>
              </button>

              <button
                onClick={() => setActiveCategory('certificates')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                  activeCategory === 'certificates'
                    ? 'border-[var(--accent-primary)] bg-[var(--bg-secondary)] text-[var(--accent-primary)] font-bold shadow-glow-sm'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-glow)]'
                }`}
              >
                <Award className="h-3.5 w-3.5" />
                <span>CERTIFICATES & ACCREDITATIONS</span>
                <span className="text-[10px] opacity-70">(11)</span>
              </button>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* AWARDS & CERTIFICATES PHOTO GALLERY GRID                      */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          ref={gridRef}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
        >
          {filteredAwards.map((item) => {
            const isTrophy = item.category === 'trophies';
            const Icon = isTrophy ? Trophy : Award;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedAward(item)}
                className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden transition-all duration-300 hover:border-[var(--accent-primary)] hover:bg-[var(--bg-secondary)] hover:shadow-glow-md cursor-pointer will-change-transform"
              >
                {/* Photo Frame Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40 flex items-center justify-center p-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* Zoom Inspect Badge Overlay */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--bg-overlay)] border border-[var(--border-glow)] text-[10px] font-mono text-[var(--accent-primary)] shadow-lg backdrop-blur-md">
                    <Maximize2 className="h-3 w-3" />
                    <span>INSPECT</span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--bg-overlay)]/90 border border-[var(--border-subtle)] text-[9px] font-mono tracking-wider uppercase text-[var(--text-secondary)] backdrop-blur-md">
                    <Icon className="h-3 w-3 text-[var(--accent-primary)]" />
                    <span>{item.badge}</span>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2">
                      <span className="text-[var(--accent-primary)] font-bold">#{item.index}</span>
                      <span className="truncate max-w-[170px] uppercase">{item.issuer}</span>
                    </div>

                    <h3 className="mt-3 font-display text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="mt-1 font-mono text-[11px] text-[var(--text-secondary)] font-medium line-clamp-1">
                      {item.subtitle}
                    </p>

                    <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed font-sans line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)]">
                    <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                      <CheckCircle2 className="h-3 w-3 text-[var(--accent-primary)]" />
                      VERIFIED PROOF
                    </span>
                    <span className="text-[var(--accent-primary)] font-bold group-hover:translate-x-0.5 transition-transform">
                      VIEW →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* NARRATIVE SECTION HANDOFF                                     */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          ref={handoffRef}
          className="mt-14 w-full flex flex-col sm:flex-row items-center justify-between border-t border-[var(--border-subtle)] pt-6 font-mono text-xs text-[var(--text-muted)] gap-4 will-change-transform"
        >
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[11px]">
            <ShieldCheck className="h-4 w-4 text-[var(--accent-primary)]" />
            <span className="tracking-widest uppercase font-semibold">
              NATIONAL & INDUSTRY ACCREDITED CREATIVE TECH LABS
            </span>
          </div>

          <MagneticButton
            variant="primary"
            cursorText="APPLY"
            className="px-7 py-3 text-xs font-bold rounded-full shadow-glow-sm"
            onClick={() => {
              const el = document.getElementById('cta');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            JOIN 2026 COHORTS <ArrowDown className="h-3.5 w-3.5 ml-1.5 inline" />
          </MagneticButton>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FULLSCREEN HIGH-RESOLUTION LIGHTBOX INSPECTOR MODAL           */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedAward && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setSelectedAward(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row rounded-2xl border border-[var(--border-glow)] bg-[var(--bg-secondary)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedAward(null)}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
              aria-label="Close inspector"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left/Top: High-Res Image Display */}
            <div className="relative md:w-3/5 min-h-[300px] md:min-h-[480px] bg-black/60 flex items-center justify-center p-6 sm:p-8">
              <img
                src={selectedAward.image}
                alt={selectedAward.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
              />

              {/* Prev / Next Modal Arrows */}
              <div className="absolute inset-y-0 left-3 flex items-center">
                <button
                  onClick={handlePrev}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-overlay)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
                  aria-label="Previous award"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>

              <div className="absolute inset-y-0 right-3 flex items-center">
                <button
                  onClick={handleNext}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-overlay)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
                  aria-label="Next award"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right/Bottom: Award Metadata & Narrative */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6 border-t md:border-t-0 md:border-l border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--accent-primary)] font-bold tracking-widest uppercase">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                  <span>{selectedAward.badge}</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
                  {selectedAward.title}
                </h3>

                <div className="space-y-1 font-mono text-xs">
                  <div className="text-[var(--accent-primary)] font-semibold uppercase">
                    {selectedAward.subtitle}
                  </div>
                  <div className="text-[var(--text-muted)] uppercase text-[10px]">
                    ISSUED BY // {selectedAward.issuer}
                  </div>
                </div>

                <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-2 border-t border-[var(--border-subtle)]">
                  {selectedAward.description}
                </p>
              </div>

              {/* Modal Bottom Verification */}
              <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-muted)]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                  <span>OFFICIAL TAFRISHAALA RECOGNITION</span>
                </div>

                <div className="flex items-center gap-2">
                  <MagneticButton
                    variant="primary"
                    cursorText="APPLY"
                    className="w-full py-2.5 text-xs font-mono font-bold tracking-wider text-center"
                    onClick={() => {
                      setSelectedAward(null);
                      const el = document.getElementById('cta');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    JOIN COHORTS <ArrowRight className="h-3.5 w-3.5 ml-1 inline" />
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
