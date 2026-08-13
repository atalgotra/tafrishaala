# Tafrishaala — Master Website Foundation Architecture Plan

This plan establishes the production-ready foundation for **Tafrishaala**'s Awwwards-level interactive technology platform redesign.

Brand positioning:
> **"WELCOME TO THE FUTURE. LEARN TO BUILD THE FUTURE."**

The focus of this first task is strictly building the **high-performance, cinematic foundation** with zero technical debt, ready for each section to be implemented subsequently.

---

## User Review Required

> [!IMPORTANT]
> **Key Architecture Decisions**:
> 1. **Next.js App Router with TypeScript**: Modern React Server Components architecture with strict separation of server/client components.
> 2. **Lenis + GSAP ScrollTrigger Unified Loop**: Lenis runs smooth scrolling while synchronizing tick frames directly into GSAP's ticker (`gsap.ticker.lagSmoothing(0)`), ensuring ultra-smooth scroll-driven storytelling without frame dropping.
> 3. **5 CSS Variable Themes (VOID, CYBER, NEON, AURORA, SOLAR)**: Dynamic color tokens, particle colors, glow spread, and glass surfaces persisted via `localStorage` with SSR-safe hydration (no flash of unstyled content).
> 4. **Selective 3D & Heavy Component Isolation**: `@react-three/fiber`, `@react-three/drei`, and `three` installed and structured for client-only dynamic imports with zero initial page load penalty.
> 5. **Accessibility & Reduced Motion**: Automatically honors `prefers-reduced-motion` across Lenis and GSAP animations.

---

## Proposed System Architecture

### 1. Technology Stack
- **Framework**: Next.js 15+ (App Router), React 19 / 18, TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables Design Token System
- **Animation**: GSAP, GSAP ScrollTrigger, Lenis (Smooth Scroll), Framer Motion (for micro-state UI transitions)
- **3D Engine**: Three.js, React Three Fiber, React Three Drei
- **Icons**: Lucide React
- **Typography**: Next.js Google Fonts (Outfit / Syne for futuristic display headers, JetBrains Mono / Geist Mono for tech code tags, Inter for clean legible body)

---

### 2. Design Tokens & Theme Architecture

The 5 custom themes are managed via data attributes (`data-theme="void"`, etc.) and CSS custom properties:

| Theme | Accent Primary | Secondary Accent | Background Tone | Glow Color |
|---|---|---|---|---|
| **VOID** (Default) | `#00F0FF` (Cyan) | `#7000FF` (Violet) | `#050508` (Obsidian) | `rgba(0, 240, 255, 0.4)` |
| **CYBER** | `#10FFA0` (Acid Green) | `#00E5FF` (Matrix Blue) | `#040806` (Deep Emerald Dark) | `rgba(16, 255, 160, 0.4)` |
| **NEON** | `#FF007A` (Neon Magenta) | `#8A2BE2` (Ultraviolet) | `#08040A` (Midnight Noir) | `rgba(255, 0, 122, 0.45)` |
| **AURORA** | `#00FFD1` (Glacial Mint) | `#9D00FF` (Borealis Violet) | `#05080E` (Polar Night) | `rgba(0, 255, 209, 0.4)` |
| **SOLAR** | `#FF9E00` (Plasma Amber) | `#FF3D00` (Solar Flare) | `#0A0604` (Deep Umber) | `rgba(255, 158, 0, 0.45)` |

CSS Custom Properties controlled by themes:
- `--bg-primary`, `--bg-secondary`, `--bg-card`, `--bg-glass`
- `--accent-primary`, `--accent-secondary`, `--accent-glow`
- `--particle-color`, `--border-subtle`, `--border-glow`
- `--text-primary`, `--text-secondary`, `--text-muted`

---

### 3. Directory Layout

```
Tafrishaala/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root Layout: Fonts, ThemeProvider, SmoothScroll, Cursor, Noise Overlay
│   │   ├── page.tsx                # Master page assembling 12 section components
│   │   └── globals.css             # Base styles, CSS variables for 5 themes, scanlines, glow utility classes
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Floating futuristic navigation shell with HUD indicators
│   │   │   ├── Footer.tsx          # Minimal futuristic footer shell
│   │   │   └── SmoothScroll.tsx    # Lenis + GSAP ScrollTrigger synchronizer
│   │   ├── ui/
│   │   │   ├── CustomCursor.tsx    # Lerp-smoothed cursor with hover & magnetic physics
│   │   │   ├── MagneticButton.tsx  # Magnetic attraction physics button
│   │   │   ├── SplitText.tsx       # GSAP character/word reveal with stagger
│   │   │   ├── FadeUp.tsx          # GSAP ScrollTrigger reveal wrapper
│   │   │   ├── ScrollProgress.tsx  # Futuristic HUD scroll progress indicator
│   │   │   ├── ThemeSwitcher.tsx   # Theme switcher modal / toggle component
│   │   │   └── GlassCard.tsx       # Reusable glassmorphic spatial container
│   │   └── sections/
│   │       ├── HeroSection.tsx            # Section 1: Hero ("WELCOME TO THE FUTURE")
│   │       ├── FutureStatementSection.tsx # Section 2: Future Statement
│   │       ├── FrequencySection.tsx       # Section 3: Choose Your Frequency
│   │       ├── WhatToBuildSection.tsx     # Section 4: What Do You Want To Build?
│   │       ├── LearningJourneySection.tsx # Section 5: Learning Journey
│   │       ├── TechnologyWorldsSection.tsx# Section 6: Technology Worlds
│   │       ├── BuiltByLearnersSection.tsx # Section 7: Built By Learners
│   │       ├── MentorsSection.tsx         # Section 8: Mentors
│   │       ├── NoidaToWorldSection.tsx    # Section 9: Noida -> World
│   │       └── FinalCtaSection.tsx        # Section 10: Final CTA
│   ├── context/
│   │   └── ThemeContext.tsx        # SSR-safe theme provider with localStorage sync
│   ├── hooks/
│   │   ├── useGsap.ts              # GSAP context lifecycle hook with automatic revert
│   │   └── useReducedMotion.ts     # Reduced motion preference detection
│   ├── lib/
│   │   ├── gsap.ts                 # Central GSAP registration & plugin setup
│   │   ├── themes.ts               # Theme definitions and color constants
│   │   └── utils.ts                # cn utility and math interpolation helpers
│   └── types/
│       └── index.ts                # TypeScript types
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── package.json
```

---

## Verification Plan

### Automated Checks
1. `npm run build` — Verify zero TypeScript or Next.js build errors.
2. `npm run lint` — Verify lint correctness.

### Runtime Verification
1. Start development server (`npm run dev`) and test HTTP response.
2. Verify:
   - Smooth scrolling initialized via Lenis.
   - GSAP ScrollTrigger updates on scroll.
   - Theme switching updates CSS variables instantly and persists across reloads.
   - Interactive cursor tracks pointer and disables on touch/mobile.
   - Magnetic button responds smoothly to mouse proximity.
   - SplitText and FadeUp components trigger animations correctly.
   - All 12 placeholder sections render cleanly with the spatial dark aesthetic.
