'use client';

import React, { useRef } from 'react';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  triggerStart?: string;
  as?: 'div' | 'section' | 'article' | 'span';
}

export function FadeUp({
  children,
  delay = 0,
  duration = 0.8,
  distance = 30,
  className = '',
  triggerStart = 'top 88%',
  as: Component = 'div',
}: FadeUpProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useGsap(
    () => {
      if (prefersReducedMotion || !elementRef.current) return;

      gsap.fromTo(
        elementRef.current,
        {
          opacity: 0,
          y: distance,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elementRef.current,
            start: triggerStart,
            toggleActions: 'play none none reverse',
          },
        }
      );
    },
    elementRef,
    [delay, duration, distance, triggerStart, prefersReducedMotion]
  );

  if (prefersReducedMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      ref={elementRef as any}
      className={`will-change-transform ${className}`}
    >
      {children}
    </Component>
  );
}
