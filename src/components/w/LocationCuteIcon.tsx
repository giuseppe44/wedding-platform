import React from "react";
import type { LocationIconKind } from "@/lib/locationMeta";

export function LocationCuteIcon({ kind }: { kind: LocationIconKind }) {
  if (kind === "bride_home") {
    return (
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 border border-rose-200/90 flex items-center justify-center shadow-sm">
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" aria-hidden="true">
          <path d="M8 22L24 9L40 22" stroke="#e11d48" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 20V38C12 39.1 12.9 40 14 40H34C35.1 40 36 39.1 36 38V20" fill="#fff1f2" stroke="#f43f5e" strokeWidth="2.2" />
          <rect x="20" y="27" width="8" height="13" rx="2" fill="#fda4af" stroke="#e11d48" strokeWidth="1.6" />
          <path d="M24 19.5C22.6 18 20.5 18.7 20.5 20.5C20.5 22.3 24 24.5 24 24.5C24 24.5 27.5 22.3 27.5 20.5C27.5 18.7 25.4 18 24 19.5Z" fill="#f43f5e" />
        </svg>
      </div>
    );
  }

  if (kind === "groom_home") {
    return (
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-50 to-amber-50 border border-sky-200/90 flex items-center justify-center shadow-sm">
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" aria-hidden="true">
          <path d="M8 22L24 9L40 22" stroke="#0284c7" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 20V38C12 39.1 12.9 40 14 40H34C35.1 40 36 39.1 36 38V20" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2.2" />
          <rect x="20" y="27" width="8" height="13" rx="2" fill="#7dd3fc" stroke="#0369a1" strokeWidth="1.6" />
          {/* Simpatico papillon sopra la porta */}
          <path d="M19 18L24 21L19 24V18ZM29 18L24 21L29 24V18Z" fill="#0369a1" />
          <circle cx="24" cy="21" r="1.4" fill="#fbbf24" />
        </svg>
      </div>
    );
  }

  if (kind === "church") {
    return (
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50 border border-amber-200/90 flex items-center justify-center shadow-sm">
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" aria-hidden="true">
          {/* Croce dorata sul campanile */}
          <path d="M24 6V13M21 9.5H27" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
          {/* Tetto chiesa */}
          <path d="M10 24L24 13L38 24" stroke="#d97706" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Facciata chiesa */}
          <path d="M13 22V39C13 40 13.8 40.5 14.8 40.5H33.2C34.2 40.5 35 40 35 39V22" fill="#fffbeb" stroke="#d97706" strokeWidth="2.2" />
          {/* Portone ad arco */}
          <path d="M20 40.5V31C20 28.8 21.8 27 24 27C26.2 27 28 28.8 28 31V40.5" fill="#fcd34d" stroke="#b45309" strokeWidth="1.8" />
          {/* Rosone */}
          <circle cx="24" cy="21" r="2.6" fill="#fda4af" stroke="#d97706" strokeWidth="1.4" />
        </svg>
      </div>
    );
  }

  if (kind === "hotel") {
    return (
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-50 border border-emerald-200/90 flex items-center justify-center shadow-sm">
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" aria-hidden="true">
          {/* Stelline Hotel / Villa */}
          <circle cx="17" cy="9" r="1.5" fill="#f59e0b" />
          <circle cx="24" cy="7.5" r="2" fill="#f59e0b" />
          <circle cx="31" cy="9" r="1.5" fill="#f59e0b" />
          {/* Edificio Villa/Hotel */}
          <rect x="11" y="13" width="26" height="27" rx="3" fill="#ecfdf5" stroke="#059669" strokeWidth="2.2" />
          {/* Finestre luminose */}
          <rect x="15.5" y="17.5" width="4.5" height="4.5" rx="1" fill="#fde68a" stroke="#059669" strokeWidth="1.2" />
          <rect x="21.75" y="17.5" width="4.5" height="4.5" rx="1" fill="#fde68a" stroke="#059669" strokeWidth="1.2" />
          <rect x="28" y="17.5" width="4.5" height="4.5" rx="1" fill="#fde68a" stroke="#059669" strokeWidth="1.2" />
          <rect x="15.5" y="25" width="4.5" height="4.5" rx="1" fill="#6ee7b7" />
          <rect x="28" y="25" width="4.5" height="4.5" rx="1" fill="#6ee7b7" />
          {/* Ingresso ad arco con tenda */}
          <path d="M20.5 40V32C20.5 30 22 28.5 24 28.5C26 28.5 27.5 30 27.5 32V40" fill="#10b981" stroke="#047857" strokeWidth="1.6" />
        </svg>
      </div>
    );
  }

  if (kind === "civic") {
    return (
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-100 via-stone-50 to-orange-50 border border-amber-200/90 flex items-center justify-center shadow-sm">
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" aria-hidden="true">
          <path d="M8 19L24 10L40 19H8Z" fill="#fde68a" stroke="#b45309" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M13 21V36M20.5 21V36M27.5 21V36M35 21V36" stroke="#d97706" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="8" y="36" width="32" height="4" rx="1.5" fill="#b45309" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-100 via-amber-50 to-rose-50 border border-emerald-200/90 flex items-center justify-center shadow-sm">
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" aria-hidden="true">
        <path d="M13 13H22L20 24C19.6 26.5 18 28 17.5 28C17 28 15.4 26.5 15 24L13 13Z" fill="#fde68a" stroke="#059669" strokeWidth="2" />
        <path d="M17.5 28V37M14 37H21" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
        <path d="M26 13H35L33 24C32.6 26.5 31 28 30.5 28C30 28 28.4 26.5 28 24L26 13Z" fill="#fda4af" stroke="#059669" strokeWidth="2" />
        <path d="M30.5 28V37M27 37H34" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="9" r="1.5" fill="#f59e0b" />
      </svg>
    </div>
  );
}
