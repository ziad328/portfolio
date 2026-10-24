'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Shield, FolderGit2, User, Mail } from 'lucide-react';

interface NavbarProps {
  name?: string;
}

export default function Navbar({ name = 'Portfolio' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#work', label: 'My Work', icon: FolderGit2 },
    { href: '#about', label: 'About Me', icon: User },
    { href: '#contact', label: 'How to Reach', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-white transition-colors hover:text-neutral-300"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-sm font-semibold text-white border border-neutral-700">
            {name.charAt(0) || 'P'}
          </span>
          <span>{name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <div className="h-4 w-px bg-neutral-800" />
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-700 hover:bg-neutral-800 hover:text-white"
          >
            <Shield className="h-3.5 w-3.5 text-amber-400" />
            <span>Admin</span>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/admin"
            aria-label="Admin Portal"
            className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-400 hover:text-white"
          >
            <Shield className="h-4 w-4 text-amber-400" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-400 transition-colors hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-800 bg-neutral-950 px-4 py-4 md:hidden">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-white"
                >
                  <Icon className="h-4 w-4 text-neutral-500" />
                  {link.label}
                </a>
              );
            })}
            <div className="pt-2 border-t border-neutral-800">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-neutral-900"
              >
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
