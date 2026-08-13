# Implementation Plan — Section 06: Technology Worlds

This technical and interaction plan defines the implementation specification for **Section 06: Technology Worlds** &mdash; the platform's primary integration point for the 6 Google Flow cinematic video assets and reference posters.

Locked Architecture Sequence:
> **01. Hero** &rarr; **02. Future Statement** &rarr; **03. Choose Your Frequency** &rarr; **04. What Do You Want To Build?** &rarr; **05. Learning Journey** &rarr; **06. Technology Worlds** &rarr; **07. Built By Learners** &rarr; **08. Mentors** &rarr; **09. Noida &rarr; World** &rarr; **10. Final CTA** &rarr; **11. Footer**

---

## 1. Recommended UI Composition

The section is designed as a **Full-Viewport Cinematic Environment** where the cinematic video acts as the primary atmospheric backdrop behind clear, high-contrast editorial typography:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ BACKGROUND: Dynamic Cinematic World Video / High-Res Poster Layer ]        │
│ [ OVERLAY: Subtle Dark Vignette + Theme-Reactive Gradient Veil ]            │
│                                                                             │
│  // 06 TECHNOLOGY WORLDS : THE DOMAIN CATALOGUE                             │
│                                                                             │
│  TECHNOLOGY WORLDS                                                          │
│  Explore the technologies that turn ideas into real things.                 │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  [01 AI]   [02 WEB]   [03 CLOUD]   [04 MOBILE]   [05 DESIGN]   [06 DIGITAL]│
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│                           01 // ARTIFICIAL INTELLIGENCE                     │
│                           Intelligent Systems & Neural Craft                │
│                                                                             │
│       Master modern deep learning workflows, autonomous agent systems,       │
│       and intelligent software integrations from first principles.          │
│                                                                             │
│                 [ EXPLORE AI WORLD → ]       [ ALL WORLDS ]                 │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  NEXT: BUILT BY LEARNERS — SEE REAL STUDENT CREATIONS ↓                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. World Selector Interaction Model

1. **Persistent Top Selector Dock**:
   - 6 sleek pills (`AI`, `WEB`, `CLOUD`, `MOBILE`, `DESIGN`, `DIGITAL`) positioned above the focal content.
   - The active world is illuminated with `border-[var(--accent-primary)]`, `bg-[var(--bg-secondary)]`, and `shadow-glow-sm`.
   - Hovering any pill triggers the **magnetic cursor** (`text: "SWITCH"`) with subtle elevation.
2. **Deterministic State Switching**:
   - Clicking a pill immediately updates the active world state without full-page reloads or layout jump.
   - Pressing `Escape` or clicking `[ALL WORLDS]` returns the section to the neutral overview state.

---

## 3. Media Loading & Resource Strategy

To ensure instant 60fps performance and zero bandwidth waste:
- **Zero Eager Downloads**: Only **one active video** is attached to the DOM and playing at any given time. Inactive world videos are completely paused and detached.
- **Still Poster First**: Each world has a corresponding WebP still reference image displayed instantly as the `poster`. The video only begins playback after its initial metadata buffer is ready.
- **IntersectionObserver Lifecycle**:
  - When Section 06 scrolls out of the viewport, video playback is **automatically paused**.
  - When Section 06 re-enters the viewport, playback resumes seamlessly.
- **HTML5 Video Configuration**:
  ```tsx
  <video
    key={activeWorld.id}
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
    poster={activeWorld.posterUrl}
    className="h-full w-full object-cover"
  >
    <source src={activeWorld.videoWebm} type="video/webm" />
    <source src={activeWorld.videoMp4} type="video/mp4" />
  </video>
  ```
- **Reduced Motion & Low Power**: Automatically switches to the still reference image if `prefers-reduced-motion` is detected or on low-power mobile devices.

---

## 4. State Architecture

```ts
export type WorldId = 'ai' | 'web' | 'cloud' | 'mobile' | 'design' | 'digital';

export interface TechWorldData {
  id: WorldId;
  index: string;
  code: string;
  name: string;
  subtitle: string;
  description: string;
  videoMp4: string;
  videoWebm: string;
  posterUrl: string;
}

interface Section06State {
  activeWorldId: WorldId | null; // default = 'ai' or neutral overview
  isTransitioning: boolean;
}
```

---

## 5. GSAP Transition Timeline (500ms – 750ms)

When the user switches from World A to World B:

```
[TIME 0.0s] ──► [TIME 0.25s] ──► [TIME 0.45s] ──► [TIME 0.70s]
Current world     Active state updates,   New video fades in,     New content fully
content fades     background cross-fade   new title & copy reveal illuminated & ready
out (y: -15, op: 0) begins (op: 0 -> 1)   (y: 20 -> 0, op: 0 -> 1)
```

1. **Step 1 (Exit)**: Outgoing text slides subtly upward (`y: -15px`, `opacity: 0`, `duration: 0.25s`).
2. **Step 2 (Media Cross-Fade)**: Outgoing media fades to 0 as incoming media fades in smoothly (`opacity: 0 -> 1`, `duration: 0.45s`, `ease: 'power2.inOut'`).
3. **Step 3 (Entry)**: Incoming title, tagline, description, and CTA reveal (`y: 20px -> 0`, `opacity: 0 -> 1`, `stagger: 0.06s`, `duration: 0.4s`, `ease: 'power3.out'`).

