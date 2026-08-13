# Implementation Plan — Section 04: What Do You Want To Build?

This technical and interaction plan defines the architecture for **Section 04: What Do You Want To Build?** &mdash; the platform's first major interactive creative exploration gateway.

Locked Architecture Flow:
> **01. Hero** &rarr; **02. Future Statement** &rarr; **03. Choose Your Frequency** &rarr; **04. What Do You Want To Build?** &rarr; **05. Learning Journey** &rarr; **06. Technology Worlds** &rarr; **07. Built By Learners** &rarr; **08. Mentors** &rarr; **09. Noida &rarr; World** &rarr; **10. Final CTA** &rarr; **11. Footer**

---

## 1. Recommended Interaction Model: Spatial Constellation Matrix

Instead of a generic 2x3 card grid or a game-like 3D menu, we propose the **Spatial Constellation Matrix**:

```
                              [01. WEB]
                                 │
                 [05. DESIGN] ───┼─── [02. MOBILE]
                                 │
                  ─────── WHAT DO YOU WANT TO BUILD? ───────
                                 │
                   [03. AI]  ────┼──── [06. DIGITAL]
                                 │
                              [04. CLOUD]
```

- **Central Anchor**: The monumental question `"WHAT DO YOU WANT TO BUILD?"` sits suspended at the center of the spatial canvas.
- **Orbital Constellation Nodes**: 6 floating interactive nodes (`01 WEB`, `02 MOBILE`, `03 AI`, `04 CLOUD`, `05 DESIGN`, `06 DIGITAL`) surround the question in an elliptical, depth-layered spatial composition.
- **Physical Reactive Field**: As the cursor traverses the space, nodes experience subtle physics-based parallax attraction, and delicate coordinate connection lines (`border-subtle`) faintly trace proximity between nodes.
- **In-Place Environmental Morphing**: Selecting a node does **not** open a popup modal. Instead, the central question shifts into the background, and the selected world expands into a dedicated abstract visual environment with its category manifesto and an action trigger (`EXPLORE WORLD →`).

---

## 2. Visual Composition & The 6 Conceptual Worlds

Each world represents an abstract spatial atmosphere rendered through CSS/SVG and lightweight 2D canvas shaders, inheriting the active global theme (`VOID`, `CYBER`, `NEON`, `AURORA`, `SOLAR`):

| World | Spatial Identifier | Abstract Environmental Transformation |
|---|---|---|
| **01 &mdash; WEB** | `[01 // INTERFACE]` | Geometric viewport coordinates, responsive spatial hairlines, and depth-layered typographic planes. |
| **02 &mdash; MOBILE** | `[02 // SPATIAL_DEVICE]` | Fluid gestural boundary frames, micro-interaction pulses, and touch-surface vectors. |
| **03 &mdash; AI** | `[03 // NEURAL_CORE]` | Synaptic node clusters, autonomous data vectors, and probabilistic pulse pathways. |
| **04 &mdash; CLOUD** | `[04 // DISTRIBUTED_MESH]` | Atmospheric distributed node lattice, serverless telemetry, and global latency rings. |
| **05 &mdash; DESIGN** | `[05 // CREATIVE_CANVAS]` | Pure spatial geometry, optical grid ratios, bezier coordinate curves, and aesthetic tension. |
| **06 &mdash; DIGITAL** | `[06 // SIGNAL_FLOW]` | High-velocity pulse streams, real-time telemetry markers, and interactive signal nodes. |

---

## 3. State Architecture

A single deterministic state machine manages the section:

```ts
export type WorldId = 'web' | 'mobile' | 'ai' | 'cloud' | 'design' | 'digital';

export interface WorldData {
  id: WorldId;
  index: string;
  code: string;
  name: string;
  tagline: string;
  description: string;
  telemetry: string;
}

interface Section04State {
  activeWorld: WorldId | null; // null = constellation overview; WorldId = expanded world environment
  hoveredWorld: WorldId | null;
}
```

