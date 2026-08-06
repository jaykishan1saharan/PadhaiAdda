import React from 'react';

interface PadhaiAddaLogoProps {
  className?: string;
  size?: number;
}

export const PadhaiAddaLogo: React.FC<PadhaiAddaLogoProps> = ({
  className = 'w-9 h-9',
  size,
}) => {
  return (
    <svg
      viewBox="0 0 500 500"
      className={`${className} shrink-0`}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="shieldGrad" x1="250" y1="40" x2="250" y2="440" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B132B" />
          <stop offset="100%" stopColor="#080E21" />
        </linearGradient>

        <linearGradient id="pencilGrad" x1="250" y1="200" x2="250" y2="430" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF9F1C" />
          <stop offset="100%" stopColor="#F77F00" />
        </linearGradient>

        <linearGradient id="bookPageGrad" x1="100" y1="200" x2="400" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        <linearGradient id="archOrange" x1="100" y1="50" x2="400" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF9F1C" />
          <stop offset="50%" stopColor="#FFBF69" />
          <stop offset="100%" stopColor="#FF9F1C" />
        </linearGradient>

        <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF9F1C" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Top Orange Arch */}
      <path
        d="M 90 220 A 180 180 0 0 1 410 220"
        stroke="url(#archOrange)"
        strokeWidth="20"
        strokeLinecap="round"
      />

      {/* Dark Navy Shield Container */}
      <path
        d="M 100 220 A 170 170 0 0 1 400 220 L 415 340 Q 420 370 380 390 L 260 435 Q 250 440 240 435 L 120 390 Q 80 370 85 340 Z"
        fill="url(#shieldGrad)"
        stroke="#1E293B"
        strokeWidth="10"
      />

      {/* Top Small Icons */}
      {/* 1. Left Book */}
      <g transform="translate(135, 110) scale(0.85)">
        <path d="M5 25 Q20 20 35 25 L35 55 Q20 50 5 55 Z" fill="#38BDF8" stroke="#000" strokeWidth="2" />
        <path d="M35 25 Q50 20 65 25 L65 55 Q50 50 35 55 Z" fill="#0284C7" stroke="#000" strokeWidth="2" />
      </g>

      {/* 2. Center Lightbulb */}
      <g transform="translate(230, 65)">
        {/* Rays */}
        <line x1="20" y1="2" x2="20" y2="-8" stroke="#FFBF69" strokeWidth="4" strokeLinecap="round" />
        <line x1="2" y1="12" x2="-6" y2="8" stroke="#FFBF69" strokeWidth="4" strokeLinecap="round" />
        <line x1="38" y1="12" x2="46" y2="8" stroke="#FFBF69" strokeWidth="4" strokeLinecap="round" />
        {/* Bulb */}
        <circle cx="20" cy="20" r="15" fill="#FFC600" />
        <path d="M14 31 L26 31 L24 38 L16 38 Z" fill="#38BDF8" />
        <line x1="16" y1="41" x2="24" y2="41" stroke="#FFC600" strokeWidth="3" />
      </g>

      {/* 3. Right Sheet/Doc */}
      <g transform="translate(320, 110) scale(0.85)">
        <rect x="0" y="0" width="30" height="40" rx="4" fill="#FFFFFF" />
        <line x1="6" y1="10" x2="24" y2="10" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
        <line x1="6" y1="18" x2="24" y2="18" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
        <line x1="6" y1="26" x2="18" y2="26" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Main Open Book Spread */}
      <path
        d="M 90 350 L 100 200 Q 250 180 250 240 Q 250 180 400 200 L 410 350 Q 250 320 250 380 Q 250 320 90 350 Z"
        fill="url(#bookPageGrad)"
        stroke="#0F172A"
        strokeWidth="12"
      />

      {/* Page Shading & Lines */}
      <path d="M 120 225 Q 180 215 235 235" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
      <path d="M 125 255 Q 185 245 235 265" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
      <path d="M 130 285 Q 190 275 235 295" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />

      <path d="M 380 225 Q 320 215 265 235" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
      <path d="M 375 255 Q 315 245 265 265" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
      <path d="M 370 285 Q 310 275 265 295" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />

      {/* Graduation Cap (Mortarboard) */}
      <g>
        {/* Cap Top Diamond */}
        <polygon points="250,130 370,180 250,230 130,180" fill="#0B132B" stroke="#FFFFFF" strokeWidth="8" />
        {/* Skull Cap Base */}
        <path d="M 175 200 L 175 235 C 175 260 325 260 325 235 L 325 200 Z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="6" />
        {/* Tassel Button */}
        <circle cx="250" cy="180" r="7" fill="#FF9F1C" />
        {/* Tassel Cord & Hanging Fringe */}
        <path d="M 250 180 Q 180 200 160 230" stroke="#FF9F1C" strokeWidth="5" fill="none" />
        <polygon points="152,230 168,230 165,265 155,265" fill="#FF9F1C" />
      </g>

      {/* Foreground Orange 'P' Pencil */}
      <g filter="url(#glow)">
        {/* Capital 'P' Pencil Body */}
        {/* Outer 'P' shape */}
        <path
          d="M 210 230 L 255 230 C 295 230 325 250 325 285 C 325 320 295 340 255 340 L 255 375 L 210 375 Z"
          fill="url(#pencilGrad)"
          stroke="#0F172A"
          strokeWidth="10"
        />
        {/* Inner 'P' Hole Cutout */}
        <path
          d="M 255 260 C 275 260 285 270 285 285 C 285 300 275 310 255 310 L 255 260 Z"
          fill="#0B132B"
          stroke="#0F172A"
          strokeWidth="6"
        />
        {/* Lower Pencil Stem */}
        <rect x="210" y="335" width="45" height="40" fill="url(#pencilGrad)" stroke="#0F172A" strokeWidth="8" />

        {/* Sharpened Pencil Tip at Bottom */}
        <polygon points="210,375 255,375 232.5,425" fill="#FDE047" stroke="#0F172A" strokeWidth="8" />
        {/* Lead Graphite Tip */}
        <polygon points="225,408 240,408 232.5,425" fill="#0F172A" />
      </g>
    </svg>
  );
};
