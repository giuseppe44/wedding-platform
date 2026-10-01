
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnvelopeOpening({ initials, children }: { initials: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // If we want to remember the state, we could use localStorage.
    // For now, it shows every time the page loads.
  }, []);

  if (!isMounted) return null;

  if (isRevealed) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-100 overflow-hidden touch-none">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div 
            key="envelope"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.8 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="relative w-[340px] h-[220px] md:w-[500px] md:h-[320px] cursor-pointer shadow-2xl"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Envelope Back */}
            <div className="absolute inset-0 bg-[#e6e2dd] rounded-md shadow-inner overflow-hidden flex items-center justify-center">
              {/* Flap Shadows / Creases */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                 <polygon points="0,0 50,50 100,0" fill="#f0ebe6" stroke="#d5cfc7" strokeWidth="0.5" className="drop-shadow-sm" />
                 <polygon points="0,0 50,50 0,100" fill="#e6e2dd" stroke="#d5cfc7" strokeWidth="0.5" />
                 <polygon points="100,0 50,50 100,100" fill="#e6e2dd" stroke="#d5cfc7" strokeWidth="0.5" />
                 <polygon points="0,100 50,50 100,100" fill="#eeeae5" stroke="#d5cfc7" strokeWidth="0.5" className="drop-shadow-sm" />
              </svg>
            </div>

            {/* Wax Seal */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 md:w-20 md:h-20 bg-amber-700 rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] border-2 border-amber-800/20"
              style={{
                background: "radial-gradient(circle at 30% 30%, #b45309, #78350f, #451a03)",
                boxShadow: "inset 0 0 10px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.3)"
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-amber-100 font-serif text-xl md:text-2xl drop-shadow-md">{initials}</span>
            </motion.div>
            
            {/* Instruction Text */}
            <motion.p 
              className="absolute -bottom-12 left-0 right-0 text-center text-stone-500 font-serif italic text-sm tracking-widest"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Tocca il sigillo per aprire
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="letter-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute inset-0 w-full h-full"
            onAnimationComplete={() => setTimeout(() => setIsRevealed(true), 200)}
          >
            {/* Temporary container holding the children to create a seamless transition */}
            <motion.div 
              initial={{ y: 100, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="w-full h-full overflow-hidden"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

