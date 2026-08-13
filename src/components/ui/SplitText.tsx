'use client';

import React, { useRef } from 'react';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';

interface SplitTextProps {
  children: string;
  splitType?: 'chars' | 'words' | 'lines';
  stagger?: number;
  duration?: number;
  delay?: number;
  triggerOnScroll?: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export function SplitText({
  children,
  splitType = 'words',
  stagger = 0.04,
  duration = 0.9,
  delay = 0,
  triggerOnScroll = true,
  className = '',
  as: Component = 'div',
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useGsap(
    () => {
      if (prefersReducedMotion || !containerRef.current) return;

      const items = containerRef.current.querySelectorAll('.split-item-inner');
      if (!items.length) return;

      const animProps: gsap.TweenVars = {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: stagger,
        duration: duration,
        delay: delay,
        ease: 'power3.out',
      };

      if (triggerOnScroll) {
        animProps.scrollTrigger = {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        };
      }

      gsap.fromTo(
        items,
        {
          y: '105%',
          opacity: 0,
          rotateX: splitType === 'chars' ? 25 : 10,
        },
        animProps
      );
    },
    containerRef,
    [children, splitType, stagger, duration, delay, triggerOnScroll, prefersReducedMotion]
  );

  if (prefersReducedMotion) {
    return <Component className={className}>{children}</Component>;
  }

  const renderContent = () => {
    if (splitType === 'chars') {
      const words = children.split(' ');
      return words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split('').map((char, cIdx) => (
            <span key={cIdx} className="inline-block overflow-hidden align-top">
              <span className="split-item-inner inline-block will-change-transform">
                {char}
              </span>
            </span>
          ))}
        </span>
      ));
    }

    if (splitType === 'words') {
      const words = children.split(' ');
      return words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden align-top mr-[0.28em] last:mr-0">
          <span className="split-item-inner inline-block will-change-transform">
            {word}
          </span>
        </span>
      ));
    }

    // Lines / Editorial Statements
    const lines = children.split('\n');
    return lines.map((line, idx) => (
      <span key={idx} className="block overflow-hidden">
        <span className="split-item-inner block will-change-transform">
          {line}
        </span>
      </span>
    ));
  };

  return (
    <Component
      ref={containerRef as any}
      className={`inline-block ${className}`}
      style={{ perspective: '1000px' }}
    >
      {renderContent()}
    </Component>
  );
}
