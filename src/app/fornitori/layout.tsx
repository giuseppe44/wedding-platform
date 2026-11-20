import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Fornitori Matrimonio e Fotografi Top Pro in Italia",
  description:
    "Esplora la directory ufficiale dei fornitori matrimonio su GentiLuna: trova fotografi, videomaker, location, wedding planner, musicisti e fioristi nella tua zona.",
  alternates: {
    canonical: "/fornitori",
  },
};

export default function FornitoriLayout({ children }: { children: ReactNode }) {
  return children;
}