---

## 6. Theme Integration

The cinematic videos are clean, authentic footage and are **not artificially colored or distorted**. Theme customization applies dynamically to:
- **Gradient Vignette Veils**: Radial edge gradient (`radial-gradient(circle at center, transparent 30%, var(--bg-primary) 95%)`) protects text contrast.
- **UI Borders & Accents**: Selector pills, active highlights, and action buttons adopt active CSS variables (`var(--accent-primary)`, `var(--border-glow)`).
- **5-Theme Adaptability**: Verified under `VOID` (monochrome), `CYBER` (electric cyan), `NEON` (violet), `AURORA` (emerald/mint), and `SOLAR` (warm amber).

---

## 7. Mobile & Responsive Strategy

- **Mobile Viewports (`< 768px`)**:
  - Horizontal scrollable or compact 2-row selector dock with touch-friendly hit areas ($\ge 48\text{px}$).
  - Uses still reference posters by default on mobile to prevent data waste and preserve 60fps scrolling.
  - Video playback enabled only if user explicitly taps to view video.
  - Text placed in a dedicated high-contrast glass card overlay to ensure 100% legibility on all mobile screens.

---

## 8. Accessibility Strategy

- **Semantic HTML**: World selectors use semantic `<button>` elements with `aria-pressed={isSelected}` and `aria-label="Select [Name] World"`.
- **Keyboard Navigation**:
  - `Tab` / `Shift+Tab`: Cycle through all 6 worlds in logical numerical order (01 &rarr; 06).
  - `Enter` / `Space`: Activate the focused world.
  - `Escape`: Return to neutral overview.
- **Screen Reader Support**: `aria-live="polite"` announces active domain changes.

---

## 9. Performance & Resource Budget

- **Lazy Video Loading**: Video elements are only mounted when their world is active.
- **Preload Control**: `preload="metadata"` ensures the browser only fetches header information, not the entire video stream in advance.
- **Zero Heavy WebGL**: Relies strictly on native GPU-accelerated video rendering and CSS transforms.

---

## 10. Narrative Transitions (Entry & Exit)

- **Entry Transition (from Section 05)**:
  - Narrative: *"You've mastered the 4-phase learning journey (Learn &rarr; Practice &rarr; Build &rarr; Deploy). Now explore the deep technology worlds you can master."*
- **Exit Transition (to Section 07)**:
  - Narrative: *"You've seen the technology worlds. Now see what real students and creators have built."* &rarr; Flows directly into **Section 07: Built By Learners**.

---

## 11. Recommended Asset Storage Architecture

We recommend placing the 6 Flow cinematic videos and 6 reference poster images in `public/media/worlds/`:

```
public/
  └── media/
      └── worlds/
          ├── 01-ai.mp4
          ├── 01-ai.webm
          ├── 01-ai-poster.webp
          ├── 02-web.mp4
          ├── 02-web.webm
          ├── 02-web-poster.webp
          ├── 03-cloud.mp4
          ├── 03-cloud.webm
          ├── 03-cloud-poster.webp
          ├── 04-mobile.mp4
          ├── 04-mobile.webm
          ├── 04-mobile-poster.webp
          ├── 05-design.mp4
          ├── 05-design.webm
          ├── 05-design-poster.webp
          ├── 06-digital.mp4
          ├── 06-digital.webm
          └── 06-digital-poster.webp
```
*Note: If specific video files are not yet present in the directory, the component gracefully falls back to high-fidelity theme-reactive canvas gradients/posters.*

---

## 12. Exact Files to Create / Modify

| File | Action | Purpose |
|---|---|---|
| [`src/lib/technologyWorldsData.ts`](file:///d:/Projects_Core/Tafrishaala/src/lib/technologyWorldsData.ts) | **NEW** | Data definitions for the 6 technology worlds (metadata, copy, video paths, poster paths). |
| [`src/components/ui/CinematicWorldMedia.tsx`](file:///d:/Projects_Core/Tafrishaala/src/components/ui/CinematicWorldMedia.tsx) | **NEW** | Reusable single-instance cinematic video/poster background component with IntersectionObserver. |
| [`src/components/sections/06_TechnologyWorldsSection.tsx`](file:///d:/Projects_Core/Tafrishaala/src/components/sections/06_TechnologyWorldsSection.tsx) | **REWRITE** | Full implementation of Section 06 with world selector dock, GSAP cross-fade transition, and mobile layout. |

---

## Verification Plan

### Automated Checks
1. `npm run build` &mdash; Verify zero compilation or TypeScript errors.

### Manual Visual Checks
1. **Initial Overview**: Verify clean entrance and default world rendering.
2. **Interactive Switching**: Click all 6 worlds (`AI`, `WEB`, `CLOUD`, `MOBILE`, `DESIGN`, `DIGITAL`) &mdash; verify smooth 500ms cross-fade and single active video stream.
3. **5-Theme Testing**: Verify `VOID`, `CYBER`, `NEON`, `AURORA`, and `SOLAR` palettes adapt overlay veils and UI tokens cleanly.
4. **Keyboard Accessibility**: Test `Tab`, `Enter`, and `Escape` navigation.
5. **Mobile Viewport**: Validate responsive layout and touch targets on `< 768px`.
