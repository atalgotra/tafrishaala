'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'FREQUENCIES', targetId: 'frequency' },
  { label: 'WORLDS', targetId: 'worlds' },
  { label: 'TRACKS', targetId: 'tracks' },
  { label: 'METHOD', targetId: 'method' },
  { label: 'EXPERIENCE', targetId: 'experience' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-2.5 sm:py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-overlay)] backdrop-blur-xl shadow-lg'
          : 'py-4 sm:py-6 bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Brand Logo (Rendered Universally Across All Themes) */}
        <Link
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center gap-3 select-none focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] rounded"
          aria-label="Tafrishaala Home"
        >
          <div className="relative flex items-center transition-all duration-300">
            <img
              src="/brand/tafrishaala-original.png"
              alt="Tafrishaala Original Logo"
              className={`w-auto object-contain transition-all duration-300 drop-shadow-md ${
                isScrolled
                  ? 'h-14 sm:h-16 md:h-18 max-w-[280px]'
                  : 'h-18 sm:h-22 md:h-26 max-w-[360px]'
              }`}
              style={{ imageRendering: 'auto' }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/brand/tafrishaala-original.webp';
              }}
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-8 font-mono text-[11px] tracking-widest text-[var(--text-secondary)]"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.targetId}
              onClick={() => handleNavClick(link.targetId)}
              className="relative transition-colors duration-200 hover:text-[var(--accent-primary)] focus:outline-none focus:text-[var(--accent-primary)] cursor-pointer py-1 uppercase font-medium tracking-widest"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Controls: Frequency Selector & Portal CTA */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeSwitcher />
          <MagneticButton
            variant="primary"
            cursorText="PORTAL"
            className="px-6 py-2.5 text-xs font-mono font-bold tracking-wider"
            onClick={() => handleNavClick('cta')}
          >
            ENTER PORTAL
          </MagneticButton>
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
            aria-label="Toggle Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-6 py-6 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-4 font-mono text-xs tracking-widest">
            {NAV_LINKS.map((link) => (
              <button
                key={link.targetId}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick(link.targetId);
                }}
                className="py-2.5 text-left text-[var(--text-secondary)] border-b border-[var(--border-subtle)] hover:text-[var(--accent-primary)] cursor-pointer uppercase font-medium"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick('cta');
                }}
                className="w-full rounded-full bg-[var(--accent-primary)] py-3 text-center font-mono text-xs uppercase tracking-widest text-[var(--bg-primary)] font-bold shadow-md cursor-pointer"
              >
                ENTER PORTAL
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
