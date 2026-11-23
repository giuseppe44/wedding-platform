import type { Metadata } from "next";
import DemoExperienceClient from "./DemoExperienceClient";

export const metadata: Metadata = {
  title: "Demo Interattiva Matrimonio, Portale Ristorante & QR Code | GentiLuna",
  description:
    "Prova dal vivo GentiLuna senza registrazione: apri la busta sigillata, gratta la data del matrimonio, cerca il tavolo, esplora il Portale Ristorante con le allergie e scopri le vetrine Partner.",
  alternates: {
    canonical: "/demo",
  },
};

export default function DemoPage() {
  return <DemoExperienceClient />;
}
