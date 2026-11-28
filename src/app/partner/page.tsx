import type { Metadata } from "next";
import PartnerHubClient from "./PartnerHubClient";

export const metadata: Metadata = {
  title:
    "Entra nel Sistema Partner: Ristoranti, Liste Nozze, Viaggi, Torte & NCC | GentiLuna",
  description:
    "Entra nel sistema GentiLuna come Ristorante, Location, Negozio Liste Nozze e Regali, Agenzia di Viaggi, Pasticceria Cake Design, NCC Auto per Matrimoni o Tipografia.",
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
