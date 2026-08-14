'use client';

import React from 'react';

interface TafrishaalaLogoProps {
  className?: string;
  animated?: boolean;
  variant?: 'marquee' | 'compact' | 'wordmark';
}

export function TafrishaalaLogo({
  className = 'h-10 w-auto',
  animated = true,
}: TafrishaalaLogoProps) {
  // 24 perimeter light bulb positions along the classic marquee sign contour
  const bulbPositions = [
    // Top crest & stars
    { cx: 160, cy: 12 },
    { cx: 190, cy: 8 },
    { cx: 220, cy: 6 },
    { cx: 250, cy: 6 },
    { cx: 280, cy: 8 },
    { cx: 310, cy: 12 },
    // Top right shoulder
    { cx: 340, cy: 20 },
    { cx: 370, cy: 32 },
    { cx: 395, cy: 48 },
    // Right cap
    { cx: 410, cy: 67 },
    { cx: 395, cy: 86 },
    // Bottom right shoulder
    { cx: 370, cy: 102 },
    { cx: 340, cy: 114 },
    // Bottom crest
    { cx: 310, cy: 122 },
    { cx: 280, cy: 126 },
    { cx: 250, cy: 128 },
    { cx: 220, cy: 128 },
    { cx: 190, cy: 126 },
    { cx: 160, cy: 122 },
    // Bottom left shoulder
    { cx: 130, cy: 114 },
    { cx: 100, cy: 102 },
    // Left cap
    { cx: 75, cy: 86 },
    { cx: 60, cy: 67 },
    { cx: 75, cy: 48 },
    // Top left shoulder
    { cx: 100, cy: 32 },
    { cx: 130, cy: 20 },
  ];

  return (
    <svg
      viewBox="0 0 470 134"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      aria-label="तफरीshaala Logo"
      role="img"
    >
      <defs>
        {/* Exterior Frame Gradient */}
        <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="35%" stopColor="#b45309" />
          <stop offset="70%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>

        {/* Marquee Inner Rim Glow */}
        <linearGradient id="innerRimGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="25%" stopColor="#f59e0b" />
          <stop offset="80%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        {/* Sunburst Center Background Gradient */}
        <radialGradient id="sunburstGrad" cx="50%" cy="50%" r="55%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="20%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="85%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#dc2626" />
        </radialGradient>

        {/* Ray Beam Contrast Gradient */}
        <linearGradient id="rayGradient" x1="50%" y1="50%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0.1" />
        </linearGradient>

        {/* Text Gradient (Warm Crimson to Glowing Sunset Red) */}
        <linearGradient id="textGradRed" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff453a" />
          <stop offset="45%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>

        {/* Text Gradient (Bright Marquee Orange-Gold) */}
        <linearGradient id="textGradGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Bulb Glow Filter */}
        <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Drop Shadow for the entire marquee frame */}
        <filter id="frameShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
        </filter>

        {/* Marquee Contour Path Definition for Clipping */}
        <clipPath id="marqueeClip">
          <path d="M 140 18 C 190 2, 280 2, 330 18 C 375 22, 405 45, 415 67 C 405 89, 375 112, 330 116 C 280 132, 190 132, 140 116 C 95 112, 65 89, 55 67 C 65 45, 95 22, 140 18 Z" />
        </clipPath>
      </defs>

      {/* ─────────────────────────────────────────────────────────────
          1. MARQUEE BASE FRAME & SHADOW
          ───────────────────────────────────────────────────────────── */}
      <g filter="url(#frameShadow)">
        {/* Outer Wooden/Metallic Frame */}
        <path
          d="M 136 12 C 190 -4, 280 -4, 334 12 C 385 17, 420 42, 430 67 C 420 92, 385 117, 334 122 C 280 138, 190 138, 136 122 C 85 117, 50 92, 40 67 C 50 42, 85 17, 136 12 Z"
          fill="url(#frameGradient)"
          stroke="#78350f"
          strokeWidth="3"
        />

        {/* Inner Golden Bevel */}
        <path
          d="M 140 18 C 190 2, 280 2, 330 18 C 375 22, 405 45, 415 67 C 405 89, 375 112, 330 116 C 280 132, 190 132, 140 116 C 95 112, 65 89, 55 67 C 65 45, 95 22, 140 18 Z"
          fill="url(#innerRimGradient)"
          stroke="#fef08a"
          strokeWidth="1.5"
        />
      </g>

      {/* ─────────────────────────────────────────────────────────────
          2. INNER SUNBURST RAY FIELD (CLIPPED)
          ───────────────────────────────────────────────────────────── */}
      <g clipPath="url(#marqueeClip)">
        {/* Base Radiant Background */}
        <rect x="30" y="0" width="410" height="134" fill="url(#sunburstGrad)" />

        {/* 16 Radial Sunburst Beams */}
        <g opacity="0.45">
          <polygon points="235,67 0,0 60,0" fill="url(#rayGradient)" />
          <polygon points="235,67 120,0 180,0" fill="url(#rayGradient)" />
          <polygon points="235,67 240,0 300,0" fill="url(#rayGradient)" />
          <polygon points="235,67 360,0 420,0" fill="url(#rayGradient)" />
          <polygon points="235,67 470,0 470,40" fill="url(#rayGradient)" />
          <polygon points="235,67 470,80 470,120" fill="url(#rayGradient)" />
          <polygon points="235,67 420,134 360,134" fill="url(#rayGradient)" />
          <polygon points="235,67 300,134 240,134" fill="url(#rayGradient)" />
          <polygon points="235,67 180,134 120,134" fill="url(#rayGradient)" />
          <polygon points="235,67 60,134 0,134" fill="url(#rayGradient)" />
          <polygon points="235,67 0,120 0,80" fill="url(#rayGradient)" />
          <polygon points="235,67 0,40 0,0" fill="url(#rayGradient)" />
        </g>

        {/* Center Hotspot Burst */}
        <circle cx="235" cy="67" r="95" fill="#fffbeb" opacity="0.3" filter="url(#bulbGlow)" />

        {/* Top Decorative Stars */}
        <g fill="#b91c1c" opacity="0.9">
          <path d="M 215,22 L 217,27 L 222,27 L 218,30 L 219,35 L 215,32 L 211,35 L 212,30 L 208,27 L 213,27 Z" />
          <path d="M 235,18 L 237.5,24 L 243,24 L 238.5,27.5 L 240,33 L 235,29.5 L 230,33 L 231.5,27.5 L 227,24 L 232.5,24 Z" />
          <path d="M 255,22 L 257,27 L 262,27 L 258,30 L 259,35 L 255,32 L 251,35 L 252,30 L 248,27 L 253,27 Z" />
        </g>

        {/* Bottom Decorative Stars */}
        <g fill="#b91c1c" opacity="0.9">
          <path d="M 215,102 L 217,107 L 222,107 L 218,110 L 219,115 L 215,112 L 211,115 L 212,110 L 208,107 L 213,107 Z" />
          <path d="M 235,105 L 237.5,111 L 243,111 L 238.5,114.5 L 240,120 L 235,116.5 L 230,120 L 231.5,114.5 L 227,111 L 232.5,111 Z" />
          <path d="M 255,102 L 257,107 L 262,107 L 258,110 L 259,115 L 255,112 L 251,115 L 252,110 L 248,107 L 253,107 Z" />
        </g>
      </g>

      {/* ─────────────────────────────────────────────────────────────
          3. TYPOGRAPHY: "तफरी" (Devanagari) + "shaala" (Latin)
          ───────────────────────────────────────────────────────────── */}
      <g id="logoTypography" transform="translate(0, 0)">
        {/* Soft 3D Underlay Shadow */}
        <g opacity="0.3" transform="translate(1.5, 2.5)">
          {/* Devanagari "तफरी" Underlay */}
          <text
            x="86"
            y="76"
            fontFamily="'Rozha One', 'Yatra One', 'Mukta', 'Noto Sans Devanagari', sans-serif"
            fontSize="46"
            fontWeight="900"
            fill="#7f1d1d"
            letterSpacing="-0.02em"
          >
            तफरी
          </text>

          {/* Latin "shaala" Underlay */}
          <text
            x="202"
            y="76"
            fontFamily="'Outfit', 'Fredoka', 'Poppins', sans-serif"
            fontSize="44"
            fontWeight="900"
            fill="#7f1d1d"
            letterSpacing="-0.03em"
          >
            <tspan fill="#7f1d1d">sh</tspan>
            <tspan fill="#7f1d1d">aa</tspan>
            <tspan fill="#7f1d1d">la</tspan>
          </text>
        </g>

        {/* Main "तफरी" (Glowing Flowing Devanagari with Sweeping Shirorekha) */}
        <g>
          {/* Devanagari Text */}
          <text
            x="86"
            y="75"
            fontFamily="'Rozha One', 'Yatra One', 'Mukta', 'Noto Sans Devanagari', sans-serif"
            fontSize="46"
            fontWeight="900"
            fill="url(#textGradRed)"
            stroke="#fef08a"
            strokeWidth="0.8"
            letterSpacing="-0.02em"
          >
            तफरी
          </text>

          {/* Elegant extended swash/shirorekha connecting into shaala */}
          <path
            d="M 84 45 C 130 42, 175 42, 205 45"
            stroke="#fef08a"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 84 45 C 130 42, 175 42, 205 45"
            stroke="url(#textGradRed)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>

        {/* Main "shaala" (Bold Rounded Marquee Lettering) */}
        <text
          x="202"
          y="75"
          fontFamily="'Outfit', 'Fredoka', 'Poppins', sans-serif"
          fontSize="44"
          fontWeight="900"
          letterSpacing="-0.03em"
        >
          <tspan fill="url(#textGradRed)" stroke="#fef08a" strokeWidth="0.8">
            sh
          </tspan>
          <tspan fill="url(#textGradRed)" stroke="#fef08a" strokeWidth="0.8">
            aa
          </tspan>
          <tspan fill="url(#textGradRed)" stroke="#fef08a" strokeWidth="0.8">
            la
          </tspan>
        </text>
      </g>

      {/* ─────────────────────────────────────────────────────────────
          4. ILLUMINATED PERIMETER LIGHT BULBS
          ───────────────────────────────────────────────────────────── */}
      <g id="marqueeBulbs">
        {bulbPositions.map((bulb, index) => {
          const isAlternate = index % 2 === 0;
          return (
            <g key={index} className={animated ? 'transition-all duration-300' : ''}>
              {/* Bulb Ambient Outer Halo */}
              <circle
                cx={bulb.cx}
                cy={bulb.cy}
                r="6.5"
                fill="#fef08a"
                opacity={isAlternate ? 0.35 : 0.25}
                filter="url(#bulbGlow)"
              />

              {/* Bulb Outer Glass */}
              <circle
                cx={bulb.cx}
                cy={bulb.cy}
                r="4.2"
                fill="#fef9c3"
                stroke="#d97706"
                strokeWidth="0.75"
              />

              {/* Hot Incandescent Filament Core */}
              <circle cx={bulb.cx} cy={bulb.cy} r="2.2" fill="#ffffff" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
