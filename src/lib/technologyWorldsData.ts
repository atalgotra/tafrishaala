export type TechWorldId = 'ai' | 'web' | 'cloud' | 'mobile' | 'design' | 'digital';

export interface TechWorldConfig {
  id: TechWorldId;
  index: string;
  name: string;
  tagline: string;
  description: string;
  videoMp4: string;
  posterUrl: string;
  targetProgress: number; // Exact center plateau in the 0.0 - 1.0 scroll timeline
}

export const TECH_WORLDS_DATA: TechWorldConfig[] = [
  {
    id: 'ai',
    index: '01',
    name: 'AI',
    tagline: 'Intelligent Systems',
    description: 'Build with intelligent technology.',
    videoMp4: '/media/worlds/01-ai.mp4',
    posterUrl: '/media/worlds/01-ai-poster.webp',
    targetProgress: 0.11,
  },
  {
    id: 'web',
    index: '02',
    name: 'WEB',
    tagline: 'Digital Interfaces',
    description: 'Create digital experiences for the web.',
    videoMp4: '/media/worlds/02-web.mp4',
    posterUrl: '/media/worlds/02-web-poster.webp',
    targetProgress: 0.25,
  },
  {
    id: 'cloud',
    index: '03',
    name: 'CLOUD',
    tagline: 'Distributed Infrastructure',
    description: 'Build on connected infrastructure.',
    videoMp4: '/media/worlds/03-cloud.mp4',
    posterUrl: '/media/worlds/03-cloud-poster.webp',
    targetProgress: 0.40,
  },
  {
    id: 'mobile',
    index: '04',
    name: 'MOBILE',
    tagline: 'Responsive Applications',
    description: 'Create experiences that move with people.',
    videoMp4: '/media/worlds/04-mobile.mp4',
    posterUrl: '/media/worlds/04-mobile-poster.webp',
    targetProgress: 0.54,
  },
  {
    id: 'design',
    index: '05',
    name: 'DESIGN',
    tagline: 'Creative Composition',
    description: 'Shape ideas into digital experiences.',
    videoMp4: '/media/worlds/05-design.mp4',
    posterUrl: '/media/worlds/05-design-poster.webp',
    targetProgress: 0.68,
  },
  {
    id: 'digital',
    index: '06',
    name: 'DIGITAL',
    tagline: 'Connected Ecosystems',
    description: 'Connect ideas, people and technology.',
    videoMp4: '/media/worlds/06-digital.mp4',
    posterUrl: '/media/worlds/06-digital-poster.webp',
    targetProgress: 0.83,
  },
];
