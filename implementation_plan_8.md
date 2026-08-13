# Implementation Plan: Section 07 — Learning Tracks (Cinematic Scroll Journey)

## 1. Executive Summary & Section Identity

Section 07 transitions from static card selection into a **Scroll-Driven Cinematic Journey** through the 6 core learning tracks of Tafrishaala.

- **Primary Title**: `LEARNING TRACKS`
- **Supporting Statement**: `Six ways to turn technology into practical skills.`
- **Core Principle**: `The Scroll Wheel is the Timeline.` The user explores all 6 curriculum paths seamlessly by scrolling, creating a unified cinematic rhythm with Section 06.

---

## 2. Pinned Scroll Architecture & Progress Mapping

### Pinned Track Geometry
- **Scroll Distance**: `600vh` scroll track on desktop.
- **Viewport**: `100vh` sticky pinned viewport.
- **Single Source of Truth**: Exactly one normalized ScrollTrigger progress value $p \in [0.00, 1.00]$ governs all visual states, media cross-fades, text revelations, and chapter indicators.

### Progress Chapter Ranges ($N = 6$)

$$\text{Chapter Span } S = \frac{1}{6} \approx 0.1667$$

| Chapter | Track Domain | Progress Range ($p$) | Plateau Anchor | Core Conceptual Theme |
|---|---|---|---|---|
| **01** | `WEB DEVELOPMENT` | $0.00 \to 0.17$ | $p = 0.08$ | Code &rarr; Component tree &rarr; Browser execution |
| **02** | `WEB DESIGNING` | $0.17 \to 0.33$ | $p = 0.25$ | **Signature Asset**: Canvas &rarr; Grid &rarr; Layout &rarr; Responsive UI |
| **03** | `MOBILE APPS` | $0.33 \to 0.50$ | $p = 0.42$ | Fluid touch interaction & multi-screen ecosystem |
| **04** | `CLOUD COMPUTING` | $0.50 \to 0.67$ | $p = 0.58$ | Distributed infrastructure & high-scale data topology |
| **05** | `DEVOPS` | $0.67 \to 0.83$ | $p = 0.75$ | Build &rarr; Test &rarr; Deploy &rarr; Monitor pipeline |
| **06** | `DIGITAL MARKETING` | $0.83 \to 1.00$ | $p = 0.92$ | Growth channels, analytics streams & audience conversion |

### Transition & Ghost-Free Text Timing
Within each chapter slice $\Delta \in [0.00, 1.00]$:
- **Stable Plateau ($\Delta \in [0.18, 0.82]$)**: Active media opacity `1.0`, optical blur `0px`, scale `1.0`. Text fully visible and locked.
- **Transition Zone ($\Delta \in [0.82, 1.00]$ into next track)**:
  - $u \in [0.00, 0.30]$: Outgoing title/copy exits completely (`opacity: 1 → 0`, `y: 0 → -12px`).
  - $u \in [0.30, 0.70]$: **Zero text visible in center** — the cinematic environment and transformation are the sole hero! Outgoing media blurs/scales up (`1.0 → 1.05`, `0px → 5px`), incoming media scales/blurs in (`0.95 → 1.0`, `5px → 0px`).
  - $u \in [0.70, 1.00]$: Incoming title/copy enters crisply (`opacity: 0 → 1`, `y: 12px → 0`).

---

## 3. Dedicated Media Library (`public/media/tracks/`)

Section 07 will use its own isolated media library separate from Section 06:

```
public/media/tracks/
├── 01-web-development.mp4       / 01-web-development-poster.webp
├── 02-web-designing.mp4         / 02-web-designing-poster.webp
├── 03-mobile-apps.mp4           / 03-mobile-apps-poster.webp
├── 04-cloud-computing.mp4       / 04-cloud-computing-poster.webp
├── 05-devops.mp4                / 05-devops-poster.webp
└── 06-digital-marketing.mp4     / 06-digital-marketing-poster.webp
```

### Media Rules:
1. **Steady State**: Strictly **1 active video stream** playing at any time.
2. **Transition**: Maximum **2 media layers** mounted during cross-fade intervals.
3. **Poster-First**: High-resolution WebP posters load instantly; MP4 video stream initializes lazily via `IntersectionObserver`.

---

## 4. Signature Cinematic Moment: WEB DESIGNING (Chapter 02)

