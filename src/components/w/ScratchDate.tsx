"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function ScratchDate({ date }: { date: Date }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Use refs for values that change frequently to avoid re-running useEffect and resetting canvas
  const isDrawingRef = useRef(false);
  const isRevealedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Only init the canvas once
    const initCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      ctx.fillStyle = "#d4af37";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < 500; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)";
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
      }
      
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "italic 16px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Scopri la data", canvas.width / 2, canvas.height / 2);
    };

    initCanvas();

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 40;

    const getPosition = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      if (isRevealedRef.current) return;
      isDrawingRef.current = true;
      const { x, y } = getPosition(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current || isRevealedRef.current) return;
      const { x, y } = getPosition(e);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      if (e.cancelable) {
        e.preventDefault();
      }
      
      // Throttle reveal check
      if (Math.random() < 0.1) checkReveal();
    };

    const stopDrawing = () => {
      isDrawingRef.current = false;
    };

    const checkReveal = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;
      const totalPixels = pixels.length / 4;
      
      for (let i = 3; i < pixels.length; i += 40) {
        if (pixels[i] < 128) transparentPixels++;
      }
      
      const percent = transparentPixels / (totalPixels / 10);
      if (percent > 0.4 && !isRevealedRef.current) {
        isRevealedRef.current = true;
        setIsRevealed(true);
      }
    };

    canvas.addEventListener("mousedown", startDrawing, { passive: false });
    canvas.addEventListener("mousemove", draw, { passive: false });
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    
    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDrawing);
    };
  }, []);

  const parsedDate = new Date(date);
  const day = parsedDate.getDate();
  const month = parsedDate.toLocaleString("it-IT", { month: "long" }).toUpperCase();
  const year = parsedDate.getFullYear();

  return (
    <div className="relative w-full max-w-sm mx-auto my-8 select-none" ref={containerRef}>
      <div className="flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
        <span className="text-5xl font-serif text-white tracking-widest">{day}</span>
        <span className="text-2xl font-light tracking-[0.3em] text-stone-200 my-2">{month}</span>
        <span className="text-xl text-stone-300 font-serif italic">{year}</span>
      </div>

      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-2xl cursor-pointer touch-none"
        animate={{ opacity: isRevealed ? 0 : 1 }}
        transition={{ duration: 1 }}
        onAnimationComplete={() => {
          if (isRevealed && canvasRef.current) {
            canvasRef.current.style.pointerEvents = "none";
          }
        }}
      />
    </div>
  );
}