- **Default State (`activeWorld: null`)**: All 6 constellation nodes float around the central question in balanced equilibrium.
- **Hover State (`hoveredWorld: 'ai'`)**: Hovered node gains scale (`1.08`) and glow; surrounding nodes drop slightly in opacity (`0.5`) to create focus without disappearing.
- **Active State (`activeWorld: 'ai'`)**: Central question elevates into a subtle background watermark; the selected world's abstract environmental layer expands smoothly with full details and CTA.
- **Dismiss / Switch State**: Clicking another node or the subtle `[← ALL WORLDS]` button transitions smoothly between worlds via an animated cross-fade/morph timeline with 0 layout shift.

---

## 4. Interaction States & Cursor Feedback

| Target | Cursor Mode | Visual / Sound Feel |
|---|---|---|
| **Constellation Canvas** | `default` | Calm particle drift, subtle ambient coordinate tracking. |
| **Node Hover** | `magnetic` (`text: "SELECT"`) | Node translates towards cursor ($\pm 12\text{px}$ physics damping), cursor ring expands. |
| **Active World CTA** | `magnetic` (`text: "EXPLORE"`) | High-contrast button glow, magnetic pull. |
| **Close / Switch Pill** | `pointer` | Reset trigger returning to the full constellation overview. |

---

## 5. Motion Timeline & GSAP Orchestration

```
[01 VIEWPORT ARRIVAL] ──► [02 CONSTELLATION SPREAD] ──► [03 USER SELECTION] ──► [04 ENVIRONMENT MORPH]
   Section enters           Question locks & nodes       Node selected           Subtle canvas adapts,
   from Section 03          eject into orbital space     via click/keyboard      manifesto details reveal
```

### GSAP Lifecycle:
1. **ScrollTrigger Reveal**:
   - `trigger: sectionRef`, `start: 'top 75%'`, `toggleActions: 'play none none reverse'`.
   - Question reveals via `SplitText` (`scale: 0.95 -> 1`, `opacity: 0 -> 1`).
   - 6 orbital nodes eject outward from the center into their spatial coordinates with spring physics (`duration: 0.9s`, `stagger: 0.06s`, `ease: 'expo.out'`).
2. **World Selection Transition**:
   - Uses `gsap.timeline()` with `overwrite: 'auto'`.
   - Non-selected nodes minimize smoothly into a compact horizontal telemetry dock at the bottom of the section.
   - Selected world's container expands in-place (`scale: 0.95 -> 1`, `opacity: 0 -> 1`, `duration: 0.5s`).
   - Reversing/deselecting smoothly returns nodes to their orbital coordinates.

---

## 6. Desktop vs. Mobile Strategy

### Desktop Viewport (`≥ 1024px`):
- Full spatial constellation with 2.5D perspective (`perspective: 1200px`).
- Cursor magnetism and reactive proximity lines.
- Dynamic abstract background shifts on selected world.

### Tablet Viewport (`768px - 1023px`):
- 2-column balanced spatial cards with touch-friendly hit areas ($\ge 56\text{px}$).
- Simplified proximity canvas to preserve battery and 60fps.

### Mobile Viewport (`< 768px`):
- **Intentional Vertical Accordion / Spatial List**:
  - Question: `"WHAT DO YOU WANT TO BUILD?"` fixed at top of section.
  - 6 vertical expandable world pills (`01 WEB`, `02 MOBILE`, `03 AI`, etc.).
  - Tapping a pill expands it vertically with an accordion transition, revealing the world's description and `EXPLORE WORLD →` button while closing other items.
  - Zero horizontal overflow; touch-optimized hit targets ($\ge 64\text{px}$).

---

## 7. Accessibility Strategy

