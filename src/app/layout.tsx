import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import PwaRegister from "@/components/PwaRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gentiluna.com"),
  applicationName: "GentiLuna",
  title: {
    default: "GentiLuna | Piattaforma Digitale per Matrimoni, Foto Live QR, RSVP e Fornitori",
    template: "%s | GentiLuna",
  },
  description:
    "GentiLuna è la piattaforma italiana per il tuo matrimonio in digitale: sito nozze personalizzato, foto e video live degli invitati con QR Code, gestione RSVP e tavoli, consegna fotografica e directory fornitori wedding.",
  keywords: [
    "GentiLuna",
    "Gentiluna",
    "gentiluna matrimonio",
    "piattaforma matrimonio digitale",
    "sito matrimonio personalizzato",
    "foto matrimonio qr code invitati",
    "condivisione foto matrimonio live",
    "gestione rsvp matrimonio",
    "fornitori matrimonio italia",
    "consegna foto matrimonio fotografi",
    "album digitale matrimonio",
  ],
  authors: [{ name: "GentiLuna", url: "https://www.gentiluna.com" }],
  creator: "GentiLuna",
  publisher: "GentiLuna",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://www.gentiluna.com",
    siteName: "GentiLuna",
    title: "GentiLuna | Piattaforma Digitale per Matrimoni, Eventi e Fotografi",
    description:
      "La piattaforma italiana che unisce sposi, invitati e professionisti in un unico racconto digitale: sito nozze, foto live con QR Code, RSVP, tavoli e consegna album.",
    images: [
      {
        url: "/press/gentiluna-press-showcase.jpg",
        width: 1200,
        height: 630,
        alt: "GentiLuna - Il tuo matrimonio in digitale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GentiLuna | Piattaforma Digitale per Matrimoni, Eventi e Fotografi",
    description:
      "Sito matrimonio, foto e video live degli invitati tramite QR Code, gestione RSVP, tavoli e portale fornitori wedding.",
    images: ["/press/gentiluna-press-showcase.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "GentiLuna", statusBarStyle: "black-translucent" as const },
  icons: { apple: "/icons/icon-192.png" },
};

export const viewport = {
  themeColor: "#1c1917",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.gentiluna.com/#organization",
      name: "GentiLuna",
      alternateName: ["Gentiluna", "GentiLuna.com"],
      url: "https://www.gentiluna.com",
      logo: "https://www.gentiluna.com/icons/icon-512.png",
      description:
        "GentiLuna è la piattaforma digitale italiana che unisce sposi, invitati e professionisti del matrimonio in un unico spazio interattivo.",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+39-388-124-0248",
        contactType: "customer support",
        areaServed: "IT",
        availableLanguage: ["Italian"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.gentiluna.com/#website",
      url: "https://www.gentiluna.com",
      name: "GentiLuna",
      alternateName: "Gentiluna - Il tuo matrimonio in digitale",
      inLanguage: "it-IT",
      publisher: {
        "@id": "https://www.gentiluna.com/#organization",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.gentiluna.com/#app",
      name: "GentiLuna",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web, iOS, Android (PWA)",
      url: "https://www.gentiluna.com",
      inLanguage: "it-IT",
      description:
        "Piattaforma web e app PWA per organizzare il matrimonio in digitale: sito web degli sposi, raccolta foto e video live degli invitati tramite QR Code ai tavoli, gestione RSVP e intolleranze, mappa tavoli, lista nozze, timeline dei capitoli di vita e consegna digitale per fotografi e fornitori wedding.",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "EUR",
        lowPrice: "0",
        url: "https://www.gentiluna.com/prezzi",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col font-sans ${geistSans.className}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <CookieBanner />
        <PwaRegister />
      </body>
    </html>
  );
}
