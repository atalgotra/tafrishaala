'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TechWorldConfig } from '@/lib/technologyWorldsData';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceCapabilities } from '@/hooks/useMediaQuery';

interface CinematicWorldMediaProps {
  world?: TechWorldConfig | null;
  opacity?: number;
  scale?: number;
  blur?: number;
  isActive?: boolean;
}

export function CinematicWorldMedia({
  world,
  opacity = 1,
  scale = 1,
  blur = 0,
  isActive = true,
}: CinematicWorldMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);

  const prefersReducedMotion = useReducedMotion();
  const { isDesktop } = useDeviceCapabilities();

  const allowVideo = isDesktop && !prefersReducedMotion && Boolean(world);

  // IntersectionObserver to pause playback when out of viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !allowVideo) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [allowVideo]);

  // Video play/pause management
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !allowVideo) return;

    if (isInViewport && isActive && opacity > 0.05) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInViewport, isActive, opacity, allowVideo]);

  if (!world) {
    return (
      <div
        ref={containerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-radial from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-primary)] opacity-60" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none will-change-transform"
      style={{
        opacity,
        transform: `scale(${scale})`,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        transition: 'filter 0.1s linear',
      }}
    >
      {/* High-Res Still Reference Poster */}
      <img
        src={world.posterUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Single Dynamic Active Video Stream Layer (Desktop Only) */}
      {allowVideo && (
        <video
          ref={videoRef}
          key={world.id}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={world.videoMp4} type="video/mp4" />
        </video>
      )}

      {/* Subtle Dark Vignette & Gradient Veil for Text Contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,var(--bg-primary)_95%)] opacity-85" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)] opacity-75" />
    </div>
  );
}
