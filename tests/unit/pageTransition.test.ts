import { describe, it, expect, vi } from 'vitest';
import gsap from 'gsap';
import { leavePage, hasFlight, landFlight, revealPage } from '@/lib/pageTransition';

const finishTweens = () => gsap.globalTimeline.getChildren().forEach((t) => t.progress(1));

describe('pageTransition', () => {
  it('covers the page, flies a copy of the card image without its overlays, then navigates', () => {
    document.body.innerHTML = `
      <section data-theme="dark"><a id="card"><div data-flip-source><img src="/a.png" /><span data-flip-skip>View</span></div></a></section>
      <div id="hero" data-flip-target></div>`;
    const push = vi.fn();
    const link = document.getElementById('card')!;

    leavePage('/projects/a', push, link, link.querySelector('[data-flip-source]'));
    expect(hasFlight()).toBe(true);
    const copies = document.querySelectorAll('body > [data-flip-source]');
    expect(copies).toHaveLength(1);
    expect(copies[0].querySelector('[data-flip-skip]')).toBeNull();
    expect(push).not.toHaveBeenCalled();

    finishTweens();
    expect(push).toHaveBeenCalledWith('/projects/a');

    // The new page lands the copy on its hero, then the copy and the curtain go away
    const hero = document.getElementById('hero')!;
    landFlight(hero);
    expect(hasFlight()).toBe(false);
    expect(hero.style.visibility).toBe('hidden');
    revealPage();
    finishTweens();
    finishTweens(); // the copy's fade-out starts when its flight ends
    expect(hero.style.visibility).toBe('');
    expect(document.querySelectorAll('body > [aria-hidden="true"]')).toHaveLength(0);
  });
});
