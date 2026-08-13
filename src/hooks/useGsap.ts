'use client';

import { useLayoutEffect, useEffect, useRef, RefObject } from 'react';
import gsap from '@/lib/gsap';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useGsap(
  animationCallback: (context: gsap.Context) => void,
  scope?: RefObject<HTMLElement | null>,
  deps: any[] = []
) {
  const callbackRef = useRef(animationCallback);
  callbackRef.current = animationCallback;

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      callbackRef.current(self);
    }, scope?.current || undefined);

    return () => {
      ctx.revert();
    };
  }, deps);
}
