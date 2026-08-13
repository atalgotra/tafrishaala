'use client';

import React, { useRef, useState } from 'react';
import { useCursor } from '@/context/CursorContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  maxDistance?: number;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  cursorText?: string;
  className?: string;
}

export function MagneticButton({
  children,
  strength = 0.35,
  maxDistance = 14,
  variant = 'primary',
  cursorText,
  className = '',
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const { setCursorMode, resetCursor } = useCursor();
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    const clampedX = Math.max(-maxDistance, Math.min(maxDistance, deltaX));
    const clampedY = Math.max(-maxDistance, Math.min(maxDistance, deltaY));

    gsap.to(buttonRef.current, {
      x: clampedX,
      y: clampedY,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (textRef.current) {
      gsap.to(textRef.current, {
        x: clampedX * 0.4,
        y: clampedY * 0.4,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleMouseEnter = () => {
    setCursorMode('magnetic', cursorText, buttonRef.current);
  };

  const handleMouseLeave = () => {
    resetCursor();
    if (prefersReducedMotion || !buttonRef.current) return;

    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });

    if (textRef.current) {
      gsap.to(textRef.current, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:shadow-glow-md font-semibold';
      case 'secondary':
        return 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]';
      case 'outline':
        return 'bg-transparent text-[var(--text-primary)] border border-[var(--border-glow)] hover:bg-[var(--bg-surface)]';
      case 'ghost':
        return 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]';
      default:
        return '';
    }
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors duration-300 will-change-transform ${getVariantStyles()} ${className}`}
      {...props}
    >
      <span ref={textRef} className="relative z-10 flex items-center gap-2 will-change-transform">
        {children}
      </span>
    </button>
  );
}
