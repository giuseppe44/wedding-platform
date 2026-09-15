"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Search, MapPin, Briefcase } from "lucide-react";
import Footer from "@/components/Footer";
import PortalSearch from "@/components/PortalSearch";
import { motion } from "framer-motion";

export default function FornitoriPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col">
      
      {/* NAVBAR */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-transparent">
        <Link href="/">
          <div className="flex items-center gap-2 text-stone-900 font-serif text-2xl">
            <Heart className="w-6 h-6 text-rose-500" />
            ecos.com
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block">
            <Button className="bg-white text-stone-900 border border-stone-200 hover:bg-stone-100 rounded-full font-bold px-6 shadow-sm">
              Accedi
            </Button>
          </Link>
          <Link href="/professionisti">
            <Button className="bg-stone-900 text-white hover:bg-stone-800 rounded-full font-bold px-6 shadow-xl">
              Sei un professionista?
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">
              Trova i migliori professionisti
            </h1>
            <p className="text-stone-500 text-lg md:text-xl font-light max-w-2xl mx-auto">
              Fotografi, location, videomaker e molto altro. Cerca tra i migliori fornitori per rendere il tuo evento indimenticabile.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100"
          >
            <PortalSearch />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
