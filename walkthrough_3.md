# Section 07: Learning Tracks — Final Scroll-Driven Cinematic Implementation

## 1. Executive Summary
Section 07 (**LEARNING TRACKS**) has been finalized as a fully scroll-driven cinematic journey (`600vh` pinned track). The previous click-to-switch behavior has been replaced with a continuous scroll architecture where one normalized ScrollTrigger progress value acts as the single source of truth.

---

## 2. Verified Track & Media Mapping

All 6 tracks use source-derived Tafrishaala names, verified descriptions, and dedicated media assets from `public/media/tracks/`:

| Track Index | Verified Course Title | Category | Dedicated Video & Poster | Official Course Destination |
|---|---|---|---|---|
| **01** | `WEB DEVELOPMENT` | FULL-STACK DEVELOPMENT | `01-web-development.mp4` / `poster.webp` | [`tafrishaala.com/courses/web-development`](https://tafrishaala.com/courses/web-development) |
| **02** | `WEB DESIGNING` | UI/UX & DESIGN SYSTEMS | `02-web-designing.mp4` / `poster.webp` | [`tafrishaala.com/courses/web-designing`](https://tafrishaala.com/courses/web-designing) *(Signature Cinematic Chapter)* |
| **03** | `MOBILE APPS DEVELOPMENT` | MOBILE ENGINEERING | `03-mobile-apps.mp4` / `poster.webp` | [`tafrishaala.com/courses/mobile-apps-development`](https://tafrishaala.com/courses/mobile-apps-development) |
| **04** | `CLOUD COMPUTING` | INFRASTRUCTURE & SCALE | `04-cloud-computing.mp4` / `poster.webp` | [`tafrishaala.com/courses/cloud-computing`](https://tafrishaala.com/courses/cloud-computing) |
| **05** | `DEVOPS` | AUTOMATION & OPERATIONS | `05-devops.mp4` / `poster.webp` | [`tafrishaala.com/courses/devops`](https://tafrishaala.com/courses/devops) |
| **06** | `DIGITAL MARKETING` | GROWTH & ECOSYSTEMS | `06-digital-marketing.mp4` / `poster.webp` | [`tafrishaala.com/courses/digital-marketing`](https://tafrishaala.com/courses/digital-marketing) |

---

## 3. Interaction & Cinematic Engine

- **Pure Scroll Interaction**: No click-to-switch tabs. The left column is a **passive quiet chapter index** reflecting the normalized progress $p \in [0.00, 1.00]$.
- **Ghost-Free Text Transition Engine**:
  - $u \in [0.00, 0.30]$: Outgoing track title and description exit smoothly (`1 → 0`, `0 → -12px`).
  - $u \in [0.30, 0.70]$: **Zero text visible in center** — the cinematic track media environment dominates.
  - $u \in [0.70, 1.00]$: Incoming track title and description enter crisply (`0 → 1`, `12px → 0`).
- **Media Optimization**:
  - Steady state: Exactly 1 active video playing.
  - Transition zone: Maximum 2 media layers mounted during cross-fades.
  - Lazy loading, poster-first rendering, and viewport pause via `IntersectionObserver`.
- **Reversibility**: Reverse scrolling backward is 100% deterministic with zero pop-in or state desync.

---

## 4. Narrative Flow & Bridges

- **Entry from Section 06**:
  > *YOU'VE SEEN THE WORLDS. NOW SEE WHAT PEOPLE BUILD WITH THEM ↓* &rarr; **LEARNING TRACKS** (*"You know the technology. Now explore the paths to master it."*)
- **Exit to Section 08**:
  > *LEARNING IS ONLY THE START. THE RIGHT MENTOR HELPS YOU GO FURTHER ↓ NEXT: SECTION 08 — MENTORS*

---

## 5. Verification & Build Results

- **Dev Server**: Running live on `http://localhost:3000` (`GET / 200 OK` in 792ms).
- **All Media Assets**: Verified `200 OK` for all 6 MP4 videos and all 6 WebP posters in `public/media/tracks/`.
- **Production Build**: `npm run build` compiled 4/4 static pages cleanly with **zero TypeScript / Next.js errors** (`174 kB` First Load JS).
- **Theme Reactivity**: Verified across all 6 themes (`VOID`, `CYBER`, `NEON`, `AURORA`, `SOLAR`, `HERITAGE`).
- **Sections 01–06**: Preserved and locked.
- **Section 08**: Not yet implemented as instructed.