1. **Full Keyboard Navigation**:
   - All 6 world nodes rendered as semantic `<button>` elements with `aria-expanded`, `aria-controls`, and `role="tab"` or `role="button"`.
   - `Tab` / `Shift+Tab` cycles naturally through all 6 choices in logical numerical order (01 &rarr; 06).
   - `Enter` or `Space` activates the selected world.
   - `Escape` returns to the full constellation overview.
2. **Screen Reader Support**:
   - `aria-label="Technology World 01: Web"` with clear status announcements.
3. **Reduced Motion (`prefers-reduced-motion`)**:
   - Disables orbital ejection springs and parallax drift.
   - Transitions between overview and selected world use instant opacity cross-fades (`duration: 0.01ms`).

---

## 8. Performance Strategy

- **Zero Heavy Multi-Scene WebGL**: Does **not** spin up 6 simultaneous WebGL scenes.
- **DOM / CSS 3D Layering**: Node positioning uses GPU-accelerated `transform: translate3d(...)` and `will-change: transform`.
- **Single Active Environmental Canvas**: When a world is selected, a lightweight 2D canvas draws only the active world's abstract particle motif, consuming negligible GPU resources.
- **Strict Bundle Impact**: No external 3D libraries added; uses existing GSAP and Lucide icons.

---

## 9. Narrative Bridges (Entry & Exit)

```
[SECTION 03: CHOOSE YOUR FREQUENCY]
                │
                ▼ (Entry Bridge: Frequency evolves into Creative Intent)
[SECTION 04: WHAT DO YOU WANT TO BUILD?]
  "You've chosen your rhythm — now choose what you want to create."
                │
                ▼ (Exit Bridge: Creative Intent demands the Execution Protocol)
[SECTION 05: THE LEARNING JOURNEY]
  "You know what you want to build. Here is how you will master it."
```

- **Entry Transition (Section 03 &rarr; Section 04)**: Section 03's frequency divider flows into Section 04 with shared background grid coordinates.
- **Exit Transition (Section 04 &rarr; Section 05)**: Bottom handoff bar in Section 04 leads directly into Section 05's 4-phase Evolution Protocol (*Inception &rarr; Core Architecture &rarr; Stress &rarr; Deployment*).

---

## 10. Exact Files to Create / Modify

| File | Action | Purpose |
|---|---|---|
| [`src/components/sections/04_WhatToBuildSection.tsx`](file:///d:/Projects_Core/Tafrishaala/src/components/sections/04_WhatToBuildSection.tsx) | **REWRITE** | Implement the full Spatial Constellation Matrix, 6 conceptual worlds, selection state machine, and mobile accordion. |
| [`src/lib/worlds.ts`](file:///d:/Projects_Core/Tafrishaala/src/lib/worlds.ts) | **NEW** | Clean data constants for the 6 conceptual worlds (indices, codes, titles, descriptors, telemetry tags). |
| [`src/app/page.tsx`](file:///d:/Projects_Core/Tafrishaala/src/app/page.tsx) | **VERIFY** | Confirm clean document flow between Section 03, Section 04, and Section 05. |

---

## Verification Plan

### Automated Checks
1. `npm run build` &mdash; Zero TypeScript or Next.js compile errors.

### Runtime Experience Checks
1. **Constellation Overview**: Confirm all 6 nodes float evenly around the central question on desktop.
2. **Interactive Node Selection**: Click each of the 6 worlds (`WEB`, `MOBILE`, `AI`, `CLOUD`, `DESIGN`, `DIGITAL`) &mdash; confirm smooth environmental shift, clear copy reveal, and reversible back navigation.
3. **5-Theme Adaptability**: Test `VOID`, `CYBER`, `NEON`, `AURORA`, `SOLAR` &mdash; verify each world inherits the active palette seamlessly.
4. **Keyboard Accessibility**: Verify `Tab` navigation, `Enter` selection, and `Escape` reset.
5. **Mobile Viewport**: Test vertical accordion on mobile screens (`< 768px`).
