'use client';

import React from 'react';
import Link from 'next/link';
import { VERIFIED_CONTACT_DATA } from '@/lib/finalConversionData';
import { Globe, Phone, Mail } from 'lucide-react';

const FOOTER_LINKS = [
  { label: '01 Home', href: '#hero', targetId: 'hero' },
  { label: '02 About Us', href: '#method', targetId: 'method' },
  { label: '03 Courses', href: '#tracks', targetId: 'tracks' },
  { label: '04 Experience', href: '#experience', targetId: 'experience' },
  { label: '05 Admissions', href: '#cta', targetId: 'cta' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    if (targetId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(targetId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="footer"
      className="relative z-10 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] px-6 pt-20 pb-12 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-16">
          {/* Brand Colophon (Rendered Universally Across All Themes) */}
          <div className="space-y-4 md:col-span-2">
            <Link
              href="#hero"
              onClick={(e) => handleLinkClick(e, 'hero')}
              className="group inline-flex items-center gap-3 select-none focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] rounded"
              aria-label="Tafrishaala Home"
            >
              <div className="relative flex items-center transition-all duration-300">
                <img
                  src="/brand/tafrishaala-original.png"
                  alt="Tafrishaala Original Logo"
                  className="h-18 sm:h-22 md:h-24 max-w-[340px] w-auto object-contain transition-all duration-300 drop-shadow-md"
                  style={{ imageRendering: 'auto' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/brand/tafrishaala-original.webp';
                  }}
                />
              </div>
            </Link>

            <p className="max-w-md font-mono text-xs leading-relaxed text-[var(--text-secondary)]">
              "WELCOME TO THE FUTURE. LEARN TO BUILD THE FUTURE."
              <br />
              High-quality training focused on fundamentals and real-time implementation across Noida and hybrid modalities.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-[10px] text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-[var(--accent-primary)]" />
                {VERIFIED_CONTACT_DATA.location.toUpperCase()}
              </span>
              <span>•</span>
              <span className="text-[var(--text-secondary)]">
                LIVE LEARNING & ONLINE TUTORIALS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 font-mono text-xs">
            <p className="text-[10px] uppercase tracking-widest text-[var(--accent-primary)] font-bold">
              // NAVIGATION
            </p>
            <ul className="space-y-2.5 text-[var(--text-secondary)]">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={(e) => handleLinkClick(e, link.targetId)}
                    className="hover:text-[var(--accent-primary)] transition-colors cursor-pointer text-left focus:outline-none"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Verified Contact */}
          <div className="space-y-3 font-mono text-xs">
            <p className="text-[10px] uppercase tracking-widest text-[var(--accent-primary)] font-bold">
              // CONNECT
            </p>
            <ul className="space-y-2.5 text-[var(--text-secondary)]">
              <li>
                <a
                  href={VERIFIED_CONTACT_DATA.phoneHref}
                  className="inline-flex items-center gap-2 hover:text-[var(--accent-primary)] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                  <span>{VERIFIED_CONTACT_DATA.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={VERIFIED_CONTACT_DATA.emailHref}
                  className="inline-flex items-center gap-2 hover:text-[var(--accent-primary)] transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                  <span>{VERIFIED_CONTACT_DATA.emailDisplay}</span>
                </a>
              </li>
              <li className="pt-2">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  HOURS: 10:00 AM – 7:00 PM IST
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-8 font-mono text-[11px] text-[var(--text-muted)] md:flex-row">
          <p>© {currentYear} TAFRISHAALA. ALL RIGHTS RESERVED.</p>
          <p className="flex items-center gap-2">
            <span>ENGINEERED FOR THE FUTURE</span>
            <span className="h-1 w-1 rounded-full bg-[var(--accent-primary)]" />
            <span>AWWWARDS GRADE</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
