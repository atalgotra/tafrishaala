'use client';

import React, { useRef, useEffect } from 'react';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ArrowDown } from 'lucide-react';

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

  const prefersReducedMotion = useReducedMotion();

  // Signature Particle Spark Engine (TAFRISHAALA -> PARTICLES -> FUTURE)
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

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      decay: number;
      color: string;
    }

    const sparks: Spark[] = [];
    let scrollProgress = 0;

    const spawnSparks = (intensity: number) => {
      const colors = [
        '#ffffff',
        'var(--accent-primary)',
        'var(--accent-secondary)',
        'var(--particle-color)',
      ];
      const count = Math.floor(intensity * 8) + 1;

      for (let i = 0; i < count; i++) {
        const spreadX = (Math.random() - 0.5) * (width * 0.75);
        const originY = height * 0.42 + (Math.random() - 0.5) * 50;

        sparks.push({
          x: width / 2 + spreadX,
          y: originY,
          vx: (Math.random() - 0.5) * (2.5 + intensity * 3),
          vy: (Math.random() * 2.5 + 1.2) * (1 + intensity * 2),
          size: Math.random() * 2.2 + 0.6,
          alpha: Math.random() * 0.8 + 0.2,
          decay: Math.random() * 0.015 + 0.008,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    // Global listener for progress update
    (window as any).__onHeroScrollProgress = (progress: number) => {
      scrollProgress = progress;
      if (progress > 0.15 && progress < 0.9) {
        const intensity = Math.sin(((progress - 0.15) / 0.75) * Math.PI);
        spawnSparks(intensity);
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Dynamic ambient lighting boost during scroll scrub
      if (scrollProgress > 0.1 && scrollProgress < 0.9) {
        const lightIntensity = Math.sin(((scrollProgress - 0.1) / 0.8) * Math.PI);
        const grad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.45,
          0,
          width * 0.5,
          height * 0.45,
          width * 0.65
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${0.05 * lightIntensity})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > height || p.x < 0 || p.x > width) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
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
      delete (window as any).__onHeroScrollProgress;
      cancelAnimationFrame(animId);
    };
  }, [prefersReducedMotion]);

  useGsap(
    () => {
      if (prefersReducedMotion || !containerRef.current || !pinStageRef.current) return;

      const chars = wordmarkRef.current?.querySelectorAll('.hero-letter');

      // ─────────────────────────────────────────────────────────────
      // 1. ARRIVAL & SYSTEM BOOT SEQUENCE (Page Load Timeline)
      // ─────────────────────────────────────────────────────────────
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
        // If already scrolled on page load, instantly settle the intro state
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

      // ─────────────────────────────────────────────────────────────
      // 2. CONTINUOUS REVERSIBLE SCROLL TRANSFORMATION
      // (Explicit fromTo definitions guarantee progress=0 is ALWAYS fully restored)
      // ─────────────────────────────────────────────────────────────
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

      // Physical disintegration of TAFRISHAALA letters into particle field
      if (chars && chars.length > 0) {
        const trajectories = [
          { x: -140, y: -90, z: 280, rZ: -25, rY: -35, rX: 25, blur: 14 }, // T
          { x: -100, y: -150, z: 240, rZ: -16, rY: -18, rX: 40, blur: 12 }, // A
          { x: -60, y: -80, z: 380, rZ: -8, rY: 25, rX: -30, blur: 14 }, // F
          { x: -30, y: -170, z: 340, rZ: 12, rY: -20, rX: 45, blur: 16 }, // R
          { x: 0, y: -210, z: 480, rZ: 0, rY: 0, rX: 50, blur: 18 }, // I (center ejects forward)
          { x: 30, y: -160, z: 340, rZ: -12, rY: 20, rX: -40, blur: 16 }, // S
          { x: 60, y: -80, z: 380, rZ: 10, rY: -25, rX: 35, blur: 14 }, // H
          { x: 100, y: -140, z: 240, rZ: 18, rY: 18, rX: -35, blur: 12 }, // A
          { x: 135, y: -100, z: 300, rZ: -20, rY: 30, rX: 25, blur: 14 }, // A
          { x: 170, y: -130, z: 280, rZ: 26, rY: -35, rX: -30, blur: 15 }, // L
          { x: 210, y: -70, z: 340, rZ: 36, rY: 40, rX: 40, blur: 16 }, // A
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

  return (
    <div ref={containerRef} id="hero-container" className="relative w-full">
      {/* Pinned Stage Canvas */}
      <section
        ref={pinStageRef}
        id="hero"
        aria-label="Hero Section"
        className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden px-6 pt-28 pb-10 sm:pt-32 lg:px-12"
        style={{ perspective: '1400px' }}
      >
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

        {/* Top Telemetry / Status Indicator */}
        <div className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between font-mono text-[10px] text-[var(--text-muted)] select-none">
          <div ref={bootStatusRef} className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] shadow-glow-sm animate-pulse" />

          </div>

          <div className="hidden sm:flex items-center gap-2 text-[var(--text-muted)]">


          </div>
        </div>

        {/* Center Stage: Monolithic Hero Wordmark */}
        <div className="relative z-30 mx-auto my-auto flex w-full max-w-7xl flex-col items-start justify-center py-4">
          {/* Welcome Tagline */}
          <div
            ref={welcomeRef}
            className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold will-change-transform"
          >
            <span className="h-px w-6 bg-[var(--accent-primary)]" />
            <span>WELCOME TO THE FUTURE</span>
          </div>

          {/* Solid TAFRISHAALA Wordmark */}
          <h1
            ref={wordmarkRef}
            className="font-display text-[16vw] font-black leading-[0.82] tracking-tighter text-[var(--text-primary)] select-none sm:text-[14vw] md:text-[12vw] lg:text-[11vw] -ml-1 will-change-transform"
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          >
            {brandName.split('').map((char, index) => (
              <span key={index} className="inline-block overflow-visible align-top">
                <span className="hero-letter inline-block will-change-transform transition-colors duration-300 hover:text-[var(--accent-primary)]">
                  {char}
                </span>
              </span>
            ))}
          </h1>

          {/* Asymmetric Editorial Supporting Copy & Actions */}
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
            </div>

            <div className="md:col-span-4 flex items-center md:justify-end pt-2 md:pt-0">
              <MagneticButton
                variant="outline"
                cursorText="EXPLORE"
                className="px-6 py-3 text-xs"
                onClick={() => {
                  const el = document.getElementById('statement');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                EXPLORE ECOSYSTEM
              </MagneticButton>
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

          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <span className="tracking-widest uppercase text-[10px]">SCROLL TO TRANSFORM</span>
            <ArrowDown className="h-3 w-3 animate-bounce text-[var(--accent-primary)]" />
          </div>
        </div>
      </section>
    </div>
  );
}
