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
  const moonGradId = `gl-moon-${variant}-${uid}`;
  const windGradId = `gl-wind-${variant}-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Oro Champagne Satinato: luminoso su sfondi scuri (Hero/Footer) e raffinato su sfondi chiari */}
        <linearGradient id={moonGradId} x1="10" y1="8" x2="42" y2="54" gradientUnits="userSpaceOnUse">
          {variant === "pro" ? (
            <>
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="48%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="45%" stopColor="#f3d98b" />
              <stop offset="100%" stopColor="#c5942d" />
            </>
          )}
        </linearGradient>

        <linearGradient id={windGradId} x1="28" y1="22" x2="58" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Mezza Luna Elegante sul lato sinistro, con contorno sottile champagne per visibilità garantita su ogni sfondo */}
      <path
        d="M34 11C22.4 12.2 13.5 21.9 13.5 33.7C13.5 46 23.4 55.5 35.6 54.8C40.6 54.5 45.1 52.5 48.5 49.3C39.6 49.5 31.8 42.8 31 33.5C30.2 24.8 35 16.9 42.4 13.4C39.7 11.9 36.9 10.7 34 11Z"
        fill={`url(#${moonGradId})`}
        stroke="#b88924"
        strokeOpacity="0.35"
        strokeWidth="0.9"
      />

      {/* Sottili scie di vento leggero nello spazio aperto a destra (nessuna sovrapposizione con la luna) */}
      <path
        d="M36 33C42 30 49 30.5 55 25.5"
        stroke={`url(#${windGradId})`}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M38 39.5C44.5 37.5 50.5 38.5 57.5 34.5"
        stroke={`url(#${windGradId})`}
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Stelle luminose festose nello spazio aperto della falce */}
      <path
        d="M46.5 16.5L47.7 20L51.2 21.2L47.7 22.4L46.5 25.9L45.3 22.4L41.8 21.2L45.3 20L46.5 16.5Z"
        fill="#fde68a"
        stroke="#c5942d"
        strokeOpacity="0.4"
        strokeWidth="0.5"
      />
      <circle cx="54.5" cy="16" r="1.8" fill="#fef3c7" />
      <circle cx="52.5" cy="43.5" r="1.4" fill="#fde68a" opacity="0.9" />
    </svg>
  );
}
