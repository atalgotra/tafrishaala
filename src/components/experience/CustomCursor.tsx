'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCursor } from '@/context/CursorContext';
import { useDeviceCapabilities } from '@/hooks/useMediaQuery';
import { lerp } from '@/lib/utils';

export function CustomCursor() {
  const { cursorState } = useCursor();
  const { isDesktop, isTouch } = useDeviceCapabilities();
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only activate cursor on desktop non-touch devices
    if (!isDesktop || isTouch) return;

    document.body.classList.add('has-custom-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let rafId: number;

    const render = () => {
      // Direct instant tracking for dot
      dotPos.current.x = lerp(dotPos.current.x, mousePos.current.x, 0.6);
      dotPos.current.y = lerp(dotPos.current.y, mousePos.current.y, 0.6);

      // Smooth damped physics for outer ring
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.18);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.18);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [isDesktop, isTouch, isVisible]);

  if (!isDesktop || isTouch) return null;

  const isPointer = cursorState.mode === 'pointer';
  const isMagnetic = cursorState.mode === 'magnetic';
  const isText = cursorState.mode === 'text';
  const isExplore = cursorState.mode === 'explore';
  const isHidden = cursorState.mode === 'hidden';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300 ${
        isVisible && !isHidden ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <div
          className={`rounded-full transition-all duration-200 ${
            isPointer || isMagnetic
              ? 'h-1.5 w-1.5 bg-white shadow-glow-sm'
              : isText
              ? 'h-4 w-0.5 bg-[var(--accent-primary)]'
              : isExplore
              ? 'h-2 w-2 bg-[var(--accent-primary)]'
              : 'h-1.5 w-1.5 bg-[var(--accent-primary)]'
          }`}
        />
      </div>

      {/* Atmospheric Outer Ring / Lens */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <div
          className={`flex items-center justify-center rounded-full border transition-all duration-300 ${
            isPointer
              ? 'h-12 w-12 border-[var(--accent-primary)] bg-[var(--accent-glow)] scale-110'
              : isMagnetic
              ? 'h-14 w-14 border-[var(--border-glow)] bg-[var(--bg-surface)] backdrop-blur-xs scale-125'
              : isText
              ? 'h-8 w-8 border-transparent bg-transparent scale-50'
              : isExplore
              ? 'h-16 w-16 border-[var(--accent-primary)] bg-[var(--bg-overlay)] scale-100'
              : 'h-8 w-8 border-[var(--border-subtle)] bg-transparent scale-100'
          }`}
        >
          {cursorState.text && (
            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--accent-primary)] px-1 font-semibold">
              {cursorState.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
