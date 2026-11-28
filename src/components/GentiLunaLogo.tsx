"use client";

import React, { useId } from "react";

interface GentiLunaLogoProps {
  className?: string;
  variant?: "default" | "pro";
}

export function GentiLunaLogo({
  className = "w-9 h-9 sm:w-10 sm:h-10",
  variant = "default",
}: GentiLunaLogoProps) {
  const uid = useId().replace(/:/g, "");
  const bgId = `gl-bg-${variant}-${uid}`;
  const bezelId = `gl-bezel-${variant}-${uid}`;
  const moonId = `gl-moon-${variant}-${uid}`;
  const ringRoseId = `gl-ring-rose-${variant}-${uid}`;
  const ringGoldId = `gl-ring-gold-${variant}-${uid}`;
  const sheenId = `gl-sheen-${variant}-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-[0_3px_10px_rgba(180,83,9,0.28)]`}
      aria-hidden="true"
    >
      <defs>
        {/* Fondo Sigillo Taglio Cuscino in Ossidiana & Velluto Espresso per contrasto netto anche su bianco */}
        <radialGradient
          id={bgId}
          cx="26"
          cy="20"
          r="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#29211d" />
          <stop offset="55%" stopColor="#161210" />
          <stop offset="100%" stopColor="#0a0807" />
        </radialGradient>

        {/* Cornice Gioiello Bisel Oro Champagne 24k */}
        <linearGradient
          id={bezelId}
          x1="4"
          y1="4"
          x2="60"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="28%" stopColor="#f6d365" />
          <stop offset="55%" stopColor="#d97706" />
          <stop offset="78%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        {/* Luna Scolpita in Oro Champagne Luminoso */}
        <linearGradient
          id={moonId}
          x1="12"
          y1="10"
          x2="44"
          y2="54"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#fef08a" />
          <stop offset="65%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Fede 1: Oro Rosa Vivo (default) o Oro Ambrato Caldo (pro) */}
        <linearGradient
          id={ringRoseId}
          x1="28"
          y1="24"
          x2="50"
          y2="46"
          gradientUnits="userSpaceOnUse"
        >
          {variant === "pro" ? (
            <>
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#ffe4e6" />
              <stop offset="48%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#e11d48" />
            </>
          )}
        </linearGradient>

        {/* Fede 2: Oro Bianco / Champagne Perlaceo */}
        <linearGradient
          id={ringGoldId}
          x1="34"
          y1="20"
          x2="54"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>

        {/* Riflesso obliquo taglio cristallo */}
        <linearGradient
          id={sheenId}
          x1="6"
          y1="6"
          x2="36"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Scudo / Sigillo Taglio Cuscino (alta visibilità su sfondi sia chiari che scuri) */}
      <rect
        x="2.5"
        y="2.5"
        width="59"
        height="59"
        rx="17"
        fill={`url(#${bgId})`}
        stroke={`url(#${bezelId})`}
        strokeWidth="2.8"
      />

      {/* Riflesso diagonale superiore */}
      <path
        d="M5 19.5C5 11.5 11.5 5 19.5 5H44.5C49.5 5 53.8 7.5 56.4 11.4L11.4 56.4C7.5 53.8 5 49.5 5 44.5V19.5Z"
        fill={`url(#${sheenId})`}
      />

      {/* Filetto interno sartoriale */}
      <rect
        x="6.8"
        y="6.8"
        width="50.4"
        height="50.4"
        rx="13"
        stroke="#fde68a"
        strokeOpacity="0.26"
        strokeWidth="0.9"
      />

      {/* Grande Falce di Luna Gentile Scolpita */}
      <path
        d="M34.5 11.2C22.1 12.1 12.6 22.3 12.6 34.6C12.6 47.4 23.1 55.2 35.8 53.8C41.5 53.2 46.5 50.5 50.1 46.4C40.4 47.7 31.4 41.2 29.8 31.4C28.3 22.3 33.4 14.1 41.5 11.8C39.3 11.2 36.9 11 34.5 11.2Z"
        fill={`url(#${moonId})`}
      />

      {/* Luce interna sulla curva lunare */}
      <path
        d="M35.8 14.6C29.8 18.4 26.8 25.5 27.9 33C28.9 39.8 33.8 45.1 40.3 47"
        stroke="#ffffff"
        strokeOpacity="0.65"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Due Fedi Nuziali Intrecciate nel cuore della Luna (rappresentative di Matrimoni & Unioni) */}
      <circle
        cx="39.2"
        cy="34.2"
        r="7.4"
        stroke={`url(#${ringRoseId})`}
        strokeWidth="2.7"
      />
      <circle
        cx="45.8"
        cy="29.4"
        r="7.1"
        stroke={`url(#${ringGoldId})`}
        strokeWidth="2.5"
      />
      {/* Sormonto realistico dell'intreccio tra le due fedi */}
      <path
        d="M42.8 27.6C44.9 29.1 46.4 31.5 46.6 34.2"
        stroke={`url(#${ringRoseId})`}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Stella Solitario Taglio Diamante a 4 punte in alto */}
      <path
        d="M47.8 11.5L49.2 15.6L53.3 17L49.2 18.4L47.8 22.5L46.4 18.4L42.3 17L46.4 15.6L47.8 11.5Z"
        fill="#ffffff"
      />
      <circle cx="53.8" cy="12.2" r="1.4" fill="#fde68a" />
    </svg>
  );
}

interface GentiLunaBrandProps {
  theme?: "dark" | "light";
  variant?: "default" | "pro";
  badge?: string;
  size?: "md" | "lg";
}

export function GentiLunaBrand({
  theme = "light",
  variant = "default",
  badge,
  size = "md",
}: GentiLunaBrandProps) {
  const isDark = theme === "dark";
  const iconSize =
    size === "lg"
      ? "w-10 h-10 sm:w-12 sm:h-12"
      : "w-9 h-9 sm:w-11 sm:h-11";
  const titleSize =
    size === "lg"
      ? "text-[1.35rem] sm:text-[1.7rem]"
      : "text-[1.25rem] sm:text-[1.55rem]";

  return (
    <span className="inline-flex items-center gap-2.5 sm:gap-3 shrink-0 select-none">
      <GentiLunaLogo variant={variant} className={`${iconSize} shrink-0`} />
      <span className="flex flex-col text-left leading-none">
        <span className="inline-flex items-baseline gap-1.5">
          <span
            className={`font-serif font-bold tracking-tight ${titleSize} ${
              isDark ? "text-white drop-shadow-sm" : "text-stone-950"
            }`}
          >
            Genti
            <span
              className={`italic font-semibold ${
                isDark
                  ? "text-amber-300"
                  : variant === "pro"
                  ? "text-amber-700"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-rose-600 to-amber-700"
              }`}
            >
              Luna
            </span>
          </span>
          {badge && (
            <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-amber-400 text-stone-950">
              {badge}
            </span>
          )}
        </span>
        <span
          className={`text-[9px] sm:text-[10px] font-sans font-semibold uppercase tracking-[0.22em] mt-1 ${
            isDark ? "text-amber-200/85" : "text-stone-500"
          }`}
        >
          {variant === "pro" ? "Rete Ufficiale Eventi" : "Eventi & Ricordi"}
        </span>
      </span>
    </span>
  );
}
