"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginAction, registerAction } from "@/app/actions";
import { getCatalogPlan } from "@/lib/plans";
import Link from "next/link";
import { Camera, Heart, Shield, ArrowLeft, CheckCircle2, Star, CreditCard, Sparkles } from "lucide-react";

function AuthFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role")?.toUpperCase();
  const modeParam = searchParams.get("mode")?.toUpperCase();
  const planParam = searchParams.get("plan")?.toUpperCase() || "";
  const selectedPlan = getCatalogPlan(planParam);

  const initialRole: "COUPLE" | "PHOTOGRAPHER" | "ADMIN" =
    selectedPlan?.role ? selectedPlan.role :
    (roleParam === "PHOTOGRAPHER" || roleParam === "ADMIN") ? roleParam : "COUPLE";

  const [activeRole, setActiveRole] = useState<"COUPLE" | "PHOTOGRAPHER" | "ADMIN">(initialRole);
  const [mode, setMode] = useState<"LOGIN" | "REGISTER">(modeParam === "REGISTER" ? "REGISTER" : "LOGIN");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [regName, setRegName] = useState("");
  const [regBusinessName, setRegBusinessName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (selectedPlan?.role) {
      setActiveRole(selectedPlan.role);
    } else if (roleParam === "PHOTOGRAPHER" || roleParam === "ADMIN" || roleParam === "COUPLE") {
      setActiveRole(roleParam);
    }
    if (modeParam === "REGISTER") {
      setMode("REGISTER");
    } else if (modeParam === "LOGIN") {
      setMode("LOGIN");
    }
  }, [roleParam, modeParam, selectedPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "REGISTER" && !acceptedTerms) {
      alert("Per registrarti devi leggere e accettare i Termini e Condizioni e la Privacy Policy di GentiLuna.");
      return;
    }
    setLoading(true);

    try {
      let result: { role: string; redirectUrl: string } | undefined;
      if (mode === "LOGIN") {
        result = await loginAction(activeRole, email, password, rememberMe);
      } else {
        result = await registerAction(activeRole, {
          name: regName,
          email: regEmail,
          password: regPassword,
          businessName: regBusinessName,
        });
      }

      if (selectedPlan) {
        router.push(`/dashboard/billing?plan=${encodeURIComponent(selectedPlan.code)}&autocheckout=true`);
        return;
      }

      if (result?.redirectUrl) {
        router.push(result.redirectUrl);
      } else if (activeRole === "PHOTOGRAPHER") {
        router.push("/dashboard");
      } else if (activeRole === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard/billing");
      }
    } catch (error: any) {
      alert(error.message || "Si è verificato un errore durante l'autenticazione.");
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const demoEmail =
        activeRole === "PHOTOGRAPHER"
          ? "demo@fotografo.it"
          : activeRole === "ADMIN"
          ? "admin@gentiluna.com"
          : "sposi@demo.it";
      const result = await loginAction(activeRole, demoEmail, "password123", false);
      if (result?.redirectUrl) {
        router.push(result.redirectUrl);
      }
    } catch (err: any) {
      alert(err.message || "Errore accesso demo");
      setLoading(false);
    }
  };

  const roleSwitcher = activeRole !== "ADMIN" && (
    <div className="flex bg-stone-100 p-1 rounded-full mb-6 max-w-xs mx-auto border border-stone-200">
      <button
        type="button"
        onClick={() => setActiveRole("COUPLE")}
        className={`flex-1 py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
          activeRole === "COUPLE"
            ? "bg-white text-rose-600 shadow-sm"
            : "text-stone-500 hover:text-stone-800"
        }`}
      >
        <Heart className="w-3.5 h-3.5" /> Clienti / Sposi
      </button>
      <button
        type="button"
        onClick={() => setActiveRole("PHOTOGRAPHER")}
        className={`flex-1 py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
          activeRole === "PHOTOGRAPHER"
            ? "bg-stone-900 text-amber-400 shadow-sm"
            : "text-stone-500 hover:text-stone-800"
        }`}
      >
        <Camera className="w-3.5 h-3.5" /> Professionisti
      </button>
    </div>
  );

  const selectedPlanBanner = selectedPlan && (
    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border border-rose-200 shadow-sm text-center">
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
        <CreditCard className="w-3.5 h-3.5" /> Piano Selezionato per l&apos;Acquisto
      </div>
      <div className="text-lg font-serif font-bold text-stone-900">
        {selectedPlan.name} — <span className="text-rose-600">{selectedPlan.priceDisplay}</span>
      </div>
      <p className="text-xs text-stone-600 mt-1">
        {mode === "REGISTER"
          ? "Completa la registrazione del tuo account per procedere subito al pagamento sicuro su Stripe."
          : "Accedi al tuo account per procedere subito al pagamento sicuro su Stripe."}
      </p>
    </div>
  );

  const loginFormContent = (
    <Card className="w-full shadow-lg border-stone-200 rounded-3xl">
      <CardHeader className="text-center space-y-4 pt-8">
        {roleSwitcher}
        <div className="mx-auto bg-stone-50 p-4 rounded-full inline-block">
          {activeRole === "COUPLE" && <Heart className="h-6 w-6 text-rose-500" />}
          {activeRole === "PHOTOGRAPHER" && <Camera className="h-6 w-6 text-stone-800" />}
          {activeRole === "ADMIN" && <Shield className="h-6 w-6 text-blue-600" />}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-serif text-stone-800">
            {activeRole === "COUPLE"
              ? "Accesso Sposi & Eventi"
              : activeRole === "PHOTOGRAPHER"
              ? "Area Professionisti"
              : "Accesso Amministratore"}
          </CardTitle>
          <CardDescription className="text-stone-500">
            {activeRole === "COUPLE"
              ? "Accedi alla tua area privata per gestire il tuo spazio, le foto e gli invitati."
              : activeRole === "PHOTOGRAPHER"
              ? "Accedi per gestire la tua vetrina e i tuoi eventi."
              : "Pannello di controllo globale."}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        {selectedPlanBanner}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">La tua Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nome@esempio.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-stone-50 h-12"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-stone-50 h-12"
              required
            />
          </div>

          <div className="flex items-center space-x-2 py-1">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(c) => setRememberMe(c as boolean)}
            />
            <Label htmlFor="remember" className="text-sm font-medium leading-none cursor-pointer">
              Resta collegato su questo dispositivo
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold"
            disabled={loading}
          >
            {loading
              ? "Accesso in corso..."
              : selectedPlan
              ? `Accedi e Attiva (${selectedPlan.priceDisplay})`
              : "Accedi al tuo Spazio"}
          </Button>

          <p className="text-[11px] text-stone-400 text-center leading-relaxed">
            Accedendo confermi di aver preso visione della{" "}
            <Link href="/privacy" className="underline hover:text-stone-700" target="_blank">
              Privacy Policy
            </Link>{" "}
            e di accettare i{" "}
            <Link href="/terms" className="underline hover:text-stone-700" target="_blank">
              Termini e Condizioni
            </Link>{" "}
            di GentiLuna.
          </p>

          {activeRole !== "ADMIN" && (
            <div className="text-center pt-4 border-t border-stone-100">
              <p className="text-sm text-stone-600">
                {activeRole === "COUPLE" ? "Non hai ancora un account?" : "Sei un nuovo professionista?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode("REGISTER")}
                  className="font-bold text-rose-600 hover:underline"
                >
                  {activeRole === "COUPLE" ? "Registrati ora" : "Crea Account Pro"}
                </button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );

  const registerFormContent = (
    <Card className="w-full shadow-lg border-stone-200 rounded-3xl">
      <CardHeader className="text-center space-y-4 pt-8">
        {roleSwitcher}
        <div className="mx-auto bg-stone-50 p-4 rounded-full inline-block">
          {activeRole === "COUPLE" ? (
            <Heart className="h-6 w-6 text-rose-500" />
          ) : (
            <Camera className="h-6 w-6 text-stone-800" />
          )}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-serif text-stone-800">
            {activeRole === "COUPLE" ? "Crea il tuo Spazio" : "Registrati come Professionista"}
          </CardTitle>
          <CardDescription className="text-stone-500">
            {activeRole === "COUPLE"
              ? "Crea il tuo account per ricordare, condividere e organizzare i tuoi eventi."
              : "Unisciti alla rete ufficiale di professionisti GentiLuna."}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        {selectedPlanBanner}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="regName">
              {activeRole === "COUPLE" ? "Nomi (es. Chiara e Matteo)" : "Nome e Cognome Referente"}
            </Label>
            <Input
              id="regName"
              placeholder={activeRole === "COUPLE" ? "Es. Chiara e Matteo" : "Es. Marco Rossi"}
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              className="bg-stone-50 h-12"
              required
            />
          </div>
          {activeRole === "PHOTOGRAPHER" && (
            <div className="space-y-2">
              <Label htmlFor="regBusinessName">Nome Studio / Attività</Label>
              <Input
                id="regBusinessName"
                placeholder="Es. Studio Fotografico Rossi"
                value={regBusinessName}
                onChange={(e) => setRegBusinessName(e.target.value)}
                className="bg-stone-50 h-12"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="regEmail">Email</Label>
            <Input
              id="regEmail"
              type="email"
              placeholder="nome@esempio.it"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="bg-stone-50 h-12"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="regPassword">Crea una Password</Label>
            <Input
              id="regPassword"
              type="password"
              placeholder="Minimo 6 caratteri"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className="bg-stone-50 h-12"
              required
            />
          </div>

          <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <Checkbox
              id="regTerms"
              checked={acceptedTerms}
              onCheckedChange={(c) => setAcceptedTerms(c as boolean)}
              className="mt-0.5"
            />
            <Label htmlFor="regTerms" className="text-xs text-stone-600 leading-relaxed font-normal cursor-pointer">
              Dichiaro di aver letto e di accettare integralmente i{" "}
              <Link href="/terms" target="_blank" className="underline font-semibold text-stone-900">
                Termini e Condizioni
              </Link>{" "}
              (inclusi gli artt. 3, 4, 5, 6, 7 e 8 su responsabilità esclusiva dei contenuti caricati, licenze d&apos;autore e manleva) e l&apos;{" "}
              <Link href="/privacy" target="_blank" className="underline font-semibold text-stone-900">
                Informativa sulla Privacy
              </Link>
              .
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold"
            disabled={loading || !acceptedTerms}
          >
            {loading
              ? "Creazione spazio in corso..."
              : selectedPlan
              ? `Registrati e Procedi al Pagamento (${selectedPlan.priceDisplay})`
              : "Crea Account e Continua"}
          </Button>

          <div className="text-center pt-4 border-t border-stone-100">
            <p className="text-sm text-stone-500">
              Hai già un account?{" "}
              <button
                type="button"
                onClick={() => setMode("LOGIN")}
                className="font-bold text-stone-800 hover:underline"
              >
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
        <div className="space-y-8 pr-0 lg:pr-8 text-center lg:text-left">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-4">
              Trasforma ogni evento in una macchina trova-clienti.
            </h1>
            <p className="text-lg text-stone-600">
              Porta il tuo brand e i tuoi contatti sugli smartphone di centinaia di invitati. Raccogli foto, offri stampe e ricevi recensioni a 5 stelle in modo automatico.
            </p>
          </div>

          <div className="space-y-6 text-left">
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 p-6 rounded-2xl shadow-xl text-white border border-amber-500/30">
              <h3 className="font-bold text-amber-400 text-lg mb-3 flex items-center gap-2">
                <Star className="text-amber-400 w-5 h-5" /> Offerta Lancio Founders Club (€ 49/anno invece di € 299)
              </h3>
              <ul className="space-y-2.5 text-stone-300 text-sm">
                <li className="flex gap-2"><span>•</span> Spazi Evento illimitati con il tuo brand</li>
                <li className="flex gap-2"><span>•</span> Contatti diretti (WhatsApp, Email, Tel) in Vetrina</li>
                <li className="flex gap-2"><span>•</span> Modulo richiesta stampe e upsell (0% commissioni)</li>
                <li className="flex gap-2"><span>•</span> Posizionamento prioritario nella directory Fornitori</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
              <h3 className="font-bold text-stone-900 text-lg mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Attivazione Immediata
              </h3>
              <p className="text-stone-600 text-sm">
                Registrati in 30 secondi, scegli il tuo piano nella sezione Fatturazione e inizia subito a creare gli spazi per i tuoi clienti.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0">{registerFormContent}</div>
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
      <div className="max-w-6xl w-full mx-auto mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna alla Home
        </Link>
        <Link
          href="/prezzi"
          className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
        >
          Vedi tutti i Piani →
        </Link>
      </div>
      <Suspense fallback={<div className="text-center p-8 text-stone-500">Caricamento...</div>}>
        <AuthFlow />
      </Suspense>
    </div>
  );
}
