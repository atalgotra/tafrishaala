export interface MethodPrinciple {
  id: string;
  index: string;
  title: string;
  sourceStatement: string;
  targetProgress: number;
}

export interface PracticalMilestone {
  id: string;
  index: string;
  title: string;
  phaseLabel: string;
  sourceDescription: string;
}

export const METHOD_PRINCIPLES: MethodPrinciple[] = [
  {
    id: 'innovative',
    index: '01',
    title: 'INNOVATIVE',
    sourceStatement:
      'Developing new strategies, skills, and mindsets to create positive change.',
    targetProgress: 0.20,
  },
  {
    id: 'creativity',
    index: '02',
    title: 'CREATIVITY',
    sourceStatement:
      'Fostering creativity as a key driver to unlock learner potential.',
    targetProgress: 0.38,
  },
  {
    id: 'adaptability',
    index: '03',
    title: 'ADAPTABILITY',
    sourceStatement:
      'Accessible and agile training preparing learners for an evolving digital world.',
    targetProgress: 0.56,
  },
  {
    id: 'quality',
    index: '04',
    title: 'QUALITY',
    sourceStatement:
      'High-quality learning focused on core fundamentals and real-time implementation.',
    targetProgress: 0.74,
  },
];

export const PRACTICAL_MILESTONES: PracticalMilestone[] = [
  {
    id: 'fundamentals',
    index: '01',
    title: 'FUNDAMENTALS',
    phaseLabel: 'KNOWLEDGE',
    sourceDescription:
      'Structured foundational training with online and offline options.',
  },
  {
    id: 'implementation',
    index: '02',
    title: 'REAL-TIME IMPLEMENTATION',
    phaseLabel: 'APPLICATION',
    sourceDescription:
      'Moving directly from knowledge and certification into practical execution.',
  },
  {
    id: 'live-projects',
    index: '03',
    title: 'LIVE PROJECTS',
    phaseLabel: 'PRACTICE',
    sourceDescription:
      'Working on active projects through associated channels and sister concerns.',
  },
  {
    id: 'internship',
    index: '04',
    title: 'INTERNSHIP EXPERIENCE',
    phaseLabel: 'EXPERIENCE',
    sourceDescription:
      'Hands-on project execution and workplace immersion.',
  },
];
