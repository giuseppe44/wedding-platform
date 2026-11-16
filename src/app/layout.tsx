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
  title: "GentiLuna | Il tuo matrimonio in digitale",
  description: "La piattaforma che unisce sposi, invitati e professionisti in un unico racconto digitale.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "GentiLuna", statusBarStyle: "black-translucent" as const },
  icons: { apple: "/icons/icon-192.png" },
};

export const viewport = {
  themeColor: "#1c1917",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col font-sans ${geistSans.className}`}>{children}<CookieBanner /><PwaRegister /></body>
    </html>
  );
}
