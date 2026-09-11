"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginAction, registerAction } from "@/app/actions";
import Link from "next/link";
import { Camera, Heart, Shield, ArrowLeft, CheckCircle2, Star } from "lucide-react";

function AuthFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role")?.toUpperCase();
  
  const activeRole: "COUPLE" | "PHOTOGRAPHER" | "ADMIN" = 
    (roleParam === "PHOTOGRAPHER" || roleParam === "ADMIN") ? roleParam : "COUPLE";

  const [mode, setMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(false);

  const [regName, setRegName] = useState("");
  const [regBusinessName, setRegBusinessName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  useEffect(() => {
    if (mode === "LOGIN") {
      if (activeRole === "COUPLE") setEmail("sposi@demo.it");
      if (activeRole === "PHOTOGRAPHER") setEmail("demo@fotografo.it");
      if (activeRole === "ADMIN") setEmail("admin@weddingplatform.com");
    } else {
      setEmail("");
    }
  }, [activeRole, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === "LOGIN") {
        await loginAction(activeRole, email, password, rememberMe);
      } else {
        await registerAction(activeRole, {
          name: regName,
          email: regEmail,
          password: regPassword,
          businessName: regBusinessName
        });
      }
      
      if (activeRole === "PHOTOGRAPHER") router.push("/dashboard");
      else if (activeRole === "ADMIN") router.push("/admin");
      else router.push("/couple/demo-chiara-e-matteo");
    } catch (error: any) {
      alert(error.message || "Si è verificato un errore");
      setLoading(false);
    }
  };

  const loginFormContent = (
    <Card className="w-full shadow-lg border-stone-200">
      <CardHeader className="text-center space-y-4 pt-8">
        <div className="mx-auto bg-stone-50 p-4 rounded-full inline-block">
          {activeRole === "COUPLE" && <Heart className="h-6 w-6 text-rose-500" />}
          {activeRole === "PHOTOGRAPHER" && <Camera className="h-6 w-6 text-stone-800" />}
          {activeRole === "ADMIN" && <Shield className="h-6 w-6 text-blue-600" />}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-serif text-stone-800">
            {activeRole === "COUPLE" ? "Accesso Sposi" : activeRole === "PHOTOGRAPHER" ? "Area Professionisti" : "Accesso Amministratore"}
          </CardTitle>
          <CardDescription className="text-stone-500">
            {activeRole === "COUPLE" ? "Accedi alla tua area privata per gestire il tuo matrimonio e gli invitati." : 
             activeRole === "PHOTOGRAPHER" ? "Accedi per gestire il tuo profilo e i tuoi matrimoni." : 
             "Pannello di controllo globale."}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-stone-50 h-12" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-stone-50 h-12" required />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Checkbox id="remember" checked={rememberMe} onCheckedChange={(c) => setRememberMe(c as boolean)} />
            <Label htmlFor="remember" className="text-sm font-medium leading-none">Ricorda la mia password</Label>
          </div>

          <Button type="submit" className="w-full h-12 text-lg rounded-xl bg-stone-900 hover:bg-stone-800" disabled={loading}>
            {loading ? "Accesso in corso..." : "Accedi alla Dashboard"}
          </Button>

          {activeRole !== "ADMIN" && (
            <div className="text-center pt-4 border-t border-stone-100">
              <p className="text-sm text-stone-500">
                {activeRole === "COUPLE" ? "Non hai ancora un account?" : "Sei un nuovo professionista?"}
                {" "}
                <button type="button" onClick={() => setMode("REGISTER")} className="font-semibold text-stone-800 hover:underline">
                  {activeRole === "COUPLE" ? "Registrati" : "Unisciti a noi"}
                </button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );

  const registerFormContent = (
    <Card className="w-full shadow-lg border-stone-200">
      <CardHeader className="text-center space-y-4 pt-8">
        <div className="mx-auto bg-stone-50 p-4 rounded-full inline-block">
          {activeRole === "COUPLE" ? <Heart className="h-6 w-6 text-rose-500" /> : <Camera className="h-6 w-6 text-stone-800" />}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-serif text-stone-800">
            {activeRole === "COUPLE" ? "Crea il tuo Spazio" : "Registrati come Professionista"}
          </CardTitle>
          <CardDescription className="text-stone-500">
            {activeRole === "COUPLE" ? "Inizia a raccogliere i ricordi del tuo matrimonio." : "Unisciti alla nostra rete esclusiva."}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="regName">Nome Completo</Label>
            <Input id="regName" value={regName} onChange={(e) => setRegName(e.target.value)} className="bg-stone-50 h-12" required />
          </div>
          {activeRole === "PHOTOGRAPHER" && (
            <div className="space-y-2">
              <Label htmlFor="regBusinessName">Nome Attività / Studio</Label>
              <Input id="regBusinessName" value={regBusinessName} onChange={(e) => setRegBusinessName(e.target.value)} className="bg-stone-50 h-12" required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="regEmail">Email</Label>
            <Input id="regEmail" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="bg-stone-50 h-12" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="regPassword">Password</Label>
            <Input id="regPassword" type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="bg-stone-50 h-12" required />
          </div>

          <Button type="submit" className="w-full h-12 text-lg rounded-xl bg-stone-900 hover:bg-stone-800" disabled={loading}>
            {loading ? "Creazione in corso..." : "Registrati e Accedi"}
          </Button>

          <div className="text-center pt-4 border-t border-stone-100">
            <p className="text-sm text-stone-500">
              Hai già un account?{" "}
              <button type="button" onClick={() => setMode("LOGIN")} className="font-semibold text-stone-800 hover:underline">
                Accedi ora
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  if (mode === "REGISTER" && activeRole === "PHOTOGRAPHER") {
    return (
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 pr-0 lg:pr-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-4">
              Trasforma ogni evento in una macchina trova-clienti.
            </h1>
            <p className="text-lg text-stone-600">
              Porta il tuo brand e i tuoi contatti sugli smartphone di centinaia di invitati. Raccogli foto, offri stampe e ricevi recensioni a 5 stelle in modo automatico.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <h3 className="font-bold text-stone-900 text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-stone-400" /> Piano Base (Gratuito)
              </h3>
              <ul className="space-y-3 text-stone-600 text-sm">
                <li className="flex gap-2"><span>•</span> Creazione Spazi Matrimonio illimitati</li>
                <li className="flex gap-2"><span>•</span> Raccolta foto invitati tramite QR Code</li>
                <li className="flex gap-2"><span>•</span> Vetrina Pubblica Base</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 p-6 rounded-2xl shadow-xl text-white">
              <h3 className="font-bold text-amber-300 text-lg mb-4 flex items-center gap-2">
                <Star className="text-amber-300 w-5 h-5" /> Piano Premium
              </h3>
              <ul className="space-y-3 text-stone-300 text-sm">
                <li className="flex gap-2"><span>•</span> Contatti diretti (WhatsApp, Email, Tel) in Vetrina</li>
                <li className="flex gap-2"><span>•</span> Posizionamento prioritario nelle ricerche</li>
                <li className="flex gap-2"><span>•</span> Modulo richiesta stampe per gli ospiti</li>
                <li className="flex gap-2"><span>•</span> Creazione Servizi Extra illimitati</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {registerFormContent}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto">
      {mode === "LOGIN" ? loginFormContent : registerFormContent}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl w-full mx-auto mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna alla Home
        </Link>
      </div>
      <Suspense fallback={<div className="text-center p-8 text-stone-500">Caricamento...</div>}>
        <AuthFlow />
      </Suspense>
    </div>
  );
}
