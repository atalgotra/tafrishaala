'use client';

import React, { useRef, useEffect, useState } from 'react';
import { LearningTrackConfig } from '@/lib/learningTracksData';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceCapabilities } from '@/hooks/useMediaQuery';

interface CinematicTrackMediaProps {
  track: LearningTrackConfig;
  opacity?: number;
  scale?: number;
  blur?: number;
  isActive?: boolean;
}

export function CinematicTrackMedia({
  track,
  opacity = 1,
  scale = 1,
  blur = 0,
  isActive = true,
}: CinematicTrackMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);

  const prefersReducedMotion = useReducedMotion();
  const { isDesktop } = useDeviceCapabilities();

  const allowVideo = isDesktop && !prefersReducedMotion && Boolean(track.videoMp4);

  // IntersectionObserver to manage viewport visibility
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

  // Video play / pause management
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !allowVideo) return;

    if (isInViewport && isActive && opacity > 0.05) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInViewport, isActive, opacity, allowVideo]);

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
      {/* High-Res Primary Reference Poster */}
      <img
        src={track.posterUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Video Stream Layer (Lazy-Loaded when MP4 is available) */}
      {allowVideo && (
        <video
          ref={videoRef}
          key={track.id}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={track.videoMp4} type="video/mp4" />
        </video>
      )}

      {/* Subtle Dark Radial Vignette & Contrast Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,var(--bg-primary)_95%)] opacity-85" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)] opacity-75" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-transparent to-transparent opacity-60" />
    </div>
  );
}
