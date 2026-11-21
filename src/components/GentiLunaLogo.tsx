import React from "react";

interface GentiLunaLogoProps {
  className?: string;
  variant?: "default" | "pro";
}

export function GentiLunaLogo({
  className = "w-7 h-7",
  variant = "default",
}: GentiLunaLogoProps) {
  const gradId = variant === "pro" ? "gentiluna-moon-pro" : "gentiluna-moon-gold";
  const ribbonId = variant === "pro" ? "gentiluna-ribbon-pro" : "gentiluna-ribbon-silk";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="12" y1="8" x2="50" y2="56" gradientUnits="userSpaceOnUse">
          {variant === "pro" ? (
            <>
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="48%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f43f5e" />
            </>
          )}
        </linearGradient>

        <linearGradient id={ribbonId} x1="8" y1="22" x2="58" y2="48" gradientUnits="userSpaceOnUse">
          {variant === "pro" ? (
            <>
              <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.45" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#fff1f2" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#fecdd3" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#fde68a" stopOpacity="0.55" />
            </>
          )}
        </linearGradient>
      </defs>

      {/* Morbido velo di vento / nastro da festa attorno alla luna */}
      <path
        d="M11 39C18 47 31 50 45 43C51 40 56 34 58 29C53 35 45 39 36 39C25 39 17 34 11 39Z"
        fill={`url(#${ribbonId})`}
      />
      <path
        d="M9 32C17 24 27 25 38 30C47 34 54 32 59 25"
        stroke={`url(#${ribbonId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Mezza Luna Elegante e Gentile */}
      <path
        d="M37.5 11.5C25.6 12.2 16 22.1 16 34.2C16 46.8 26.2 56.5 38.8 55.8C44.8 55.5 50.1 52.8 53.8 48.7C44.9 49.4 36.2 42.9 35.1 33.4C34.1 24.7 39.2 16.5 47.1 13.4C44.1 12.1 40.9 11.3 37.5 11.5Z"
        fill={`url(#${gradId})`}
      />

      {/* Scintille / stelle festose trasportate dal vento */}
      <path
        d="M46 18L47.1 21.1L50.2 22.2L47.1 23.3L46 26.4L44.9 23.3L41.8 22.2L44.9 21.1L46 18Z"
        fill="#fef3c7"
      />
      <circle cx="53.5" cy="17.5" r="1.8" fill="#fde68a" />
      <circle cx="14.5" cy="19.5" r="1.4" fill="#fecdd3" opacity="0.9" />
    </svg>
  );
}
