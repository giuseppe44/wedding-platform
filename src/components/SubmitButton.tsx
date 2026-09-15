"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton({ 
  defaultText = "Salva", 
  loadingText = "Salvataggio...", 
  className = "",
  variant = "default",
  size = "default"
}: { 
  defaultText?: React.ReactNode;
  loadingText?: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}) {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className={className}
      variant={variant}
      size={size}
    >
      {pending ? loadingText : defaultText}
    </Button>
  );
}
