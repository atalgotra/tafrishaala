'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ArrowDown, ArrowRight, Sparkles, Cpu, Layers, Terminal } from 'lucide-react';

const GLYPHS = ['⚡', '∆', '∑', '0', '1', 'Ω', 'λ', '✦', '§', 'Ψ', 'Ø', 'X', '7'];

function InteractiveLetter({ char, index }: { char: string; index: number }) {
  const [displayChar, setDisplayChar] = useState(char);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const triggerScramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    let step = 0;
    const maxSteps = 8 + (index % 4);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (step >= maxSteps) {
        setDisplayChar(char);
        setIsScrambling(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        setDisplayChar(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
        step++;
      }
    }, 35);
  }, [char, index, isScrambling]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span
      className="inline-block overflow-visible align-top select-none"
      onMouseEnter={triggerScramble}
      onTouchStart={triggerScramble}
    >
      <span
        className={`hero-letter inline-block will-change-transform transition-all duration-300 cursor-pointer ${
          isScrambling
            ? 'text-[var(--accent-primary)] scale-110 drop-shadow-[0_0_12px_var(--accent-glow)]'
            : 'hover:text-[var(--accent-primary)] hover:-translate-y-1'
        }`}
      >
        {displayChar}
      </span>
    </span>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinStageRef = useRef<HTMLElement | null>(null);
  const bootStatusRef = useRef<HTMLDivElement | null>(null);
  const welcomeRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLHeadingElement | null>(null);
  const heroBodyRef = useRef<HTMLDivElement | null>(null);
  const gridOverlayRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const prefersReducedMotion = useReducedMotion();

  // ─────────────────────────────────────────────────────────────
  // 1. FLUID INTERACTIVE PARTICLE FORCE-FIELD CANVAS
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', onResize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseVx: number;
      baseVy: number;
      size: number;
      alpha: number;
      baseAlpha: number;
      color: string;
      life: number;
    }

    const particleCount = Math.min(100, Math.floor(width / 18));
    const particles: Particle[] = [];

    const colors = [
      '#ffffff',
      'var(--accent-primary)',
      'var(--accent-secondary)',
      'var(--particle-color)',
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        baseVx: (Math.random() - 0.5) * 0.4,
        baseVy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.6 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * 100,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let prevMouseX = -1000;
    let prevMouseY = -1000;
    let mouseVx = 0;
    let mouseVy = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (prevMouseX !== -1000) {
        mouseVx = (x - prevMouseX) * 0.4;
        mouseVy = (y - prevMouseY) * 0.4;
      }
      prevMouseX = mouseX = x;
      prevMouseY = mouseY = y;
      setMousePos({ x, y });
    };

    const onMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      prevMouseX = -1000;
      prevMouseY = -1000;
      mouseVx = 0;
      mouseVy = 0;
      setMousePos({ x: -1000, y: -1000 });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });

    let scrollProgress = 0;
    (window as any).__onHeroScrollProgress = (progress: number) => {
      scrollProgress = progress;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Decelerate mouse momentum
      mouseVx *= 0.92;
      mouseVy *= 0.92;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fluid repulsion from cursor
        if (mouseX !== -1000 && mouseY !== -1000) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 160;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 3.5;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force + mouseVx * 0.15;
            p.vy += Math.sin(angle) * force + mouseVy * 0.15;
            p.alpha = Math.min(1, p.baseAlpha + 0.4);
          }
        }

        // Return smoothly to base drift
        p.vx += (p.baseVx - p.vx) * 0.04;
        p.vy += (p.baseVy - p.vy) * 0.04;
        p.alpha += (p.baseAlpha - p.alpha) * 0.03;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha * (1 - scrollProgress * 0.8)));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      delete (window as any).__onHeroScrollProgress;
      cancelAnimationFrame(animId);
    };
  }, [prefersReducedMotion]);

  // ─────────────────────────────────────────────────────────────
  // 2. GSAP INTRO TIMELINE & PINNED SCROLL DISINTEGRATION
  // ─────────────────────────────────────────────────────────────
  useGsap(
    () => {
      if (prefersReducedMotion || !containerRef.current || !pinStageRef.current) return;

      const chars = wordmarkRef.current?.querySelectorAll('.hero-letter');

      const isScrolledAtLoad = typeof window !== 'undefined' && window.scrollY > 20;

      const introTl = gsap.timeline({
        defaults: { ease: 'power4.out' },
      });

      if (!isScrolledAtLoad) {
        introTl
          .fromTo(
            bootStatusRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.15 }
          )
          .fromTo(
            welcomeRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            '-=0.2'
          )
          .fromTo(
            chars || [],
            {
              opacity: 0,
              y: '100%',
              rotateX: 60,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: '0%',
              rotateX: 0,
              scale: 1,
              duration: 1.1,
              stagger: 0.03,
              ease: 'expo.out',
            },
            '-=0.3'
          )
          .fromTo(
            [heroBodyRef.current, scrollIndicatorRef.current],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
            '-=0.5'
          );
      } else {
        gsap.set(
          [
            bootStatusRef.current,
            welcomeRef.current,
            heroBodyRef.current,
            scrollIndicatorRef.current,
          ],
          { opacity: 1, y: 0 }
        );
        if (chars) {
          gsap.set(chars, { opacity: 1, y: '0%', rotateX: 0, scale: 1 });
        }
      }

      // Continuous Reversible Scroll Transformation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=120%',
          pin: pinStageRef.current,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            if ((window as any).__onHeroScrollProgress) {
              (window as any).__onHeroScrollProgress(self.progress);
            }
          },
        },
      });

      // Spatial perspective grid tilt
      scrollTl.fromTo(
        gridOverlayRef.current,
        {
          rotateX: 0,
          scale: 1,
          opacity: 0.03,
        },
        {
          rotateX: 35,
          scale: 1.25,
          opacity: 0.06,
          ease: 'power1.inOut',
          duration: 0.5,
        },
        0
      );

      // Hero secondary copy and buttons fade smoothly into depth
      scrollTl.fromTo(
        [welcomeRef.current, heroBodyRef.current, bootStatusRef.current, scrollIndicatorRef.current],
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
        },
        {
          y: -40,
          opacity: 0,
          filter: 'blur(6px)',
          ease: 'power2.in',
          duration: 0.35,
        },
        0.05
      );

      // Disintegration of letters
      if (chars && chars.length > 0) {
        const trajectories = [
          { x: -140, y: -90, z: 280, rZ: -25, rY: -35, rX: 25, blur: 14 },
          { x: -100, y: -150, z: 240, rZ: -16, rY: -18, rX: 40, blur: 12 },
          { x: -60, y: -80, z: 380, rZ: -8, rY: 25, rX: -30, blur: 14 },
          { x: -30, y: -170, z: 340, rZ: 12, rY: -20, rX: 45, blur: 16 },
          { x: 0, y: -210, z: 480, rZ: 0, rY: 0, rX: 50, blur: 18 },
          { x: 30, y: -160, z: 340, rZ: -12, rY: 20, rX: -40, blur: 16 },
          { x: 60, y: -80, z: 380, rZ: 10, rY: -25, rX: 35, blur: 14 },
          { x: 100, y: -140, z: 240, rZ: 18, rY: 18, rX: -35, blur: 12 },
          { x: 135, y: -100, z: 300, rZ: -20, rY: 30, rX: 25, blur: 14 },
          { x: 170, y: -130, z: 280, rZ: 26, rY: -35, rX: -30, blur: 15 },
          { x: 210, y: -70, z: 340, rZ: 36, rY: 40, rX: 40, blur: 16 },
        ];

        chars.forEach((char, idx) => {
          const t = trajectories[idx] || trajectories[0];
          scrollTl.fromTo(
            char,
            {
              x: 0,
              y: 0,
              z: 0,
              rotationZ: 0,
              rotationY: 0,
              rotationX: 0,
              opacity: 1,
              filter: 'blur(0px)',
              letterSpacing: 'normal',
            },
            {
              x: t.x,
              y: t.y,
              z: t.z,
              rotationZ: t.rZ,
              rotationY: t.rY,
              rotationX: t.rX,
              opacity: 0,
              filter: `blur(${t.blur}px)`,
              letterSpacing: '0.35em',
              ease: 'power2.inOut',
              duration: 0.6,
            },
            0.15 + idx * 0.015
          );
        });
      }
    },
    containerRef,
    [prefersReducedMotion]
  );

  const brandName = 'TAFRISHAALA';

  const handleScrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} id="hero-container" className="relative w-full overflow-hidden">
      {/* Pinned Stage Canvas */}
      <section
        ref={pinStageRef}
        id="hero"
        aria-label="Hero Section"
        className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden px-6 pt-28 pb-10 sm:pt-32 lg:px-12"
        style={{ perspective: '1400px' }}
      >
        {/* Dynamic Volumetric Cursor Spotlight */}
        {mousePos.x !== -1000 && (
          <div
            className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-60 z-10"
            style={{
              background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, var(--accent-glow), transparent 75%)`,
            }}
          />
        )}

        {/* Dynamic Disintegration Particle Spark Canvas */}
        <canvas
          ref={particleCanvasRef}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-20 h-full w-full"
        />

        {/* 3D Tilting Atmospheric Spatial Grid */}
        <div
          ref={gridOverlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03] origin-bottom will-change-transform [background-image:linear-gradient(to_right,var(--text-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--text-primary)_1px,transparent_1px)] [background-size:5rem_5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_70%,transparent_100%)]"
        />

        {/* Top Telemetry Row */}
        <div className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between font-mono text-[10px] text-[var(--text-muted)] select-none">
          <div ref={bootStatusRef} className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] shadow-glow-sm animate-pulse" />
            <span className="tracking-widest uppercase text-[var(--text-secondary)]">
              SYS.BOOT // 01 · CREATIVE TECH LABS
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[var(--text-muted)]">
            <span className="text-[var(--accent-primary)] font-semibold">NOIDA STUDIO</span>
            <span>•</span>
            <span>HYBRID ACCESS</span>
          </div>
        </div>

        {/* Center Stage: Monolithic Hero Wordmark */}
        <div className="relative z-30 mx-auto my-auto flex w-full max-w-7xl flex-col items-start justify-center py-4">
          {/* Welcome Tagline & Technology Chips */}
          <div
            ref={welcomeRef}
            className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3 will-change-transform"
          >
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold">
              <span className="h-px w-6 bg-[var(--accent-primary)]" />
              <span>WELCOME TO THE FUTURE</span>
            </div>

            {/* Quick-Access Interactive Domain Chips */}
            <div className="hidden md:flex items-center gap-2 ml-2">
              <button
                onClick={() => handleScrollToSection('worlds')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all backdrop-blur-md cursor-pointer hover:shadow-glow-sm"
              >
                <Cpu className="h-2.5 w-2.5 text-[var(--accent-primary)]" />
                <span>AI & NEURAL AGENTS</span>
              </button>
              <button
                onClick={() => handleScrollToSection('worlds')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all backdrop-blur-md cursor-pointer hover:shadow-glow-sm"
              >
                <Layers className="h-2.5 w-2.5 text-[var(--accent-secondary)]" />
                <span>SPATIAL 3D WEB</span>
              </button>
              <button
                onClick={() => handleScrollToSection('worlds')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all backdrop-blur-md cursor-pointer hover:shadow-glow-sm"
              >
                <Terminal className="h-2.5 w-2.5 text-[var(--particle-color)]" />
                <span>FULLSTACK ENGINE</span>
              </button>
            </div>
          </div>

          {/* Interactive Decrypted TAFRISHAALA Wordmark */}
          <h1
            ref={wordmarkRef}
            className="font-display text-[16vw] font-black leading-[0.82] tracking-tighter text-[var(--text-primary)] select-none sm:text-[14vw] md:text-[12vw] lg:text-[11vw] -ml-1 will-change-transform"
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          >
            {brandName.split('').map((char, index) => (
              <InteractiveLetter key={index} char={char} index={index} />
            ))}
          </h1>

          {/* Editorial Supporting Copy & Dual Action Conversion Deck */}
          <div
            ref={heroBodyRef}
            className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end w-full will-change-transform"
          >
            <div className="md:col-span-8 space-y-2">
              <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl md:text-4xl lg:text-5xl">
                LEARN TO BUILD THE FUTURE.
              </h2>
              <p className="max-w-xl font-sans text-sm leading-relaxed text-[var(--text-secondary)] md:text-base font-normal">
                An interactive technology education platform where you master real-world software engineering, AI systems, and modern digital platforms through hands-on creation.
              </p>

              {/* Trust Metric Strip */}
              <div className="pt-2 flex items-center gap-4 text-[10px] font-mono text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
                  100% Hands-On Building
                </span>
                <span>•</span>
                <span>Production Tech Stacks</span>
                <span>•</span>
                <span>Zero Fluff</span>
              </div>
            </div>

            {/* Dual Action Conversion Buttons */}
            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5 pt-2 md:pt-0">
              <div className="flex items-center gap-3">
                <MagneticButton
                  variant="primary"
                  cursorText="EXPLORE"
                  className="px-6 py-3 text-xs font-mono font-bold tracking-wider rounded-full shadow-glow-sm"
                  onClick={() => handleScrollToSection('tracks')}
                >
                  EXPLORE TRACKS <ArrowRight className="h-3.5 w-3.5 ml-1.5 inline" />
                </MagneticButton>

                <MagneticButton
                  variant="outline"
                  cursorText="ADMISSIONS"
                  className="px-5 py-3 text-xs font-mono tracking-wider rounded-full"
                  onClick={() => handleScrollToSection('cta')}
                >
                  ADMISSIONS
                </MagneticButton>
              </div>

              {/* Live Status Beacon */}
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-[var(--text-muted)] pt-1">
                <span className="flex h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                <span className="tracking-widest uppercase text-[var(--accent-primary)] font-semibold">
                  2026 ADMISSIONS ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Telemetry Anchor */}
        <div
          ref={scrollIndicatorRef}
          className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between border-t border-[var(--border-subtle)] pt-4 font-mono text-[11px] text-[var(--text-muted)]"
        >
          <span className="tracking-widest uppercase text-[var(--text-secondary)]">
            TAFRISHAALA // 2026
          </span>

          <div
            onClick={() => handleScrollToSection('statement')}
            className="flex items-center gap-2 text-[var(--text-muted)] cursor-pointer hover:text-[var(--accent-primary)] transition-colors"
          >
            <span className="tracking-widest uppercase text-[10px]">SCROLL TO TRANSFORM</span>
            <ArrowDown className="h-3 w-3 animate-bounce text-[var(--accent-primary)]" />
          </div>
        </div>
      </section>
    </div>
  );
}
