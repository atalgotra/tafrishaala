'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface MethodProceduralCanvasProps {
  progress: number;
}

export function MethodProceduralCanvas({ progress }: MethodProceduralCanvasProps) {
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

    // Particle nodes for ambient floating dust
    const PARTICLE_COUNT = 36;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
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

      const cx = width * 0.58; // Center slightly right of center during principles
      const cy = height * 0.50;
      const baseRadius = Math.min(width, height) * 0.24;

      // ─────────────────────────────────────────────────────────────
      // 1. AMBIENT PARTICLES (Subtle luminous dust)
      // ─────────────────────────────────────────────────────────────
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        pt.x = (pt.x + pt.vx + 1) % 1;
        pt.y = (pt.y + pt.vy + 1) % 1;

        const px = pt.x * width;
        const py = pt.y * height;

        ctx.fillStyle = glowColor;
        ctx.globalAlpha = pt.alpha * (0.3 + 0.7 * Math.sin(time + i));
        ctx.beginPath();
        ctx.arc(px, py, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // ─────────────────────────────────────────────────────────────
      // 2. PROCEDURAL EVOLUTION GEOMETRY BASED ON PROGRESS (p)
      // ─────────────────────────────────────────────────────────────
      ctx.save();

      if (p < 0.12) {
        // ───────────────────────────────────────────────────────────
        // PHASE 0: INTRO POINT & ORIGIN (p ∈ [0.00, 0.12])
        // ───────────────────────────────────────────────────────────
        const t = p / 0.12;
        const pulse = 1 + 0.08 * Math.sin(time * 3);
        const ptRadius = (4 + 6 * t) * pulse;

        // Concentric aura
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 0.8 * (0.4 + 0.6 * t));
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 0.8 * (0.4 + 0.6 * t), 0, Math.PI * 2);
        ctx.fill();

        // Central nucleus
        ctx.fillStyle = accentColor;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(cx, cy, ptRadius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p < 0.28) {
        // ───────────────────────────────────────────────────────────
        // PHASE 1: INNOVATIVE — BRANCHING EXPLORATION (p ∈ [0.12, 0.28])
        // ───────────────────────────────────────────────────────────
        const t = (p - 0.12) / 0.16; // 0 -> 1
        const branches = 6;

        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 8;

        for (let i = 0; i < branches; i++) {
          const angle = (i * Math.PI * 2) / branches + time * 0.2;
          const branchLen = baseRadius * (0.3 + 0.7 * t);

          const endX = cx + Math.cos(angle) * branchLen;
          const endY = cy + Math.sin(angle) * branchLen;

          // Main branch line
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Sub-branches
          if (t > 0.4) {
            const subT = (t - 0.4) / 0.6;
            const subAngle1 = angle + 0.4;
            const subAngle2 = angle - 0.4;
            const subLen = branchLen * 0.4 * subT;

            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX + Math.cos(subAngle1) * subLen, endY + Math.sin(subAngle1) * subLen);
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX + Math.cos(subAngle2) * subLen, endY + Math.sin(subAngle2) * subLen);
            ctx.stroke();

            // End nodes
            ctx.fillStyle = accentColor;
            ctx.beginPath();
            ctx.arc(endX, endY, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Center nucleus
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (p < 0.46) {
        // ───────────────────────────────────────────────────────────
        // PHASE 2: CREATIVITY — MULTI-FORM COMBINATION (p ∈ [0.28, 0.46])
        // ───────────────────────────────────────────────────────────
        const t = (p - 0.28) / 0.18; // 0 -> 1
        const forms = 3;
        const rotBase = time * 0.3;

        ctx.lineWidth = 1.5;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 10;

        for (let f = 0; f < forms; f++) {
          const formRadius = baseRadius * (0.45 + 0.25 * f) * (0.8 + 0.2 * t);
          const fRot = rotBase * (f % 2 === 0 ? 1 : -1) + (f * Math.PI) / 3;
          const sides = 3 + f; // Triangle, Square, Pentagon

          ctx.strokeStyle = f === 0 ? accentColor : glowColor;
          ctx.beginPath();

          for (let s = 0; s <= sides; s++) {
            const a = fRot + (s * Math.PI * 2) / sides;
            const px = cx + Math.cos(a) * formRadius;
            const py = cy + Math.sin(a) * formRadius;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // Vertex intersections
          for (let s = 0; s < sides; s++) {
            const a = fRot + (s * Math.PI * 2) / sides;
            const px = cx + Math.cos(a) * formRadius;
            const py = cy + Math.sin(a) * formRadius;
            ctx.fillStyle = accentColor;
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (p < 0.64) {
        // ───────────────────────────────────────────────────────────
        // PHASE 3: ADAPTABILITY — CONTINUOUS RECONFIGURATION (p ∈ [0.46, 0.64])
        // ───────────────────────────────────────────────────────────
        const t = (p - 0.46) / 0.18; // 0 -> 1
        const nodes = 8;
        const morphPoints: { x: number; y: number }[] = [];

        for (let i = 0; i < nodes; i++) {
          const a = (i * Math.PI * 2) / nodes + time * 0.25;
          const rOffset = Math.sin(time * 2 + i * 1.5) * baseRadius * 0.25 * (1 - 0.3 * t);
          const r = baseRadius * (0.7 + 0.15 * Math.cos(i * 3 + time)) + rOffset;

          morphPoints.push({
            x: cx + Math.cos(a) * r,
            y: cy + Math.sin(a) * r,
          });
        }

        // Connect fluid spline loops
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        for (let i = 0; i < nodes; i++) {
          const curr = morphPoints[i];
          const next = morphPoints[(i + 1) % nodes];
          const midX = (curr.x + next.x) / 2;
          const midY = (curr.y + next.y) / 2;

          if (i === 0) ctx.moveTo(midX, midY);
          ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
        }
        ctx.closePath();
        ctx.stroke();

        // Inner adaptive cross-connections
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        for (let i = 0; i < nodes; i += 2) {
          const p1 = morphPoints[i];
          const p2 = morphPoints[(i + 4) % nodes];
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Vertex nodes
        for (let i = 0; i < nodes; i++) {
          ctx.fillStyle = accentColor;
          ctx.beginPath();
          ctx.arc(morphPoints[i].x, morphPoints[i].y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (p < 0.80) {
        // ───────────────────────────────────────────────────────────
        // PHASE 4: QUALITY — PRECISION, ALIGNMENT & STABILITY (p ∈ [0.64, 0.80])
        // ───────────────────────────────────────────────────────────
        const t = (p - 0.64) / 0.16; // 0 -> 1
        const snapR = baseRadius * 0.85;
        const hexPoints: { x: number; y: number }[] = [];

        // Stable geometric hexagon + internal triad matrix
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3 - Math.PI / 6;
          hexPoints.push({
            x: cx + Math.cos(a) * snapR,
            y: cy + Math.sin(a) * snapR,
          });
        }

        // Outer hexagon boundary
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2.0;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        for (let i = 0; i <= 6; i++) {
          const pt = hexPoints[i % 6];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Internal stability structural trusses
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          ctx.moveTo(cx, cy);
          ctx.lineTo(hexPoints[i].x, hexPoints[i].y);
          ctx.moveTo(hexPoints[i].x, hexPoints[i].y);
          ctx.lineTo(hexPoints[(i + 2) % 6].x, hexPoints[(i + 2) % 6].y);
        }
        ctx.stroke();

        // Center stable core & precision vertices
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.arc(hexPoints[i].x, hexPoints[i].y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // ───────────────────────────────────────────────────────────
        // PHASE 5: PRACTICAL CLIMAX — CONTINUOUS LUMINOUS CONDUIT (p ∈ [0.80, 1.00])
        // ───────────────────────────────────────────────────────────
        const t = (p - 0.80) / 0.20; // 0 -> 1
        
        // Centered conduit line inside the viewport bounds
        const conduitStartX = width * 0.16;
        const conduitEndX = width * 0.84;
        const conduitY = height * 0.54;
        const conduitLength = conduitEndX - conduitStartX;
        const milestoneCount = 4;

        // Subdued base conduit track
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(conduitStartX, conduitY);
        ctx.lineTo(conduitEndX, conduitY);
        ctx.stroke();

        // Active progressive luminous beam
        const activeBeamLen = conduitLength * Math.min(1, t * 1.15);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3.0;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 16;

        ctx.beginPath();
        ctx.moveTo(conduitStartX, conduitY);
        ctx.lineTo(conduitStartX + activeBeamLen, conduitY);
        ctx.stroke();

        // 4 Milestone Nodes along the conduit
        for (let m = 0; m < milestoneCount; m++) {
          const mx = conduitStartX + (m / (milestoneCount - 1)) * conduitLength;
          const nodeActivationThreshold = (m / (milestoneCount - 1)) * 0.75;
          const isNodeActive = t >= nodeActivationThreshold;
          const isCurrentActive =
            isNodeActive &&
            (m === milestoneCount - 1 || t < ((m + 1) / (milestoneCount - 1)) * 0.75);

          // Outer halo for active nodes
          if (isNodeActive) {
            ctx.fillStyle = glowColor;
            ctx.beginPath();
            ctx.arc(mx, conduitY, isCurrentActive ? 22 : 14, 0, Math.PI * 2);
            ctx.fill();
          }

          // Node core circle
          ctx.strokeStyle = isNodeActive ? accentColor : glowColor;
          ctx.lineWidth = isCurrentActive ? 3.0 : 1.5;
          ctx.fillStyle = isNodeActive ? accentColor : '#120B06';
          ctx.shadowColor = isCurrentActive ? accentColor : 'transparent';
          ctx.shadowBlur = isCurrentActive ? 18 : 0;

          ctx.beginPath();
          ctx.arc(mx, conduitY, isCurrentActive ? 9 : 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Luminous ring on the currently brightest node
          if (isCurrentActive) {
            const ringPulse = 1 + 0.15 * Math.sin(time * 4);
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(mx, conduitY, 16 * ringPulse, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        // Traveling energy packet pulse
        if (activeBeamLen > 5) {
          const pulsePos = conduitStartX + ((time * 0.5) % 1) * activeBeamLen;
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(pulsePos, conduitY, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
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
