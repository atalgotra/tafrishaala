# Implementation Plan: Section 09 — Real Learning. Real People.

## 1. Executive Summary & Section Identity

Section 09 marks an intentional visual shift from technological visualization and procedural motion into **HUMAN EXPERIENCE and REAL EVIDENCE**.

- **Section Identifier**: `// 09 REAL EVIDENCE`
- **Primary Title**: `REAL LEARNING. REAL PEOPLE.`
- **Supporting Narrative Statement**: `Learning becomes meaningful when knowledge meets practice.`
- **Visual Character**: `EDITORIAL, HUMAN, AUTHENTIC, PHOTOGRAPHIC, QUIETLY CINEMATIC`.
  - **Zero Abstract Networks / Zero Procedural Organisms**: Section 09 uses natural editorial imagery and clean typography.
  - **Zero Fabricated Testimonials**: Original placeholder reviews are omitted; architectural slots exist only for future verified submissions.
  - **Media Provenance**: Every media record carries strict provenance metadata (`assetSource`, `assetProvenance`, `verifiedContext`).

---

## 2. Source-Verified Content & Chapter Mapping

All copy derives directly from verified statements on the original Tafrishaala About Us and Homepage:

```
[ ENTRY : p ∈ 0.00 – 0.10 ]
  Section 08 ends: "FROM KNOWLEDGE TO APPLICATION."
  Section 09 enters: "REAL LEARNING. REAL PEOPLE. — See how learning becomes experience."
       │
       ▼
[ CHAPTER 01 : p ∈ 0.10 – 0.28 ]
  01 // WHO LEARNS
  STUDENTS. NOVICE-LEVEL ENTRANTS. WORKING PROFESSIONALS.
  "Courses structured for students, novice-level entrants, and working professionals."
       │
       ▼
[ CHAPTER 02 : p ∈ 0.28 – 0.46 ]
  02 // HOW THEY LEARN
  ONLINE. OFFLINE. CONVENIENCE-DRIVEN.
  "Online and offline tutorials selected according to individual convenience."
  [Professional Courses · Live Learning · Expert Teachers]
       │
       ▼
[ CHAPTER 03 : p ∈ 0.46 – 0.64 ]
  03 // BEYOND KNOWLEDGE
  FUNDAMENTALS. REAL-TIME IMPLEMENTATION.
  "Moving beyond knowledge and certification toward fundamentals and real-time implementation."
       │
       ▼
[ CHAPTER 04 : p ∈ 0.64 – 0.82 ]
  04 // PRACTICAL EXPERIENCE
  LIVE PROJECTS.
  "Practical implementation through real-time projects of sister concerns and associated channels."
       │
       ▼
[ CHAPTER 05 : p ∈ 0.82 – 1.00 ]
  05 // NEXT STEP
  INTERNSHIP EXPERIENCE.
  "Opportunities to work on live projects and gain internship experience."
       │
       ▼
[ EXIT BRIDGE TO SECTION 10 ]
  "CONTINUING THE JOURNEY ↓ NEXT: SECTION 10"
```

---

## 3. Data Model & Media Provenance Architecture

Structured in `src/lib/humanExperienceData.ts`:

```typescript
export type AssetSource = 'tafrishaala' | 'user-provided' | 'licensed';

export interface ExperienceChapter {
  id: string;
  index: string;
  tag: string;
  title: string;
  sourceStatement: string;
  highlights?: string[];
  targetProgress: number;
  media?: {
    image: string;
    poster?: string;
    assetSource: AssetSource;
    assetProvenance: string;
    verifiedContext: string;
  };
}

export interface VerifiedLearnerEvidence {
  id: string;
  studentName: string;
  courseTrack: string;
  quote: string;
  verifiedDate?: string;
  image?: string;
}
```

### Media Provenance Rules:
1. **No Fake Evidence**: If verified authentic imagery for a chapter is pending, the section gracefully falls back to **monumental editorial typography + subtle ambient atmospheric motion**.
2. **Never Generate AI People**: Real student / classroom claims require authentic client-supplied photography.
3. **Dedicated Asset Directory**: `public/media/experience/` (prepared for `01-learning-environment.webp` &rarr; `05-experience.webp`).

---

## 4. Cinematic Scroll & Visual Choreography

Driven by a single normalized ScrollTrigger progress value $p \in [0.00, 1.00]$ over a pinned `500vh` track:

- **Desktop Layout (Pinned 100vh)**:
  - **Left Column**: Quiet passive chapter index (`01 WHO`, `02 HOW`, `03 EXECUTION`, `04 PROJECTS`, `05 EXPERIENCE`).
  - **Right / Center**: Large editorial media stage (16:10 aspect ratio) with subtle atmospheric grain and radial vignette.
  - **Foreground**: Large editorial headline + one concise source-derived sentence.
  - **Bottom Bar**: Narrative progress indicator + Section 10 exit bridge.
- **Continuous Visual Evolution**:
  - Rather than simple cross-fades, each chapter subtly transforms scale (`0.98 → 1.04`), position drift, aperture blur (`0px → 4px`), and light exposure.
- **Ghost-Free Text Transitions**:
  - $u \in [0.00, 0.25]$: Outgoing text exits smoothly (`opacity: 1 → 0`, `y: 0 → -10px`).
  - $u \in [0.25, 0.60]$: **Zero text in center** &mdash; photographic / environmental scene is the hero.
  - $u \in [0.60, 1.00]$: Incoming text enters crisply upon arrival (`opacity: 0 → 1`, `y: 10px → 0`).

---

## 5. Testimonial / Social Proof Policy (Zero Placeholders)

- **Original Placeholder Omission**: The generic placeholder reviews on the original site are completely suppressed.
- **Conditional Rendering**: The UI only mounts testimonial components when `VERIFIED_LEARNER_EVIDENCE.length > 0`. Until verified assets are provided, this area remains clean and uncluttered.

---

## 6. Universal Theme Reactivity & Mobile Pacing

- **Theme System**: Photographs remain natural; theme tokens dynamically drive chapter indicators, typography accents, and ambient vignette across all 6 themes (`VOID`, `CYBER`, `NEON`, `AURORA`, `SOLAR`, `HERITAGE`).
- **Mobile (< 768px)**: Natural vertical flow with full-width responsive photography, zero horizontal scrolling, and accessible touch hierarchy.

---

## 7. Files to Create / Modify

1. **`src/lib/humanExperienceData.ts` [NEW]**:
   - Contains the 5 verified human chapters with provenance metadata and empty `VERIFIED_LEARNER_EVIDENCE` array.
2. **`src/components/ui/ExperienceMediaFrame.tsx` [NEW]**:
   - Photographic media component supporting WebP loading, subtle grain, and typographic fallback when media is pending.
3. **`src/components/sections/09_NoidaToWorldSection.tsx` &rarr; `09_RealExperienceSection.tsx` [RENAME & IMPLEMENT]**:
   - Implement the `500vh` pinned ScrollTrigger timeline, passive chapter index, and Section 10 bridge.
4. **`src/app/page.tsx` & `src/components/experience/ScrollProgressHUD.tsx` [UPDATE]**:
   - Update imports and keep HUD `SECTION_IDS` synchronized (`'experience'`).

---

## User Review Required

> [!IMPORTANT]
> **Strict Source Grounding**: All copy is restricted to verified statements from the original Tafrishaala website. Testimonial placeholders are omitted, and media provenance is strictly tracked.

**Please review this corrected implementation plan. Upon your approval, implementation will begin.**
