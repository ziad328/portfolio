import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomCursor from '@/components/CustomCursor';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

describe('CustomCursor', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('switches to the "view" state over [data-cursor="view"] and back', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('pointer: fine') }));
    render(
      <>
        <CustomCursor />
        <div data-cursor="view"><span>Project image</span></div>
        <p>Plain text</p>
      </>
    );
    const cursor = screen.getByTestId('custom-cursor');

    fireEvent.mouseMove(screen.getByText('Project image'), { clientX: 10, clientY: 10 });
    expect(cursor.dataset.state).toBe('view');

    fireEvent.mouseMove(screen.getByText('Plain text'), { clientX: 20, clientY: 20 });
    expect(cursor.dataset.state).toBe('');
  });

  it('stays off on touch devices', () => {
    render(<CustomCursor />);
    expect(document.body).not.toHaveClass('cursor-custom');
  });
});
