import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/Navbar';

describe('Navbar', () => {
  afterEach(() => {
    // jsdom has no elementsFromPoint; each test installs its own
    delete (document as { elementsFromPoint?: unknown }).elementsFromPoint;
  });

  it('takes the dark theme when a dark section is under it', () => {
    const dark = document.createElement('section');
    dark.dataset.theme = 'dark';
    const child = document.createElement('div');
    dark.append(child);
    document.body.append(dark);
    document.elementsFromPoint = () => [child];

    render(<Navbar name="Ziad" />);
    expect(screen.getByRole('banner')).toHaveAttribute('data-theme', 'dark');
    dark.remove();
  });

  it('stays light over a light section', () => {
    const light = document.createElement('section');
    document.body.append(light);
    document.elementsFromPoint = () => [light];

    render(<Navbar name="Ziad" />);
    expect(screen.getByRole('banner')).toHaveAttribute('data-theme', 'light');
    light.remove();
  });

  it('opens and closes the mobile menu', () => {
    document.elementsFromPoint = () => [];
    render(<Navbar name="Ziad" />);
    const toggle = screen.getByRole('button', { name: 'Toggle navigation menu' });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('mobile-menu')).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(document.getElementById('mobile-menu')).not.toBeInTheDocument();
  });
});
