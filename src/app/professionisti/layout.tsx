import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "GentiLuna per Fotografi e Professionisti Wedding | Consegna Foto e Clienti",
  description:
    "La piattaforma dedicata a fotografi, videomaker e fornitori matrimonio: consegna digitale degli album in alta definizione, vetrina professionale, recensioni certificate e nuovi clienti.",
  alternates: {
    canonical: "/professionisti",
  },
};

export default function ProfessionistiLayout({ children }: { children: ReactNode }) {
  return children;
}
