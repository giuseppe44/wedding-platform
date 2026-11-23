import type { Metadata } from "next";
import PartnerHubClient from "./PartnerHubClient";

export const metadata: Metadata = {
  title:
    "Ristoranti, Agenzie Viaggi, Pasticcerie, NCC & Partner Eventi | GentiLuna",
  description:
    "Unisciti a GentiLuna come Ristorante, Location, Agenzia di Viaggi, Pasticceria Cake Design, NCC Auto per Matrimoni o Tipografia: regia tavoli e allergie live, QR Code in sala e nuovi clienti a 0% commissioni.",
  alternates: {
    canonical: "/partner",
  },
  openGraph: {
    title:
      "Programma Partner Ristoranti, Agenzie Viaggi, Pasticcerie & NCC | GentiLuna",
    description:
      "Portiamo la tua attività davanti a centinaia di invitati durante matrimoni, battesimi, comunioni e lauree, con strumenti operativi reali per sala e cucina.",
    url: "https://www.gentiluna.com/partner",
  },
};

export default function PartnerPage() {
  return <PartnerHubClient />;
}
