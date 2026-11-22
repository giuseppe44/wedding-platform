"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ScratchDateProps {
  date: Date | string;
  revealKey?: string;
  onReveal?: () => void;
}

export default function ScratchDate({ date, revealKey, onReveal }: ScratchDateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onRevealRef = useRef(onReveal);
  const [isRevealed, setIsRevealed] = useState(false);

  const isDrawingRef = useRef(false);
  const isRevealedRef = useRef(false);

  useEffect(() => {
    onRevealRef.current = onReveal;
  }, [onReveal]);

  const triggerReveal = () => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;
    setIsRevealed(true);
    if (typeof window !== "undefined") {
      if (revealKey) {
        try {
          window.sessionStorage.setItem(`gentiluna_scratch_${revealKey}`, "1");
        } catch {
          // ignore storage errors
        }
      }
      window.dispatchEvent(
        new CustomEvent("gentiluna:date-revealed", { detail: { key: revealKey || "default" } })
      );
    }
    onRevealRef.current?.();
  };

  useEffect(() => {
    if (revealKey && typeof window !== "undefined") {
      try {
        if (window.sessionStorage.getItem(`gentiluna_scratch_${revealKey}`) === "1") {
          isRevealedRef.current = true;
          setIsRevealed(true);
          window.dispatchEvent(
            new CustomEvent("gentiluna:date-revealed", { detail: { key: revealKey } })
          );
          return;
        }
      } catch {
        // ignore storage errors
      }
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initCanvas = () => {
      canvas.width = container.offsetWidth || 320;
      canvas.height = container.offsetHeight || 160;

      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#d4af37");
      grad.addColorStop(0.5, "#edd178");
      grad.addColorStop(1, "#a97d14");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 450; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)";
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
      }

      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.font = "italic 18px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✨ Gratta per scoprire la data ✨", canvas.width / 2, canvas.height / 2);
    };

    initCanvas();

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 44;

    const getPosition = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const checkReveal = () => {
      if (isRevealedRef.current || canvas.width === 0 || canvas.height === 0) return;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;
      let sampled = 0;

      for (let i = 3; i < pixels.length; i += 40) {
        sampled++;
        if (pixels[i] < 128) transparentPixels++;
      }

      const percent = sampled > 0 ? transparentPixels / sampled : 0;
      if (percent > 0.3) {
        triggerReveal();
      }
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      if (isRevealedRef.current) return;
      isDrawingRef.current = true;
      const { x, y } = getPosition(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.5, y + 0.5);
      ctx.stroke();

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

      if (Math.random() < 0.16) checkReveal();
    };

    const stopDrawing = () => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      checkReveal();
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
  }, [revealKey]);

  const parsedDate = new Date(date);
  const day = parsedDate.getDate();
  const month = parsedDate.toLocaleString("it-IT", { month: "long" }).toUpperCase();
  const year = parsedDate.getFullYear();

  return (
    <div className="w-full max-w-sm mx-auto my-6 select-none flex flex-col items-center">
      <div className="relative w-full" ref={containerRef}>
        <div className="flex flex-col items-center justify-center p-8 bg-white/15 backdrop-blur-md rounded-2xl border border-amber-200/40 shadow-2xl">
          <span className="text-5xl font-serif text-white tracking-widest drop-shadow">{day}</span>
          <span className="text-2xl font-light tracking-[0.3em] text-amber-100 my-2">{month}</span>
          <span className="text-xl text-stone-200 font-serif italic">{year}</span>
        </div>

        <motion.canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full rounded-2xl cursor-pointer touch-none shadow-xl border border-amber-200/50"
          animate={{ opacity: isRevealed ? 0 : 1 }}
          transition={{ duration: 0.75 }}
          style={{ pointerEvents: isRevealed ? "none" : "auto" }}
        />
      </div>
    </div>
  );
}
