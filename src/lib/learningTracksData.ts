export type TextPosition = 'lower-left' | 'lower-center' | 'upper-left';

export interface LearningTrackConfig {
  id: 'web-development' | 'web-designing' | 'mobile-apps' | 'cloud-computing' | 'devops' | 'digital-marketing';
  index: string;
  title: string;
  sourceDescription: string;
  sourceUrl: string;
  videoMp4: string;
  posterUrl: string;
  targetProgress: number;
  textPosition: TextPosition;
}

export const LEARNING_TRACKS_DATA: LearningTrackConfig[] = [
  {
    id: 'web-development',
    index: '01',
    title: 'WEB DEVELOPMENT',
    sourceDescription:
      'Learn front-end and back-end development to build robust web applications and interactive digital products.',
    sourceUrl: 'https://tafrishaala.com/courses/web-development',
    videoMp4: '/media/tracks/01-web-development.mp4',
    posterUrl: '/media/tracks/01-web-development-poster.webp',
    targetProgress: 0.08,
    textPosition: 'lower-left',
  },
  {
    id: 'web-designing',
    index: '02',
    title: 'WEB DESIGNING',
    sourceDescription:
      'Design modern interfaces, responsive visual layouts, and interactive user experiences from concept to completion.',
    sourceUrl: 'https://tafrishaala.com/courses/web-designing',
    videoMp4: '/media/tracks/02-web-designing.mp4',
    posterUrl: '/media/tracks/02-web-designing-poster.webp',
    targetProgress: 0.25,
    textPosition: 'lower-left',
  },
  {
    id: 'mobile-apps',
    index: '03',
    title: 'MOBILE APPS DEVELOPMENT',
    sourceDescription:
      'Develop applications for modern mobile platforms with fluid touch interaction and cross-device responsiveness.',
    sourceUrl: 'https://tafrishaala.com/courses/mobile-apps-development',
    videoMp4: '/media/tracks/03-mobile-apps.mp4',
    posterUrl: '/media/tracks/03-mobile-apps-poster.webp',
    targetProgress: 0.42,
    textPosition: 'lower-left',
  },
  {
    id: 'cloud-computing',
    index: '04',
    title: 'CLOUD COMPUTING',
    sourceDescription:
      'Deploy and manage scalable cloud architecture, connected storage, and resilient distributed services.',
    sourceUrl: 'https://tafrishaala.com/courses/cloud-computing',
    videoMp4: '/media/tracks/04-cloud-computing.mp4',
    posterUrl: '/media/tracks/04-cloud-computing-poster.webp',
    targetProgress: 0.58,
    textPosition: 'lower-left',
  },
  {
    id: 'devops',
    index: '05',
    title: 'DEVOPS',
    sourceDescription:
      'Automate build, test, delivery, and system monitoring workflows to support continuous software releases.',
    sourceUrl: 'https://tafrishaala.com/courses/devops',
    videoMp4: '/media/tracks/05-devops.mp4',
    posterUrl: '/media/tracks/05-devops-poster.webp',
    targetProgress: 0.75,
    textPosition: 'lower-left',
  },
  {
    id: 'digital-marketing',
    index: '06',
    title: 'DIGITAL MARKETING',
    sourceDescription:
      'Execute multi-channel digital marketing, search optimization, and analytics strategies to reach and engage audiences.',
    sourceUrl: 'https://tafrishaala.com/courses/digital-marketing',
    videoMp4: '/media/tracks/06-digital-marketing.mp4',
    posterUrl: '/media/tracks/06-digital-marketing-poster.webp',
    targetProgress: 0.92,
    textPosition: 'lower-left',
  },
];
