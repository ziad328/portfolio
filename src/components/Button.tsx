import type { AnchorHTMLAttributes } from 'react';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] transition-[background-color,border-color,box-shadow,transform] duration-300 ease-(--ease-out-expo) motion-safe:hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-hover btn-accent-glow',
  ghost: 'border border-border text-fg hover:border-fg-muted hover:bg-surface',
};

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: keyof typeof variants;
}

// Every CTA on the site is a link, so this renders <a> only.
export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return <a {...props} className={`${base} ${variants[variant]} ${className}`} />;
}
