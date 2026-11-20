import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Piani, Prezzi e Abbonamenti per Sposi e Professionisti",
  description:
    "Scopri i piani GentiLuna per il tuo matrimonio o evento digitale e gli abbonamenti dedicati a fotografi e professionisti del settore wedding.",
  alternates: {
    canonical: "/prezzi",
  },
};

export default function PrezziLayout({ children }: { children: ReactNode }) {
  return children;
}
