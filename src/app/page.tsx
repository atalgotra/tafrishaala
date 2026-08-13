import React from 'react';
import { HeroSection } from '@/components/sections/01_HeroSection';
import { FutureStatementSection } from '@/components/sections/02_FutureStatementSection';
import { FrequencySection } from '@/components/sections/03_FrequencySection';
import { WhatToBuildSection } from '@/components/sections/04_WhatToBuildSection';
import { LearningJourneySection } from '@/components/sections/05_LearningJourneySection';
import { TechnologyWorldsSection } from '@/components/sections/06_TechnologyWorldsSection';
import { LearningTracksSection } from '@/components/sections/07_LearningTracksSection';
import { MethodSection } from '@/components/sections/08_MethodSection';
import { RealExperienceSection } from '@/components/sections/09_RealExperienceSection';
import { FinalCtaSection } from '@/components/sections/10_FinalCtaSection';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* 01. Hero Section (Pinned Continuous Spatial Transformation) */}
      <HeroSection />

      {/* 02. Future Statement Section (Decoupled in Normal Document Flow) */}
      <FutureStatementSection />

      {/* 03 - 10. Progressive Experience Sections */}
      <FrequencySection />
      <WhatToBuildSection />
      <LearningJourneySection />
      <TechnologyWorldsSection />
      <LearningTracksSection />
      <MethodSection />
      <RealExperienceSection />
      <FinalCtaSection />

      {/* 11. Structural Colophon & Footer */}
      <Footer />
    </div>
  );
}
