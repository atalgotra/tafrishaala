'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';
import { useCursor } from '@/context/CursorContext';
import { useTheme } from '@/context/ThemeContext';
import { TECHNOLOGY_WORLDS, WorldId } from '@/lib/worlds';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { lerp } from '@/lib/utils';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Globe,
  Smartphone,
  Cpu,
  Cloud,
  Palette,
  Radio,
} from 'lucide-react';

const WORLD_ICONS: Record<WorldId, React.ElementType> = {
  web: Globe,
  mobile: Smartphone,
  ai: Cpu,
  cloud: Cloud,
  design: Palette,
  digital: Radio,
};

const SAFE_ZONE_HALF_WIDTH = 280;
const SAFE_ZONE_HALF_HEIGHT = 150;

export function WhatToBuildSection() {
  const [selectedWorld, setSelectedWorld] = useState<WorldId | null>(null);
  const [hoveredWorld, setHoveredWorld] = useState<WorldId | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<WorldId | null>('web');
  const [scaleFactor, setScaleFactor] = useState(1);

  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const centerPromptRef = useRef<HTMLDivElement | null>(null);
  const constellationRef = useRef<HTMLDivElement | null>(null);
  const bridgeRef = useRef<HTMLDivElement | null>(null);

  const nodeOffsets = useRef<Record<string, { currentX: number; currentY: number; targetX: number; targetY: number }>>({
    web: { currentX: 0, currentY: 0, targetX: 0, targetY: 0 },
    design: { currentX: 0, currentY: 0, targetX: 0, targetY: 0 },
    mobile: { currentX: 0, currentY: 0, targetX: 0, targetY: 0 },
    digital: { currentX: 0, currentY: 0, targetX: 0, targetY: 0 },
    ai: { currentX: 0, currentY: 0, targetX: 0, targetY: 0 },
    cloud: { currentX: 0, currentY: 0, targetX: 0, targetY: 0 },
  });

  const mouseRel = useRef({ x: 0, y: 0 });
  const isPointerInside = useRef(false);

  const { setCursorMode, resetCursor } = useCursor();
  const { themeConfig } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  // Dynamic responsive scale factor
  useEffect(() => {
    const calculateScale = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      if (w >= 1440) setScaleFactor(1.1);
      else if (w >= 1200) setScaleFactor(1.0);
      else if (w >= 1024) setScaleFactor(0.92);
      else setScaleFactor(0.85);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // Keyboard navigation: Escape resets selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedWorld) {
        setSelectedWorld(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWorld]);

  // Constrained magnetic physics loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    let rafId: number;

    const updatePhysics = () => {
      const W_safe = SAFE_ZONE_HALF_WIDTH * scaleFactor;
      const H_safe = SAFE_ZONE_HALF_HEIGHT * scaleFactor;

      TECHNOLOGY_WORLDS.forEach((world) => {
        const offset = nodeOffsets.current[world.id];
        if (!offset) return;

        const baseX = world.position.desktop.x * scaleFactor;
        const baseY = world.position.desktop.y * scaleFactor;

        if (isPointerInside.current && !selectedWorld) {
          const dx = mouseRel.current.x - baseX;
          const dy = mouseRel.current.y - baseY;
          const dist = Math.hypot(dx, dy);

          if (dist < 220) {
            const pullStrength = (1 - dist / 220) * 20;
            const dirX = dx / (dist || 1);
            const dirY = dy / (dist || 1);

            const proposedX = baseX + dirX * pullStrength;
            const proposedY = baseY + dirY * pullStrength;

            const dSafe = Math.hypot(proposedX / W_safe, proposedY / H_safe);

            if (dSafe < 1.05) {
              const clampedX = (proposedX / dSafe) * 1.05;
              const clampedY = (proposedY / dSafe) * 1.05;
              offset.targetX = clampedX - baseX;
              offset.targetY = clampedY - baseY;
            } else {
              offset.targetX = dirX * pullStrength;
              offset.targetY = dirY * pullStrength;
            }
          } else {
            offset.targetX = 0;
            offset.targetY = 0;
          }
        } else {
          offset.targetX = 0;
          offset.targetY = 0;
        }

        offset.currentX = lerp(offset.currentX, offset.targetX, 0.12);
        offset.currentY = lerp(offset.currentY, offset.targetY, 0.12);

        const el = document.getElementById(`world-node-${world.id}`);
        if (el) {
          const finalX = baseX + offset.currentX;
          const finalY = baseY + offset.currentY;
          el.style.transform = `translate(${finalX}px, ${finalY}px)`;
        }
      });

      rafId = requestAnimationFrame(updatePhysics);
    };

    rafId = requestAnimationFrame(updatePhysics);

    return () => cancelAnimationFrame(rafId);
  }, [scaleFactor, selectedWorld, prefersReducedMotion]);

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRel.current.x = e.clientX - (rect.left + rect.width / 2);
    mouseRel.current.y = e.clientY - (rect.top + rect.height / 2);
    isPointerInside.current = true;
  };

  const handleContainerMouseLeave = () => {
    isPointerInside.current = false;
  };

  // High-End Clean Orbital Horizon Canvas (Zero Spiderweb Cross-Lines)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', onResize);

    // Orbital dust particles
    const PARTICLE_COUNT = 24;
    const orbitalParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      angle: (i / PARTICLE_COUNT) * Math.PI * 2,
      orbitRadius: i % 2 === 0 ? 380 : 250,
      speed: (i % 2 === 0 ? 0.003 : -0.004) * (0.8 + Math.random() * 0.4),
      size: 1 + Math.random() * 1.5,
      alpha: 0.3 + Math.random() * 0.5,
    }));

    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const accent = themeConfig.accent;

      ctx.save();

      // 1. Central Ambient Radial Aura
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 320 * scaleFactor);
      coreGrad.addColorStop(0, `${accent}18`);
      coreGrad.addColorStop(0.6, `${accent}04`);
      coreGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 320 * scaleFactor, 0, Math.PI * 2);
      ctx.fill();

      // 2. High-Precision Concentric Orbital Ellipses
      ctx.strokeStyle = accent;
      
      // Outer Major Orbit
      ctx.globalAlpha = 0.08 + 0.03 * Math.sin(frame * 0.02);
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 420 * scaleFactor, 240 * scaleFactor, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Minor Orbit
      ctx.globalAlpha = 0.05 + 0.02 * Math.cos(frame * 0.025);
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 280 * scaleFactor, 160 * scaleFactor, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Smooth Orbiting Micro-Dust
      for (let i = 0; i < orbitalParticles.length; i++) {
        const pt = orbitalParticles[i];
        pt.angle += pt.speed;

        const rx = pt.orbitRadius * scaleFactor;
        const ry = (pt.orbitRadius * 0.58) * scaleFactor;
        const px = centerX + Math.cos(pt.angle) * rx;
        const py = centerY + Math.sin(pt.angle) * ry;

        ctx.fillStyle = accent;
        ctx.globalAlpha = pt.alpha * (0.5 + 0.5 * Math.sin(frame * 0.05 + i));
        ctx.beginPath();
        ctx.arc(px, py, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Focused Dynamic Energy Beam when hovering over a node
      if (hoveredWorld && !selectedWorld) {
        const hoveredNode = TECHNOLOGY_WORLDS.find((w) => w.id === hoveredWorld);
        if (hoveredNode) {
          const off = nodeOffsets.current[hoveredWorld] || { currentX: 0, currentY: 0 };
          const nx = centerX + hoveredNode.position.desktop.x * scaleFactor + off.currentX;
          const ny = centerY + hoveredNode.position.desktop.y * scaleFactor + off.currentY;

          // Luminous laser tether from center to node
          const beamGrad = ctx.createLinearGradient(centerX, centerY, nx, ny);
          beamGrad.addColorStop(0, 'transparent');
          beamGrad.addColorStop(0.5, `${accent}40`);
          beamGrad.addColorStop(1, accent);

          ctx.strokeStyle = beamGrad;
          ctx.lineWidth = 2.0;
          ctx.shadowColor = accent;
          ctx.shadowBlur = 10;
          ctx.globalAlpha = 0.7;

          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(nx, ny);
          ctx.stroke();
        }
      }

      ctx.restore();

      frame++;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [selectedWorld, hoveredWorld, scaleFactor, themeConfig, prefersReducedMotion]);

  // Section reveal animation
  useGsap(
    () => {
      if (prefersReducedMotion || !sectionRef.current) return;

      const nodes = constellationRef.current?.querySelectorAll('.world-node');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        centerPromptRef.current,
        { opacity: 0, y: 25, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' },
        0
      );

      if (nodes && nodes.length > 0) {
        tl.fromTo(
          nodes,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            stagger: 0.05,
            duration: 0.6,
            ease: 'back.out(1.4)',
          },
          0.2
        );
      }

      tl.fromTo(
        bridgeRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        0.5
      );
    },
    sectionRef,
    [prefersReducedMotion]
  );

  const activeWorldConfig = TECHNOLOGY_WORLDS.find((w) => w.id === selectedWorld);

  return (
    <section
      ref={sectionRef}
      id="build"
      aria-label="What Do You Want To Build Section"
      className="relative z-20 flex min-h-[90vh] w-full flex-col justify-center border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] px-6 py-24 lg:px-12 overflow-hidden select-none"
    >
      {/* High-End Ambient Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-90 transition-opacity duration-700"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* DESKTOP SPATIAL CONSTELLATION MATRIX (≥ 768px)               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
        className="relative z-10 hidden md:flex mx-auto max-w-7xl h-[720px] w-full items-center justify-center"
      >
        {/* Central Protected Headline Box */}
        <div
          ref={centerPromptRef}
          className={`absolute text-center flex flex-col items-center justify-center transition-all duration-500 will-change-transform z-10 max-w-xl px-6 ${
            selectedWorld
              ? 'opacity-0 scale-95 pointer-events-none'
              : 'opacity-100 scale-100 pointer-events-auto'
          }`}
        >
          <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-[var(--accent-primary)] uppercase font-semibold flex items-center justify-center gap-2">
            <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
            // 03 CREATIVE INTENT
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.05]">
            WHAT DO YOU WANT<br />TO BUILD?
          </h2>

          <p className="mt-4 font-mono text-xs text-[var(--text-secondary)] tracking-widest uppercase">
            SELECT A DOMAIN TO EXPLORE THE ENVIRONMENT
          </p>
        </div>

        {/* 6 Tactile Luxury Domain Badges */}
        <div
          ref={constellationRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          {TECHNOLOGY_WORLDS.map((world) => {
            const Icon = WORLD_ICONS[world.id];
            const isSelected = selectedWorld === world.id;
            const isHovered = hoveredWorld === world.id;
            const hasSelection = selectedWorld !== null;

            return (
              <button
                key={world.id}
                id={`world-node-${world.id}`}
                onClick={() => setSelectedWorld(isSelected ? null : world.id)}
                onMouseEnter={() => {
                  setHoveredWorld(world.id);
                  setCursorMode('magnetic', 'SELECT');
                }}
                onMouseLeave={() => {
                  setHoveredWorld(null);
                  resetCursor();
                }}
                aria-pressed={isSelected}
                aria-label={`Select ${world.name} World`}
                className={`world-node pointer-events-auto absolute flex items-center gap-3 rounded-full border px-6 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 backdrop-blur-xl will-change-transform focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] cursor-pointer shadow-lg ${
                  isSelected
                    ? 'border-[var(--accent-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-glow-md scale-110 z-30'
                    : hasSelection
                    ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] opacity-20 scale-85 hover:opacity-80 z-10'
                    : isHovered
                    ? 'border-[var(--accent-primary)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-glow-sm scale-105 z-20 ring-1 ring-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-glow)] hover:text-[var(--text-primary)] z-10'
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[10px] text-[var(--accent-primary)] font-bold">
                  {world.index}
                </span>
                <span>{world.name}</span>
                <Icon className="h-4 w-4 text-[var(--accent-primary)] ml-0.5" />
              </button>
            );
          })}
        </div>

        {/* Selected World Details Modal / Spotlight Card */}
        {selectedWorld && activeWorldConfig && (
          <div
            className="absolute z-40 mx-auto max-w-xl w-full text-center flex flex-col items-center justify-center p-8 lg:p-10 rounded-2xl border border-[var(--border-glow)] bg-[var(--bg-secondary)] shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300"
          >
            <div className="font-mono text-[10px] tracking-[0.3em] text-[var(--accent-primary)] uppercase font-semibold flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
              {activeWorldConfig.index} // DOMAIN SPOTLIGHT
            </div>

            <h3 className="mt-3 font-display text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-primary)]">
              {activeWorldConfig.name}
            </h3>

            <p className="mt-2 font-mono text-xs text-[var(--accent-primary)] font-semibold uppercase tracking-wider">
              {activeWorldConfig.tagline}
            </p>

            <p className="mt-4 font-sans text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
              {activeWorldConfig.description}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <MagneticButton
                variant="primary"
                cursorText="EXPLORE"
                className="px-7 py-3 text-xs font-mono font-bold tracking-wider"
                onClick={() => {
                  const el = document.getElementById('tracks') || document.getElementById('cta');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                EXPLORE {activeWorldConfig.name} TRACKS <ArrowRight className="h-3.5 w-3.5 ml-1 inline" />
              </MagneticButton>

              <button
                onClick={() => setSelectedWorld(null)}
                className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5 px-3 py-2 cursor-pointer focus:outline-none"
                aria-label="Return to constellation overview"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> ALL DOMAINS
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE VERTICAL INTENTIONAL ACCORDION (< 768px)               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 block md:hidden mx-auto max-w-md w-full">
        <div className="mb-8">
          <div className="mb-2 font-mono text-[10px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
            // 03 CREATIVE INTENT
          </div>
          <h2 className="font-display text-3xl font-black tracking-tight text-[var(--text-primary)]">
            WHAT DO YOU WANT TO BUILD?
          </h2>
        </div>

        {/* Mobile Vertical World Cards */}
        <div className="space-y-3">
          {TECHNOLOGY_WORLDS.map((world) => {
            const Icon = WORLD_ICONS[world.id];
            const isExpanded = mobileExpanded === world.id;

            return (
              <div
                key={world.id}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? 'border-[var(--accent-primary)] bg-[var(--bg-secondary)] shadow-glow-sm'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                }`}
              >
                <button
                  onClick={() => setMobileExpanded(isExpanded ? null : world.id)}
                  className="w-full flex items-center justify-between p-4 text-left font-mono text-xs font-bold uppercase tracking-wider min-h-[60px] cursor-pointer"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-primary)] text-[10px] text-[var(--accent-primary)]">
                      {world.index}
                    </span>
                    <span className="text-[var(--text-primary)] text-sm font-bold">{world.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[var(--accent-primary)]" />
                    <ChevronDown
                      className={`h-4 w-4 text-[var(--text-muted)] transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-[var(--accent-primary)]' : ''
                      }`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-5 pt-1 border-t border-[var(--border-subtle)] space-y-3">
                    <p className="font-mono text-[11px] text-[var(--accent-primary)] font-semibold">
                      {world.tagline}
                    </p>
                    <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                      {world.description}
                    </p>
                    <button
                      onClick={() => {
                        const el = document.getElementById('tracks') || document.getElementById('cta');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full rounded-full bg-[var(--accent-primary)] py-3 text-center font-mono text-xs font-bold uppercase tracking-widest text-[var(--bg-primary)] min-h-[48px] cursor-pointer active:scale-95 transition-transform"
                    >
                      EXPLORE {world.name} TRACKS →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 04 → SECTION 05 NARRATIVE BRIDGE                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        ref={bridgeRef}
        className="relative z-10 mx-auto mt-12 max-w-7xl w-full border-t border-[var(--border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between font-mono text-xs text-[var(--text-muted)] gap-4 will-change-transform"
      >
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
          <span className="tracking-widest uppercase">THE LEARNING PROTOCOL</span>
        </div>

        <span className="tracking-widest uppercase text-[10px] text-[var(--text-muted)]">
          NEXT: THE LEARNING JOURNEY — HOW YOU WILL BUILD IT ↓
        </span>
      </div>
    </section>
  );
}
