# Section 06: Technology Worlds — Walkthrough

## 1. Overview
Section 06 integrates the approved Google Flow cinematic assets into a full-viewport environmental experience across 6 technology domains: **01 AI**, **02 WEB**, **03 CLOUD**, **04 MOBILE**, **05 DESIGN**, and **06 DIGITAL**.

---

## 2. Key Architecture Decisions

1. **Default Neutral State (`activeWorldId = null`)**:
   - Initial entrance displays the platform's neutral ambient environment.
   - **Zero Flow video streams** are attached or downloaded on page load, keeping the initial payload lightweight.
2. **Two-Layer Transient Media Architecture**:
   - Layer A (previous world media) and Layer B (incoming world media) cross-fade smoothly over ~500ms.
   - Outgoing media is unmounted after the transition, guaranteeing **at most 1 active video stream at steady state**.
3. **Exact Production Asset Mapping**:
   - `01 AI` &rarr; `/media/worlds/01-ai.mp4` / `01-ai-poster.webp`
   - `02 WEB` &rarr; `/media/worlds/02-web.mp4` / `02-web-poster.webp`
   - `03 CLOUD` &rarr; `/media/worlds/03-cloud.mp4` / `03-cloud-poster.webp`
   - `04 MOBILE` &rarr; `/media/worlds/04-mobile.mp4` / `04-mobile-poster.webp`
   - `05 DESIGN` &rarr; `/media/worlds/05-design.mp4` / `05-design-poster.webp`
   - `06 DIGITAL` &rarr; `/media/worlds/06-digital.mp4` / `06-digital-poster.webp`
4. **Performance & Viewport Controls**:
   - `preload="metadata"`, `autoPlay`, `muted`, `loop`, `playsInline`.
   - `IntersectionObserver` automatically pauses playback when the user scrolls away from Section 06 and resumes on return.
   - `prefers-reduced-motion` and mobile viewports (`< 768px`) gracefully default to crisp still posters.

---

## 3. Visual States & Walkthrough

```
[NEUTRAL STATE]
  // 06 THE DOMAIN CATALOGUE
  TECHNOLOGY WORLDS.
  Explore the technologies that turn ideas into real things.
  [01 AI]  [02 WEB]  [03 CLOUD]  [04 MOBILE]  [05 DESIGN]  [06 DIGITAL]
  Select a world above to experience its cinematic environment

          │  User clicks "01 AI"
          ▼

[AI SELECTED STATE]
  Background: AI Flow Cinematic Video (01-ai.mp4) with subtle dark vignette
  [01 AI (ACTIVE)]  [02 WEB]  [03 CLOUD]  [04 MOBILE]  [05 DESIGN]  [06 DIGITAL]
  
  01 // DOMAIN • APPROVED FLOW ASSET
  AI
  Intelligent Systems & Emerging Technology
  Explore intelligent systems and emerging technology.
  [ EXPLORE AI WORLD → ]    [ ALL WORLDS ]

          │  User clicks "02 WEB"
          ▼

[WEB SELECTED STATE]
  Background: WEB Flow Cinematic Video (02-web.mp4)
  [01 AI]  [02 WEB (ACTIVE)]  [03 CLOUD]  [04 MOBILE]  [05 DESIGN]  [06 DIGITAL]
  
  02 // DOMAIN • APPROVED FLOW ASSET
  WEB
  Digital Interfaces & Web Experiences
  Explore digital interfaces and web experiences.
  [ EXPLORE WEB WORLD → ]   [ ALL WORLDS ]
```

---

## 4. Verification & Build Results

- **Dev Server**: Running on `http://localhost:3000` (`GET / 200 OK` in 430ms).
- **Production Build**: `npm run build` completed with **zero errors** (4/4 static pages, `161 kB` First Load JS).
- **Sections 01–05**: Fully preserved in their locked state.
