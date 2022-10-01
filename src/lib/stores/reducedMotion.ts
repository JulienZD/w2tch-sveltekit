// Thanks to Geoff Rich: https://geoffrich.net/posts/svelte-prefers-reduced-motion-store/
import { browser } from '$app/environment';
import { readable } from 'svelte/store';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

const getInitialMotionPreference = () => browser && window.matchMedia(reducedMotionQuery).matches;

export const reducedMotion = readable(getInitialMotionPreference(), (set) => {
  if (!browser) return;

  const updateMotionPreference = (event: MediaQueryListEvent) => {
    set(event.matches);
  };

  const mediaQueryList = window.matchMedia(reducedMotionQuery);
  mediaQueryList.addEventListener('change', updateMotionPreference);

  return () => {
    mediaQueryList.removeEventListener('change', updateMotionPreference);
  };
});
