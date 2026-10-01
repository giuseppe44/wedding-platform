
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function ScratchDate({ date }: { date: Date }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Setup canvas size
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      // Fill with gold/champagne texture
      ctx.fillStyle = "#d4af37";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some noise/texture
      for (let i = 0; i < 500; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)";
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
      }
      
      // Write hint text
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "italic 16px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Scopri la data", canvas.width / 2, canvas.height / 2);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Drawing logic
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 40; // Brush size

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
      if (isRevealed) return;
      setIsDrawing(true);
      const { x, y } = getPosition(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      // Prevent scrolling when scratching on mobile
      if ("touches" in e && e.cancelable) {
        e.preventDefault();
      }
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || isRevealed) return;
      const { x, y } = getPosition(e);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      if ("touches" in e && e.cancelable) {
        e.preventDefault();
      }

      checkReveal();
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    const checkReveal = () => {
      // Simple heuristic: if we stroked enough times (or randomly over time), reveal it
      // A full pixel check is expensive, so we just use a timeout or a counter in a real app,
      // but let"s do a fast stride pixel check
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;
      const totalPixels = pixels.length / 4;
      
      // Check every 10th pixel for performance
      for (let i = 3; i < pixels.length; i += 40) {
        if (pixels[i] < 128) transparentPixels++;
      }
      
      const percent = transparentPixels / (totalPixels / 10);
      if (percent > 0.4) { // If 40% is revealed, auto-reveal the rest
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
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDrawing);
    };
  }, [isDrawing, isRevealed]);

  const parsedDate = new Date(date);
  const day = parsedDate.getDate();
  const month = parsedDate.toLocaleString("it-IT", { month: "long" }).toUpperCase();
  const year = parsedDate.getFullYear();

  return (
    <div className="relative w-full max-w-sm mx-auto my-8 select-none" ref={containerRef}>
      {/* Hidden Text underneath */}
      <div className="flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
        <span className="text-5xl font-serif text-white tracking-widest">{day}</span>
        <span className="text-2xl font-light tracking-[0.3em] text-stone-200 my-2">{month}</span>
        <span className="text-xl text-stone-300 font-serif italic">{year}</span>
      </div>

      {/* Canvas Overlay */}
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

