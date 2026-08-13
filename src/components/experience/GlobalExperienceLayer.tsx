'use client';

import React from 'react';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import { AmbientCanvas } from './AmbientCanvas';
import { NoiseOverlay } from './NoiseOverlay';
import { CustomCursor } from './CustomCursor';
import { ScrollProgressHUD } from './ScrollProgressHUD';

interface GlobalExperienceLayerProps {
  children: React.ReactNode;
}

export function GlobalExperienceLayer({ children }: GlobalExperienceLayerProps) {
  return (
    <SmoothScrollProvider>
      {/* Background Ambience & Lighting */}
      <AmbientCanvas />
      
      {/* Subtle Filmic Grain */}
      <NoiseOverlay />
      
      {/* Desktop Physics Cursor */}
      <CustomCursor />
      
      {/* Telemetry Scroll HUD */}
      <ScrollProgressHUD />
      
      {/* Primary Page Canvas */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </SmoothScrollProvider>
  );
}
