# Implementation Plan: Section 07 — Built By Learners

## 1. Core Purpose & Creative Direction

Sections 01–06 established **Vision, Technology, Exploration, and Method**. Section 07 introduces **Proof**: transitioning the visitor from *"I can imagine building something"* to *"People are actually building things."*

### Strict Creative Rules
- **No Google Flow Assets**: Flow media is reserved exclusively for Section 06.
- **No Fabricated Data**: Zero AI-generated student projects, fake testimonials, fabricated metrics, fake certificates, or generic stock student photos.
- **Real-Asset Ready**: Built on a clean, modular TypeScript schema designed to receive verified screenshots, project links, and learner attributes as they are supplied by Tafrishaala.

---

## 2. Visual & Interaction Architecture

### Recommended Layout: Pinned Split-View Editorial Showcase

Rather than a generic card grid, Section 07 will employ a **Pinned Dual-Pane Editorial Showcase**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ // 07 SHOWCASE — BUILT BY LEARNERS                                           │
│ Ideas become real when you build them.                                       │
├───────────────────────────────────┬─────────────────────────────────────────┤
│ PROJECT DIRECTORY (Left Pane)     │ ACTIVE PROJECT STAGE (Right Pane)       │
│                                   │                                         │
│ [01] AGENTIC WORKSPACE   [ACTIVE] │ ┌─────────────────────────────────────┐ │
│      AI Systems                   │ │                                     │ │
│                                   │ │   PROJECT SCREENSHOT / MEDIA        │ │
│ [02] SPATIAL INTERFACE            │ │   (High-Res, 16:10 Aspect, Lazy)    │ │
│      Web Experience               │ │                                     │ │
│                                   │ └─────────────────────────────────────┘ │
│ [03] CLOUD PIPELINE ENGINE        │ PHASE 01 // AI SYSTEMS                  │
│      Distributed Infrastructure   │ AGENTIC WORKSPACE                       │
│                                   │ "An autonomous task execution framework │
│ [04] KINETIC TOUCH APP            │  built with real-time streaming."       │
│      Mobile & Responsive          │                                         │
│                                   │ TECHNOLOGIES: [Next.js] [FastAPI]       │
│ [05] DESIGN SYSTEM SPEC           │ LEARNER: Verified Student Name          │
│      Design Architecture          │ [VIEW LIVE PROJECT ↗]  [CASE STUDY →]   │
└───────────────────────────────────┴─────────────────────────────────────────┘
```

### Key Interaction Model:
1. **Desktop (Pinned Scrub & Direct Selection)**:
   - On desktop, Section 07 locks into a sticky viewport containing the project directory and the active project stage.
   - Users can scroll through the list (scrubbing smoothly from project to project) or click/keyboard-navigate any project in the directory.
   - When a project becomes active:
     - The stage cross-fades the screenshot with a subtle scale settlement (`0.98 → 1.00`).
     - Metadata reveals sequentially: Domain Tag &rarr; Title &rarr; Description &rarr; Tech Badges &rarr; Action CTAs.
2. **Mobile (Native Vertical Flow)**:
   - Clean, full-bleed stacked project cards where each project is a complete self-contained unit (Screenshot &rarr; Title &rarr; Verified Details &rarr; CTAs).
   - Zero horizontal squishing or hover-reliant dependencies.

---

## 3. Data Structure & Asset Schema

### TypeScript Interface: `src/lib/learnerProjectsData.ts`

```typescript
export interface LearnerProject {
  id: string;
  index: string;
  title: string;
  category: string; // e.g. "AI Systems", "Web Architecture", "Mobile Application"
  domainId: 'ai' | 'web' | 'cloud' | 'mobile' | 'design' | 'digital';
  tagline: string;
  description: string;
  image: string; // Path to project screenshot in public/media/projects/
  thumbnail?: string;
  learnerName?: string; // Optional — rendered only when verified
  technologies?: string[]; // Optional — rendered only when verified
  liveUrl?: string; // Optional — external link
  caseStudyUrl?: string; // Optional — internal or external link
}
```

### Placeholder Data Strategy:
- Clearly documented, realistic placeholder records representing the 6 core domains.
- All optional fields (`learnerName`, `technologies`, `liveUrl`, `caseStudyUrl`) have defensive render guards so any record with incomplete data renders cleanly without broken UI elements.

---

## 4. Narrative Bridges

### Entry Bridge (from Section 06):
- Section 06 ends with:
  > *YOU'VE SEEN THE WORLDS. NOW SEE WHAT PEOPLE BUILD WITH THEM ↓*
- Section 07 begins with crisp typography and evidence-driven layout:
  > **BUILT BY LEARNERS.**  
  > *Ideas become real when you build them.*

### Exit Bridge (to Section 08):
- Section 07 concludes with a subtle transition bar at the bottom:
  > *BEHIND EVERY BUILD ARE PEOPLE WHO HELP YOU GET THERE → SECTION 08: MENTORS ↓*

---

## 5. Theme System & Accessibility

- **Theme Compliance**: Fully reactive to all 6 themes (`VOID`, `CYBER`, `NEON`, `AURORA`, `SOLAR`, `HERITAGE`) using CSS variable tokens (`var(--bg-primary)`, `var(--border-subtle)`, `var(--accent-primary)`, `var(--text-primary)`).
- **Heritage Identity**: `HERITAGE` theme continues to render the master original logo in the navigation.
- **Accessibility (A11y)**:
  - Full keyboard navigation with `Tab` and arrow keys across project items (`role="tablist"`, `role="tab"`).
  - High-contrast text compliance across all themes.
  - Descriptive `alt` text for all project screenshots.
  - Reduced motion respects `prefers-reduced-motion` by disabling pin scrubbing in favor of standard vertical flow.

---

## 6. Implementation Steps

1. **`src/lib/learnerProjectsData.ts` [NEW]**:
   - Define `LearnerProject` type.
   - Export initial structured project list with safe optional fields.
2. **`src/components/ui/LearnerProjectMedia.tsx` [NEW]**:
   - Responsive, lazy-loaded image container with aspect-ratio preservation and fallback styling.
3. **`src/components/sections/07_BuiltByLearnersSection.tsx` [MODIFY]**:
   - Implement the desktop dual-pane pinned showcase + mobile stacked flow.
   - Integrate keyboard navigation and theme tokens.
4. **Verification & Build**:
   - Verify `npm run dev` and `npm run build`.
   - Test all 6 themes and mobile responsiveness.

---

## User Review Required

> [!IMPORTANT]
> **Creative Rule Check**: Section 07 contains zero Google Flow footage, zero AI-generated student claims, and zero fake testimonials. All project cards use the structured schema ready for verified student assets.

**Please review and approve this implementation plan to proceed with execution.**
