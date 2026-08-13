export type WorldId = 'web' | 'mobile' | 'ai' | 'cloud' | 'design' | 'digital';

export interface WorldConfig {
  id: WorldId;
  index: string;
  name: string;
  tagline: string;
  description: string;
  position: {
    desktop: { x: number; y: number }; // Base orbital anchors situated well outside the central safe zone (W=260, H=140)
  };
}

export const TECHNOLOGY_WORLDS: WorldConfig[] = [
  {
    id: 'web',
    index: '01',
    name: 'WEB',
    tagline: 'Modern Web Architectures & Interactive Experiences',
    description:
      'Master high-performance web engineering, reactive frontend frameworks, full-stack applications, and interactive digital interfaces.',
    position: { desktop: { x: 0, y: -220 } },
  },
  {
    id: 'design',
    index: '05',
    name: 'DESIGN',
    tagline: 'Digital Product Design & Interface Craft',
    description:
      'Create intuitive user experiences, comprehensive design systems, typography hierarchies, and polished interactive products.',
    position: { desktop: { x: -360, y: -110 } },
  },
  {
    id: 'mobile',
    index: '02',
    name: 'MOBILE',
    tagline: 'Native & Cross-Platform Mobile Applications',
    description:
      'Engineer fluid mobile experiences, touch-driven user interfaces, offline-first architectures, and connected mobile software.',
    position: { desktop: { x: 360, y: -110 } },
  },
  {
    id: 'digital',
    index: '06',
    name: 'DIGITAL',
    tagline: 'Connected Systems & Digital Platforms',
    description:
      'Develop end-to-end digital solutions, data-driven platforms, communication architectures, and modern technology products.',
    position: { desktop: { x: -350, y: 110 } },
  },
  {
    id: 'ai',
    index: '03',
    name: 'AI',
    tagline: 'Intelligent Systems & Autonomous Agents',
    description:
      'Build practical AI integrations, autonomous agent workflows, machine learning pipelines, and intelligent software features.',
    position: { desktop: { x: 350, y: 110 } },
  },
  {
    id: 'cloud',
    index: '04',
    name: 'CLOUD',
    tagline: 'Distributed Infrastructure & Scalable Backends',
    description:
      'Architect resilient cloud backends, microservices, containerized deployments, databases, and high-throughput systems.',
    position: { desktop: { x: 0, y: 220 } },
  },
];
