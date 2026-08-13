export type AssetSource = 'tafrishaala' | 'user-provided' | 'licensed';

export interface MediaProvenance {
  image: string;
  poster?: string;
  assetSource: AssetSource;
  assetProvenance: string;
  verifiedContext: string;
}

export interface ExperienceChapter {
  id: string;
  index: string;
  tag: string;
  title: string;
  sourceStatement: string;
  targetProgress: number;
  media?: MediaProvenance;
}

export interface VerifiedLearnerEvidence {
  id: string;
  studentName: string;
  courseTrack: string;
  quote: string;
  verifiedDate?: string;
  image?: string;
}

/**
 * Verified Source-Derived Chapters for Section 09
 * Grounded 100% in authentic statements from Tafrishaala About Us and Homepage.
 *
 * Single Source of Truth Boundaries:
 * - 0.00 – 0.10: ENTRY
 * - 0.10 – 0.28: 01 WHO LEARNS
 * - 0.28 – 0.46: 02 HOW THEY LEARN
 * - 0.46 – 0.64: 03 BEYOND KNOWLEDGE
 * - 0.64 – 0.82: 04 PRACTICAL EXPERIENCE
 * - 0.82 – 1.00: 05 NEXT STEP
 */
export const EXPERIENCE_CHAPTERS: ExperienceChapter[] = [
  {
    id: 'who-learns',
    index: '01',
    tag: 'WHO LEARNS',
    title: 'STUDENTS. NOVICE-LEVEL ENTRANTS. WORKING PROFESSIONALS.',
    sourceStatement:
      'Courses structured for students, novice-level entrants, and working professionals.',
    targetProgress: 0.19,
  },
  {
    id: 'how-they-learn',
    index: '02',
    tag: 'HOW THEY LEARN',
    title: 'ONLINE. OFFLINE. ACCORDING TO CONVENIENCE.',
    sourceStatement:
      'Online and offline tutorials selected according to individual convenience.',
    targetProgress: 0.37,
  },
  {
    id: 'beyond-knowledge',
    index: '03',
    tag: 'BEYOND KNOWLEDGE',
    title: 'FUNDAMENTALS. REAL-TIME IMPLEMENTATION.',
    sourceStatement:
      'Moving beyond knowledge and certification toward fundamentals and real-time implementation.',
    targetProgress: 0.55,
  },
  {
    id: 'practical-experience',
    index: '04',
    tag: 'PRACTICAL EXPERIENCE',
    title: 'LIVE PROJECTS.',
    sourceStatement:
      'Practical implementation through real-time projects of sister concerns and associated channels.',
    targetProgress: 0.73,
  },
  {
    id: 'next-step',
    index: '05',
    tag: 'NEXT STEP',
    title: 'INTERNSHIP EXPERIENCE.',
    sourceStatement:
      'Opportunities to work on live projects and gain internship experience.',
    targetProgress: 0.91,
  },
];

export const VERIFIED_LEARNER_EVIDENCE: VerifiedLearnerEvidence[] = [];
