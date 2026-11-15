import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();

    if (media.addEventListener) media.addEventListener('change', update);
    else media.addListener(update);

    return () => {
      if (media.removeEventListener) media.removeEventListener('change', update);
      else media.removeListener(update);
    };
  }, []);

  return reducedMotion;
}

export function useSceneActivity(elementRef, rootMargin = '180px') {
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, rootMargin]);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return inView && pageVisible;
}

export function useNearViewport(elementRef, rootMargin = '600px') {
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;
    if (!('IntersectionObserver' in window)) {
      setIsNear(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, rootMargin]);

  return isNear;
}
