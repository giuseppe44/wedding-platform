"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginAction } from "@/app/actions";
import Link from "next/link";
import { Camera, Heart, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"COUPLE" | "PHOTOGRAPHER" | "ADMIN">("COUPLE");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In un'app reale passeremmo email e password. Qui usiamo il mock.
    await loginAction(activeTab, email, password, rememberMe);
    
    if (activeTab === "PHOTOGRAPHER") router.push("/dashboard");
    else if (activeTab === "ADMIN") router.push("/admin");
    else router.push("/couple/demo-chiara-e-matteo"); // Sposi DEMO
  };

  const getRoleContent = () => {
    switch (activeTab) {
      case "COUPLE":
        return {
          title: "Accesso Sposi",
          desc: "Accedi alla tua area privata per gestire il tuo matrimonio.",
          defaultEmail: "sposi@chiaraematteo.it"
        };
      case "PHOTOGRAPHER":
        return {
          title: "Accesso Professionisti",
          desc: "Gestisci i tuoi servizi, i matrimoni e il tuo abbonamento.",
          defaultEmail: "demo@fotografo.it"
        };
      case "ADMIN":
        return {
          title: "Super Admin",
          desc: "Pannello di controllo globale della piattaforma.",
          defaultEmail: "admin@weddingplatform.com"
        };
    }
  };

  const content = getRoleContent();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 p-4 relative">
      {/* Background element */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
      
      <Link href="/" className="mb-8 relative z-10 hover:opacity-80 transition-opacity">
        <div className="font-serif text-3xl font-bold tracking-tighter text-stone-900 drop-shadow-sm">
          Wedding<span className="font-light">Space</span>
        </div>
      </Link>

      <Card className="w-full max-w-md shadow-2xl border-none relative z-10 overflow-hidden rounded-2xl">
        <div className="flex w-full bg-stone-100 border-b border-stone-200">
          <button
            type="button"
            onClick={() => setActiveTab("COUPLE")}
            className={`flex-1 py-4 text-sm font-medium transition-colors flex flex-col items-center gap-1 ${activeTab === "COUPLE" ? "bg-white text-stone-900 border-t-2 border-stone-900" : "text-stone-500 hover:text-stone-700"}`}
          >
            <Heart className="w-4 h-4" />
            Sposi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("PHOTOGRAPHER")}
            className={`flex-1 py-4 text-sm font-medium transition-colors flex flex-col items-center gap-1 ${activeTab === "PHOTOGRAPHER" ? "bg-white text-stone-900 border-t-2 border-stone-900" : "text-stone-500 hover:text-stone-700"}`}
          >
            <Camera className="w-4 h-4" />
            Professionisti
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ADMIN")}
            className={`flex-1 py-4 text-sm font-medium transition-colors flex flex-col items-center gap-1 ${activeTab === "ADMIN" ? "bg-white text-stone-900 border-t-2 border-stone-900" : "text-stone-500 hover:text-stone-700"}`}
          >
            <Shield className="w-4 h-4" />
            Admin
          </button>
        </div>

        <CardHeader className="text-center pt-8 pb-6 bg-white">
          <CardTitle className="text-2xl font-serif text-stone-800">{content.title}</CardTitle>
          <CardDescription className="text-stone-500 mt-2 px-4">{content.desc}</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-2 px-8 pb-10 bg-white">
          <form onSubmit={handleLogin} className="space-y-5">
            
            <div className="space-y-2 text-left">
              <Label className="text-stone-700 font-semibold">Email (Modalità Demo)</Label>
              <Input 
                type="email" 
                required 
                placeholder={content.defaultEmail}
                defaultValue={content.defaultEmail} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-stone-50 p-3 h-12 border-stone-200 focus-visible:ring-stone-500" 
              />
            </div>

            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <Label className="text-stone-700 font-semibold">Password</Label>
                {/* Dummy link for UI completeness */}
                <a href="#" className="text-xs text-stone-500 hover:text-stone-800 transition-colors">
                  Password dimenticata?
                </a>
              </div>
              <Input 
                type="password" 
                required 
                defaultValue="password123" 
                onChange={(e) => setPassword(e.target.value)}
                className="bg-stone-50 p-3 h-12 border-stone-200 focus-visible:ring-stone-500" 
              />
            </div>

            <div className="flex items-center space-x-2 pt-2 pb-2">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-stone-300 data-[state=checked]:bg-stone-900 data-[state=checked]:text-white h-5 w-5"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-stone-600 cursor-pointer select-none"
              >
                Ricorda la mia password
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-stone-900 text-white rounded-xl text-lg font-medium hover:bg-stone-800 transition-all shadow-md"
              disabled={loading}
            >
              {loading ? "Accesso in corso..." : "Accedi al Portale"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-stone-500">
            Non hai un account? <a href="#" className="text-stone-900 font-semibold hover:underline">Registrati ora</a>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-sm text-stone-500 relative z-10 flex gap-4">
        <Link href="/" className="hover:text-stone-900 transition-colors">Torna alla Home</Link>
        <span>•</span>
        <Link href="/privacy" className="hover:text-stone-900 transition-colors">Privacy</Link>
        <span>•</span>
        <Link href="/terms" className="hover:text-stone-900 transition-colors">Termini</Link>
      </div>
    </div>
  );
}
