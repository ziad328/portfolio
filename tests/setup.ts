import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom has no matchMedia; GSAP's ScrollTrigger calls it on load
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// Components using useRouter (TransitionLink) need an App Router, which tests don't mount
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/',
}));
