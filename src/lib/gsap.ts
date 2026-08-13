import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({
    ease: 'power3.out',
    duration: 1,
  });
  // Disable lag smoothing to prevent desync with Lenis smooth scroll
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger };
export default gsap;
