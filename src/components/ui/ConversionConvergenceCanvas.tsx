'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface ConversionConvergenceCanvasProps {
  progress: number;
}

export function ConversionConvergenceCanvas({ progress }: ConversionConvergenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // 16 Inward Vector Paths
    const PATH_COUNT = 16;
    const paths = Array.from({ length: PATH_COUNT }, (_, i) => {
      const angle = (i * Math.PI * 2) / PATH_COUNT;
      return {
        baseAngle: angle,
        wobbleSpeed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        lengthOffset: 0.8 + Math.random() * 0.4,
      };
    });

    // Ambient floating luminous particles
    const PARTICLE_COUNT = 20;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      distRatio: 0.2 + Math.random() * 0.8,
      speed: 0.001 + Math.random() * 0.002,
      size: 1 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.4,
    }));

    let time = 0;

    const render = () => {
      time += 0.015;
      const p = Math.min(0.9999, Math.max(0, progressRef.current));

      // Read theme colors
      const computed = getComputedStyle(canvas);
      const accentColor = computed.getPropertyValue('--accent-primary').trim() || '#FF8A00';
      const glowColor = computed.getPropertyValue('--border-glow').trim() || 'rgba(255,138,0,0.25)';

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.42; // Center slightly above middle for headline placement
      const maxRadius = Math.max(width, height) * 0.75;

      // Convergence factor: 1.0 (dispersed) -> 0.05 (converged)
      // Smooth contracting curve
      const convergence = Math.max(0.04, Math.pow(1 - Math.min(1, p * 1.3), 1.8));
      const currentRadius = maxRadius * convergence;

      ctx.save();

      // ─────────────────────────────────────────────────────────────
      // 1. AMBIENT GRAVITATIONAL PARTICLES
      // ─────────────────────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        pt.distRatio -= pt.speed * (1 + (1 - convergence) * 2);
        if (pt.distRatio < 0.02) {
          pt.distRatio = 0.8 + Math.random() * 0.2;
          pt.angle = Math.random() * Math.PI * 2;
        }

        const r = pt.distRatio * maxRadius * Math.max(0.1, convergence * 1.2);
        const px = cx + Math.cos(pt.angle + time * 0.2) * r;
        const py = cy + Math.sin(pt.angle + time * 0.2) * r;

        ctx.fillStyle = glowColor;
        ctx.globalAlpha = pt.alpha * (0.4 + 0.6 * Math.sin(time * 2 + i));
        ctx.beginPath();
        ctx.arc(px, py, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ─────────────────────────────────────────────────────────────
      // 2. CONVERGING LUMINOUS VECTOR PATHWAYS
      // ─────────────────────────────────────────────────────────────
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const angle = path.baseAngle + 0.05 * Math.sin(time * path.wobbleSpeed + path.phase);
        const outerR = maxRadius * 0.95;
        const innerR = Math.max(8, currentRadius * path.lengthOffset);

        const startX = cx + Math.cos(angle) * outerR;
        const startY = cy + Math.sin(angle) * outerR;
        const endX = cx + Math.cos(angle) * innerR;
        const endY = cy + Math.sin(angle) * innerR;

        // Path Line Gradient
        const grad = ctx.createLinearGradient(startX, startY, endX, endY);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.4, glowColor);
        grad.addColorStop(1, accentColor);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.4 + 0.5 * Math.min(1, p * 1.5);
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Perimeter origin dot
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(endX, endY, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // ─────────────────────────────────────────────────────────────
      // 3. CENTRAL LUMINOUS CONVERGENCE NUCLEUS
      // ─────────────────────────────────────────────────────────────
      const centralBloomProgress = Math.min(1, Math.max(0, (p - 0.35) / 0.40)); // 0 -> 1
      if (centralBloomProgress > 0) {
        const breath = 1 + 0.12 * Math.sin(time * 2.5);
        const coreRadius = (8 + 14 * centralBloomProgress) * breath;
        const outerGlowRadius = (40 + 120 * centralBloomProgress) * breath;

        // Outer Radial Aura
        const auraGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerGlowRadius);
        auraGrad.addColorStop(0, glowColor);
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.globalAlpha = 0.5 * centralBloomProgress;
        ctx.beginPath();
        ctx.arc(cx, cy, outerGlowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Central Bright Core
        ctx.fillStyle = accentColor;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 24 * centralBloomProgress;
        ctx.globalAlpha = centralBloomProgress;
        ctx.beginPath();
        ctx.arc(cx, cy, coreRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // White hot center
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(cx, cy, coreRadius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
    />
  );
}
