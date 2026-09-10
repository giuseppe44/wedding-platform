"use client";

import { Check, ArrowUpRight, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface PlanWidgetProps {
  role: "COUPLE" | "PHOTOGRAPHER";
  currentPlanName: string;
  isActive: boolean;
  expiresAt?: string | null;
  features: { included: string[]; missing: string[] };
  upgradeLink: string;
  stripeConfigured: boolean;
}

export function PlanWidget({ role, currentPlanName, isActive, expiresAt, features, upgradeLink, stripeConfigured }: PlanWidgetProps) {
  const isPremium = currentPlanName.toUpperCase() !== "FREE" && currentPlanName.toUpperCase() !== "BASE" && isActive;

  return (
    <Card className="overflow-hidden border-stone-200 shadow-sm bg-white mt-8">
      <div className="bg-stone-900 text-white p-4 flex justify-between items-center">
        <div>
          <h3 className="font-serif text-lg flex items-center gap-2">
            Il tuo Piano: <span className="text-yellow-400 font-bold">{currentPlanName}</span>
          </h3>
          {isPremium && expiresAt && (
            <p className="text-xs text-stone-300 mt-1">Scadenza: {new Date(expiresAt).toLocaleDateString()}</p>
          )}
        </div>
        <div className="hidden sm:block">
          {!isPremium && (
            <span className="bg-white/20 px-3 py-1 text-xs rounded-full border border-white/30 backdrop-blur-sm">
              Upgrade Consigliato
            </span>
          )}
        </div>
      </div>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100">
          
          {/* Included Features */}
          <div className="p-6 bg-stone-50/50">
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              Cosa puoi fare ora
            </h4>
            <ul className="space-y-3">
              {features.included.map((feat, i) => (
                <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Features (Upgrade) */}
          <div className="p-6">
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-stone-400" />
              Sblocca con Upgrade
            </h4>
            
            {features.missing.length > 0 ? (
              <ul className="space-y-3 mb-6">
                {features.missing.map((feat, i) => (
                  <li key={i} className="text-sm text-stone-500 flex items-start gap-2">
                    <span className="text-stone-300 mt-0.5">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-stone-500 mb-6">Hai sbloccato tutte le funzionalità disponibili!</p>
            )}

            <div className="mt-auto">
              {!isPremium && stripeConfigured ? (
                <Link href={upgradeLink}>
                  <Button className="w-full bg-stone-900 text-white rounded-xl shadow-sm hover:bg-stone-800 transition-all flex items-center gap-2">
                    Scopri i Piani Premium
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : !isPremium && !stripeConfigured ? (
                <Button disabled className="w-full bg-stone-200 text-stone-500 rounded-xl shadow-sm flex items-center gap-2 cursor-not-allowed">
                  Scopri i Piani Premium
                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                </Button>
              ) : null}
              
              {!stripeConfigured && !isPremium && (
                <p className="text-xs text-amber-600 mt-3 flex items-start gap-1">
                  <Zap className="w-3 h-3 mt-0.5 shrink-0" />
                  Pagamenti temporaneamente disabilitati. I piani saranno acquistabili al lancio.
                </p>
              )}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
