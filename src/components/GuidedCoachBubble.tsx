"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Target,
  Lightbulb,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  MessageCircleHeart,
  ArrowRight,
} from "lucide-react";

export type CoachTipKind = "DONE" | "TODO" | "SUGGESTION" | "DID_YOU_KNOW";

export interface CoachTip {
  id: string;
  kind: CoachTipKind;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}

interface GuidedCoachBubbleProps {
  role: "COUPLE" | "PRO";
  storageKey: string;
  completedCount: number;
  totalSteps: number;
  tips: CoachTip[];
}

const KIND_META: Record<
  CoachTipKind,
  {
    badge: string;
    bgCard: string;
    bgBadge: string;
    border: string;
    icon: typeof CheckCircle2;
  }
> = {
  TODO: {
    badge: "Devi ancora completare",
    bgCard: "from-rose-50/90 via-white to-amber-50/60",
    bgBadge: "bg-rose-100 text-rose-800 border-rose-200",
    border: "border-rose-200/90",
    icon: Target,
  },
  SUGGESTION: {
    badge: "Ti suggeriamo",
    bgCard: "from-amber-50/90 via-white to-orange-50/50",
    bgBadge: "bg-amber-100 text-amber-900 border-amber-200",
    border: "border-amber-200/90",
    icon: Lightbulb,
  },
  DID_YOU_KNOW: {
    badge: "Sapevi che...",
    bgCard: "from-violet-50/80 via-white to-rose-50/50",
    bgBadge: "bg-violet-100 text-violet-900 border-violet-200",
    border: "border-violet-200/80",
    icon: Sparkles,
  },
  DONE: {
    badge: "Hai completato",
    bgCard: "from-emerald-50/80 via-white to-teal-50/50",
    bgBadge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    border: "border-emerald-200/90",
    icon: CheckCircle2,
  },
};

export function GuidedCoachBubble({
  role,
  storageKey,
  completedCount,
  totalSteps,
  tips,
}: GuidedCoachBubbleProps) {
  const [filter, setFilter] = useState<"ALL" | CoachTipKind>("ALL");
  const [index, setIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(`coach_collapsed_${storageKey}`) === "1") {
        setCollapsed(true);
      }
    } catch {
      // ignore storage errors
    }
  }, [storageKey]);

  const toggleCollapsed = (next: boolean) => {
    setCollapsed(next);
    try {
      window.localStorage.setItem(`coach_collapsed_${storageKey}`, next ? "1" : "0");
    } catch {
      // ignore storage errors
    }
  };

  const filteredTips = useMemo(() => {
    if (filter === "ALL") return tips;
    return tips.filter((t) => t.kind === filter);
  }, [tips, filter]);

  const safeTips = filteredTips.length > 0 ? filteredTips : tips;
  const activeTip = safeTips[index % Math.max(safeTips.length, 1)];

  if (!activeTip) return null;

  const meta = KIND_META[activeTip.kind];
  const Icon = meta.icon;
  const pendingCount = tips.filter((t) => t.kind === "TODO").length;

  if (collapsed) {
    return (
      <div className="my-4 flex justify-start">
        <button
          type="button"
          onClick={() => toggleCollapsed(false)}
          className="inline-flex items-center gap-2.5 bg-white hover:bg-rose-50/70 text-stone-800 border border-stone-200 hover:border-rose-300 px-4 py-2.5 rounded-2xl shadow-sm transition-all text-xs sm:text-sm font-medium cursor-pointer"
        >
          <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center shrink-0">
            <MessageCircleHeart className="w-4 h-4" />
          </span>
          <span>
            <strong>Nuvoletta Guida</strong> • {completedCount}/{totalSteps} completati
            {pendingCount > 0 ? ` · ${pendingCount} consigli da vedere` : " · Sapevi che?"}
          </span>
          <span className="text-rose-600 font-bold ml-1">Apri</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative my-5">
      <div
        className={`relative rounded-3xl bg-gradient-to-br ${meta.bgCard} border ${meta.border} p-4 sm:p-6 shadow-[0_12px_32px_-12px_rgba(28,25,23,0.12)] transition-all`}
      >
        {/* Top bar: status + filters + dismiss */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${meta.bgBadge}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {meta.badge}
            </span>
            <span className="text-[11px] font-semibold text-stone-500 bg-white/80 border border-stone-200/80 px-2.5 py-1 rounded-full">
              {role === "COUPLE" ? "Consigli Sposi" : "Coach Professionisti"} · {completedCount}/{totalSteps}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(
              [
                { key: "ALL", label: "Tutti" },
                { key: "TODO", label: "Da fare" },
                { key: "DONE", label: "Completati" },
                { key: "SUGGESTION", label: "Ti suggeriamo" },
                { key: "DID_YOU_KNOW", label: "Sapevi che" },
              ] as const
            ).map((btn) => {
              const count =
                btn.key === "ALL"
                  ? tips.length
                  : tips.filter((t) => t.kind === btn.key).length;
              if (btn.key !== "ALL" && count === 0) return null;
              const isSelected = filter === btn.key;
              return (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => {
                    setFilter(btn.key);
                    setIndex(0);
                  }}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white/80 text-stone-600 border-stone-200 hover:bg-white"
                  }`}
                >
                  {btn.label} ({count})
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => toggleCollapsed(true)}
              aria-label="Nascondi nuvoletta suggerimenti"
              title="Nascondi suggerimenti"
              className="ml-1 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Speech Bubble Content */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-snug">
              {activeTip.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
              {activeTip.body}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {activeTip.ctaHref && activeTip.ctaLabel && (
              activeTip.ctaHref.startsWith("#") ? (
                <a
                  href={activeTip.ctaHref}
                  className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-sm transition-colors"
                >
                  <span>{activeTip.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              ) : (
                <Link
                  href={activeTip.ctaHref}
                  className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-sm transition-colors"
                >
                  <span>{activeTip.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              )
            )}

            {safeTips.length > 1 && (
              <div className="inline-flex items-center gap-1 bg-white border border-stone-200 rounded-full p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() =>
                    setIndex((i) => (i - 1 + safeTips.length) % safeTips.length)
                  }
                  aria-label="Consiglio precedente"
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-700 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold text-stone-500 px-1.5 tabular-nums">
                  {(index % safeTips.length) + 1}/{safeTips.length}
                </span>
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i + 1) % safeTips.length)}
                  aria-label="Prossimo consiglio"
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-700 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