The `02 WEB DESIGNING` chapter is choreographed as a marquee transformation sequence:
1. **Empty Digital Canvas**: Clean, dark drafting matrix with subtle coordinate ticks.
2. **Grid & Alignment**: Golden-ratio layout grids and column guides lock into place.
3. **Wireframe to Surface**: Clean structural wireframes form interface containers.
4. **Abstract Typography Blocks**: High-contrast geometric text silhouettes establish hierarchy (no fake generated text).
5. **Component Assembly**: Navigation pill, interactive cards, and primary buttons composition.
6. **Responsive Morph**: Smooth cinematic morph from **Desktop &rarr; Tablet &rarr; Mobile viewport**.
7. **Polished Digital Experience**: Ambient lighting passes over the finished digital product.

---

## 5. Desktop & Mobile Composition

### Desktop Layout (Pinned 100vh)
- **Top Bar**: Section identifier (`// 07 LEARNING TRACKS`) + Subtle Track Indicator.
- **Left Column**: **Passive Chapter Index** (`01 WEB DEV`, `02 WEB DESIGN`, etc.) with subtle active track indicator (quiet, not tab-heavy).
- **Center/Right**: Full-bleed cinematic media background with dark radial readability vignette.
- **Editorial Focus (Center-Lower)**:
  - Phase Tag (`02 // LEARNING TRACK`)
  - Track Title (`WEB DESIGNING`)
  - Core Practical Focus (`UI/UX Architecture, Visual Design Systems & Interactive Prototyping`)
  - Concise Description (`Craft intuitive user interfaces, visual design systems, and responsive layouts.`)
  - Action CTA (`EXPLORE WEB DESIGNING TRACK →`)
- **Bottom Bar**: Narrative progress indicator and Section 08 bridge.

### Mobile Layout (< 768px)
- **Natural Vertical Document Flow**:
  - Each track rendered as a clean, full-viewport cinematic card with WebP poster background.
  - No horizontal scrolling; zero performance bottlenecks.

---

## 6. Narrative Bridges

```
[ ENTRY FROM SECTION 06 ]
  Section 06 ends with: "YOU'VE SEEN THE WORLDS. NOW SEE WHAT YOU CAN BUILD WITH THEM ↓"
       │
       ▼
[ SECTION 07 : LEARNING TRACKS ]
  "You know the technology. Now explore the paths to master it."
       │
       ▼
[ CHAPTERS 01 → 06 ]
  01 WEB DEV ──► 02 WEB DESIGN ──► 03 MOBILE ──► 04 CLOUD ──► 05 DEVOPS ──► 06 DIGITAL MARKETING
       │
       ▼
[ EXIT BRIDGE TO SECTION 08 ]
  "LEARNING IS ONLY THE START. THE RIGHT MENTOR HELPS YOU GO FURTHER ↓"
  "NEXT: SECTION 08 — MENTORS"
```

---

## 7. Reversibility & Accessibility (A11y)

- **100% Reversible Math**: Scrolling backward from `DIGITAL MARKETING → DEVOPS → CLOUD → MOBILE → WEB DESIGN → WEB DEV` reverses deterministically with zero text ghosting or state drift.
- **Keyboard Navigation**: The passive chapter index anchors allow `Tab` and `Enter`/`Space` jumps to exact progress anchors (`targetProgress: 0.08, 0.25, 0.42, 0.58, 0.75, 0.92`).
- **Reduced Motion**: Respects `prefers-reduced-motion: reduce` by bypassing the pinned timeline in favor of static vertical chapters with posters.

---

## 8. Files to Create / Modify

1. **`src/lib/learningTracksData.ts` [NEW]**:
   - `LearningTrackConfig` type with `targetProgress`, `videoMp4`, `posterUrl`, source URLs, and descriptions.
2. **`src/components/ui/CinematicTrackMedia.tsx` [NEW]**:
   - Dedicated media renderer with poster fallback, opacity/scale/blur interpolation, and `IntersectionObserver`.
3. **`src/components/sections/07_BuiltByLearnersSection.tsx` [MODIFY]**:
   - Implement the 600vh pinned ScrollTrigger timeline, passive chapter index, zero-ghosting text engine, and Section 08 bridge.

---

## User Review Required

> [!IMPORTANT]
> **Media Library Isolation**: Section 07 media structure will live in `public/media/tracks/` with WebP posters as primary fallbacks until custom Google Flow videos for the 6 tracks are rendered. Section 06 assets remain 100% untouched.

**Please review and approve this implementation plan to proceed with execution.**
