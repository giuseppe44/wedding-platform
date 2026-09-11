"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginAction } from "@/app/actions";
import Link from "next/link";
import { Camera, Heart, Shield, ArrowLeft } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role")?.toUpperCase();
  
  const activeRole: "COUPLE" | "PHOTOGRAPHER" | "ADMIN" = 
    (roleParam === "PHOTOGRAPHER" || roleParam === "ADMIN") ? roleParam : "COUPLE";

  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");

  useEffect(() => {
    if (activeRole === "COUPLE") setEmail("sposi@demo.it");
    if (activeRole === "PHOTOGRAPHER") setEmail("demo@fotografo.it");
    if (activeRole === "ADMIN") setEmail("admin@weddingplatform.com");
  }, [activeRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await loginAction(activeRole, email, password, rememberMe);
    
    if (activeRole === "PHOTOGRAPHER") router.push("/dashboard");
    else if (activeRole === "ADMIN") router.push("/admin");
    else router.push("/couple/demo-chiara-e-matteo"); // Sposi DEMO
  };

  const content = (() => {
    switch (activeRole) {
      case "COUPLE":
        return {
          title: "Accesso Sposi",
          desc: "Accedi alla tua area privata per gestire il tuo matrimonio, gli invitati, i tavoli e i professionisti.",
          icon: <Heart className="h-6 w-6 text-rose-500" />
        };
      case "PHOTOGRAPHER":
        return {
          title: "Area Professionisti",
          desc: "Accedi alla tua area professionale per gestire il tuo profilo, i tuoi servizi, i matrimoni a cui sei collegato e tutte le funzionalità disponibili per il tuo piano.",
          icon: <Camera className="h-6 w-6 text-stone-800" />
        };
      case "ADMIN":
        return {
          title: "Accesso Amministratore",
          desc: "Pannello di controllo globale della piattaforma e gestione utenti.",
          icon: <Shield className="h-6 w-6 text-blue-600" />
        };
    }
  })();

  return (
    <Card className="w-full shadow-lg border-stone-200">
      <CardHeader className="text-center space-y-4 pt-8">
        <div className="mx-auto bg-stone-50 p-4 rounded-full inline-block">
          {content.icon}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-serif text-stone-800">{content.title}</CardTitle>
          <CardDescription className="text-stone-500">
            {content.desc}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-stone-50 h-12" 
              required 
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {activeRole === "COUPLE" && (
                <Link href="#" className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
                  Password dimenticata?
                </Link>
              )}
            </div>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-stone-50 h-12" 
              required 
            />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Checkbox 
              id="remember" 
              checked={rememberMe}
              onCheckedChange={(c) => setRememberMe(c as boolean)}
            />
            <Label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Ricorda la mia password
            </Label>
          </div>

          <Button type="submit" className="w-full h-12 text-lg rounded-xl bg-stone-900 hover:bg-stone-800" disabled={loading}>
            {loading ? "Accesso in corso..." : "Accedi alla Dashboard"}
          </Button>

          {activeRole === "COUPLE" && (
            <div className="text-center pt-4 border-t border-stone-100">
              <p className="text-sm text-stone-500">
                Non hai ancora un account? <Link href="#" className="font-semibold text-stone-800 hover:underline">Registrati</Link>
              </p>
            </div>
          )}
          {activeRole === "PHOTOGRAPHER" && (
            <div className="text-center pt-4 border-t border-stone-100">
              <p className="text-sm text-stone-500">
                Sei un nuovo professionista? <Link href="#" className="font-semibold text-stone-800 hover:underline">Unisciti a noi</Link>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna alla Home
        </Link>
      </div>
      <div className="max-w-md w-full mx-auto">
        <Suspense fallback={<div className="text-center p-8 text-stone-500">Caricamento...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
