import gsap from 'gsap';

// Page transitions in the style of the reference site:
// 1. leavePage: a curtain in the current section's colour fades in over the old page; when a project
//    card was clicked, a copy of its image stays on top of the curtain. Only then do we navigate,
//    so the route swap (and the wait for the project's data) happens out of sight.
// 2. The new page's PageTransition calls landFlight (the image copy glides onto the hero image)
//    and revealPage (the curtain fades away).

let curtain: HTMLElement | null = null;
let flight: HTMLElement | null = null;

export function leavePage(href: string, push: (href: string) => void, from: Element, flipSource?: Element | null) {
  if (curtain) return; // a transition is already running

  curtain = document.createElement('div');
  curtain.setAttribute('aria-hidden', 'true');
  const section = from.closest('[data-theme]') ?? document.body;
  Object.assign(curtain.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '90', // above the navbar, below the custom cursor
    background: getComputedStyle(section).backgroundColor,
    opacity: '0',
    pointerEvents: 'none',
  });
  document.body.appendChild(curtain);

  if (flipSource) {
    const rect = flipSource.getBoundingClientRect();
    flight = flipSource.cloneNode(true) as HTMLElement;
    flight.querySelectorAll('[data-flip-skip]').forEach((el) => el.remove());
    flight.setAttribute('aria-hidden', 'true');
    Object.assign(flight.style, {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: '0',
      zIndex: '91',
      pointerEvents: 'none',
    });
    // Keep the hovered zoom the card had, then ease the image back to its natural size
    const sourceImage = flipSource.querySelector('img');
    const image = flight.querySelector('img');
    if (sourceImage && image) {
      image.style.transition = 'none';
      image.style.transform = getComputedStyle(sourceImage).transform;
      gsap.to(image, { scale: 1, duration: 1.2, ease: 'power3.inOut' });
    }
    document.body.appendChild(flight);
  }

  gsap.to(curtain, {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.inOut',
    onComplete: () => {
      // While covered: start the next page at the top (Lenis syncs to native scrolls when idle)
      window.scrollTo(0, 0);
      push(href);
    },
  });
  // shortcut: clears up anyway if the new page never calls revealPage (e.g. a 404); a page that
  // takes longer than this to load shows briefly before its content arrives.
  const current = curtain;
  setTimeout(() => {
    if (curtain !== current) return; // already revealed, or a later transition owns the curtain now
    landFlight(null);
    revealPage();
  }, 5000);
}

export function hasFlight() {
  return flight !== null;
}

// Glides the image copy onto `target`, hiding the real one until the copy has landed on it
export function landFlight(target: HTMLElement | null) {
  const clone = flight;
  flight = null;
  if (!clone) return;
  if (!target) {
    gsap.to(clone, { opacity: 0, duration: 0.4, onComplete: () => clone.remove() });
    return;
  }
  const rect = target.getBoundingClientRect();
  target.style.visibility = 'hidden';
  gsap.to(clone, {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    borderRadius: getComputedStyle(target).borderRadius,
    duration: 1.1,
    ease: 'power3.inOut',
    onComplete: () => {
      target.style.visibility = '';
      // A short cross-fade hides any difference between the card's still and the hero (e.g. the video play button)
      gsap.to(clone, { opacity: 0, duration: 0.3, onComplete: () => clone.remove() });
    },
  });
}

export function revealPage() {
  const el = curtain;
  curtain = null;
  if (el) gsap.to(el, { opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: () => el.remove() });
}
