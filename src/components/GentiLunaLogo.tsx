"use client";

import React, { useId } from "react";

interface GentiLunaLogoProps {
  className?: string;
  variant?: "default" | "pro";
}

export function GentiLunaLogo({
  className = "w-7 h-7",
  variant = "default",
}: GentiLunaLogoProps) {
  const uid = useId().replace(/:/g, "");
  const goldGradId = `gl-gold-${variant}-${uid}`;
  const roseGoldGradId = `gl-rosegold-${variant}-${uid}`;
  const glowGradId = `gl-glow-${variant}-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Oro Metallizzato Ricco (non giallo piatto): riflessi champagne, oro 18k e bronzo caldo */}
        <linearGradient id={goldGradId} x1="8" y1="8" x2="46" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff4c8" />
          <stop offset="38%" stopColor="#e3b94c" />
          <stop offset="76%" stopColor="#b8861d" />
          <stop offset="100%" stopColor="#845a0c" />
        </linearGradient>

        {/* Secondo colore prezioso: Oro Rosa Cipria / Ametista-Cipria per il vento e le stelle */}
        <linearGradient id={roseGoldGradId} x1="28" y1="14" x2="58" y2="48" gradientUnits="userSpaceOnUse">
          {variant === "pro" ? (
            <>
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="55%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#fde2e8" />
              <stop offset="50%" stopColor="#e88aa0" />
              <stop offset="100%" stopColor="#c05875" />
            </>
          )}
        </linearGradient>

        {/* Effetto alone morbido lunare */}
        <radialGradient id={glowGradId} cx="32" cy="32" r="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e3b94c" stopOpacity="0.28" />
          <stop offset="70%" stopColor="#e88aa0" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#e3b94c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Effetto aura soffusa dorata-perlacea */}
      <circle cx="32" cy="32" r="28" fill={`url(#${glowGradId})`} />

      {/* Sottile orbita luminosa bicolore che abbraccia l'emblema */}
      <path
        d="M15 47C22 54.5 34.5 57.5 45.5 52C52.5 48.5 57 41.5 57.5 33.5"
        stroke={`url(#${roseGoldGradId})`}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="2 3"
        opacity="0.7"
      />

      {/* Mezza Luna Principale in Oro 18k Brunito */}
      <path
        d="M33.5 11C21.8 12.2 13 22 13 33.8C13 46.2 23 55.6 35.2 54.9C40.2 54.6 44.6 52.6 48 49.4C39.2 49.6 31.4 42.9 30.6 33.6C29.8 24.9 34.6 17 42 13.5C39.3 12 36.4 10.8 33.5 11Z"
        fill={`url(#${goldGradId})`}
        stroke="#78500b"
        strokeOpacity="0.35"
        strokeWidth="0.8"
      />

      {/* Filetto luce champagne sul profilo interno della luna */}
      <path
        d="M35.5 15.8C30.2 19.6 27.4 26.2 28.2 33.8C29 41.2 34 46.8 40.5 48.8"
        stroke="#fffbeb"
        strokeOpacity="0.55"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Scie di vento eleganti nello spazio aperto in Oro Rosa Satinato */}
      <path
        d="M37.5 31.5C43.5 28.5 49.5 29.2 55.5 24"
        stroke={`url(#${roseGoldGradId})`}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M39.5 38.5C45.5 36.5 51.5 37.5 58 33.2"
        stroke={`url(#${roseGoldGradId})`}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Stella a 4 punte principale bicolore (Oro + Oro Rosa) + scintille */}
      <path
        d="M47 14.5L48.3 18.4L52.2 19.7L48.3 21L47 24.9L45.7 21L41.8 19.7L45.7 18.4L47 14.5Z"
        fill={`url(#${goldGradId})`}
        stroke="#fffbeb"
        strokeOpacity="0.5"
        strokeWidth="0.6"
      />
      <circle cx="55.2" cy="15.5" r="2" fill={`url(#${roseGoldGradId})`} />
      <circle cx="52.5" cy="43.5" r="1.5" fill="#e3b94c" />
    </svg>
  );
}
