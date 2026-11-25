"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginAction, registerAction } from "@/app/actions";
import { checkProvinceSlotAction, type ProvinceSlotCheckResult } from "@/app/actions/provinceQuotaAction";
import { getCatalogPlan } from "@/lib/plans";
import {
  PRO_CATEGORY_GROUPS,
  PRO_CATEGORY_MAP,
  getProCategoryMeta,
} from "@/lib/proCategories";
import { ITALIAN_PROVINCES } from "@/lib/provinceQuota";
import Link from "next/link";
import {
  Camera,
  Heart,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Star,
  CreditCard,
  Sparkles,
  Loader2,
  Gift,
  MapPin,
} from "lucide-react";

function AuthFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role")?.toUpperCase();
  const modeParam = searchParams.get("mode")?.toUpperCase();
  const planParam = searchParams.get("plan")?.toUpperCase() || "";
  const categoryParam = searchParams.get("category")?.toUpperCase() || "";
  const partnerParam = searchParams.get("partner")?.toUpperCase() || "";
  const selectedPlan = getCatalogPlan(planParam);

  const initialCategory =
    categoryParam && PRO_CATEGORY_MAP[categoryParam]
      ? categoryParam
      : "PHOTOGRAPHER";

  const initialRole: "COUPLE" | "PHOTOGRAPHER" | "ADMIN" =
    selectedPlan?.role
      ? selectedPlan.role
      : categoryParam && PRO_CATEGORY_MAP[categoryParam]
      ? "PHOTOGRAPHER"
      : roleParam === "PHOTOGRAPHER" || roleParam === "ADMIN"
      ? roleParam
      : "COUPLE";

  const [activeRole, setActiveRole] = useState<"COUPLE" | "PHOTOGRAPHER" | "ADMIN">(initialRole);
  const [mode, setMode] = useState<"LOGIN" | "REGISTER">(modeParam === "REGISTER" ? "REGISTER" : "LOGIN");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [regName, setRegName] = useState("");
  const [regBusinessName, setRegBusinessName] = useState("");
  const [regCategory, setRegCategory] = useState(initialCategory);
  const [regProvince, setRegProvince] = useState("");
  const [regVatNumber, setRegVatNumber] = useState("");
  const [regPartnerCode, setRegPartnerCode] = useState(partnerParam);
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [slotStatus, setSlotStatus] = useState<ProvinceSlotCheckResult | null>(null);

  const activeProMeta = getProCategoryMeta(regCategory);

  useEffect(() => {
    if (categoryParam && PRO_CATEGORY_MAP[categoryParam]) {
      setRegCategory(categoryParam);
      setActiveRole("PHOTOGRAPHER");
    }
    if (partnerParam) {
      setRegPartnerCode(partnerParam);
    }
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
  }, [roleParam, modeParam, selectedPlan, categoryParam, partnerParam]);

  useEffect(() => {
    let cancelled = false;
    if (activeRole === "PHOTOGRAPHER" && mode === "REGISTER" && regProvince) {
      checkProvinceSlotAction(regProvince, regCategory).then((res) => {
        if (!cancelled) setSlotStatus(res);
      });
    } else {
      setSlotStatus(null);
    }
    return () => {
      cancelled = true;
    };
  }, [activeRole, mode, regProvince, regCategory]);

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
          category: regCategory,
          province: regProvince,
          vatNumber: regVatNumber,
          partnerCode: regPartnerCode,
        });
      }

      const activePartner = (regPartnerCode || partnerParam).trim().toUpperCase();
      if (selectedPlan) {
        const pQuery = activePartner ? `&partner=${encodeURIComponent(activePartner)}` : "";
        router.push(
          `/dashboard/billing?plan=${encodeURIComponent(selectedPlan.code)}&autocheckout=true${pQuery}`
        );
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

  const roleSwitcher = activeRole !== "ADMIN" && (
    <div className="grid grid-cols-2 bg-stone-100 p-1 rounded-full mb-5 sm:mb-6 w-full max-w-sm mx-auto border border-stone-200 gap-1">
      <button
        type="button"
        onClick={() => setActiveRole("COUPLE")}
        className={`py-2 px-2 sm:px-3 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 text-center leading-tight whitespace-normal ${
          activeRole === "COUPLE"
            ? "bg-white text-rose-600 shadow-sm"
            : "text-stone-500 hover:text-stone-800"
        }`}
      >
        <Heart className="w-3.5 h-3.5 shrink-0" /> <span>Clienti / Sposi</span>
      </button>
      <button
        type="button"
        onClick={() => setActiveRole("PHOTOGRAPHER")}
        className={`py-2 px-2 sm:px-3 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 text-center leading-tight whitespace-normal ${
          activeRole === "PHOTOGRAPHER"
            ? "bg-stone-900 text-amber-400 shadow-sm"
            : "text-stone-500 hover:text-stone-800"
        }`}
      >
        <Camera className="w-3.5 h-3.5 shrink-0" /> <span>Professionisti</span>
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
    <Card className="w-full shadow-lg border-stone-200 rounded-3xl overflow-hidden">
      <CardHeader className="text-center space-y-4 px-5 sm:px-6 pt-7 sm:pt-8">
        {roleSwitcher}
        <div className="mx-auto bg-stone-50 p-4 rounded-full inline-block">
          {activeRole === "COUPLE" && <Heart className="h-6 w-6 text-rose-500" />}
          {activeRole === "PHOTOGRAPHER" && <Camera className="h-6 w-6 text-stone-800" />}
          {activeRole === "ADMIN" && <Shield className="h-6 w-6 text-blue-600" />}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl sm:text-3xl font-serif text-stone-800">
            {activeRole === "COUPLE"
              ? "Accesso Sposi & Eventi"
              : activeRole === "PHOTOGRAPHER"
              ? "Area Professionisti"
              : "Accesso Amministratore"}
          </CardTitle>
          <CardDescription className="text-stone-500 text-sm">
            {activeRole === "COUPLE"
              ? "Accedi alla tua area privata per gestire il tuo spazio, le foto e gli invitati."
              : activeRole === "PHOTOGRAPHER"
              ? "Accedi per gestire la tua vetrina (o Doppia Vetrina) e i tuoi eventi."
              : "Pannello di controllo globale."}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-8 pt-4">
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

          <div className="flex items-start gap-2.5 py-1">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(c) => setRememberMe(c as boolean)}
              className="mt-0.5 shrink-0"
            />
            <label htmlFor="remember" className="block text-sm font-medium leading-snug text-stone-700 cursor-pointer">
              Resta collegato su questo dispositivo
            </label>
          </div>

          <Button
            type="submit"
            className="w-full min-h-12 h-auto py-3 px-4 text-sm sm:text-base rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold whitespace-normal text-center leading-snug disabled:opacity-90"
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2 text-white">
                <Loader2 className="w-4 h-4 animate-spin shrink-0 text-white" />
                <span>Accesso e reindirizzamento...</span>
              </span>
            ) : selectedPlan ? (
              `Accedi e Attiva (${selectedPlan.priceDisplay})`
            ) : (
              "Accedi al tuo Spazio"
            )}
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
    <Card className="w-full shadow-lg border-stone-200 rounded-3xl overflow-hidden">
      <CardHeader className="text-center space-y-4 px-5 sm:px-6 pt-7 sm:pt-8">
        {roleSwitcher}
        <div className="mx-auto bg-stone-50 p-4 rounded-full inline-block">
          {activeRole === "COUPLE" ? (
            <Heart className="h-6 w-6 text-rose-500" />
          ) : (
            <Camera className="h-6 w-6 text-stone-800" />
          )}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl sm:text-3xl font-serif text-stone-800">
            {activeRole === "COUPLE" ? "Crea il tuo Spazio" : "Candidati come Partner Ufficiale"}
          </CardTitle>
          <CardDescription className="text-stone-500 text-sm">
            {activeRole === "COUPLE"
              ? "Crea il tuo account per ricordare, condividere e organizzare i tuoi eventi."
              : "Rete a Numero Chiuso per Provincia: niente caos da portale di massa, solo fornitori selezionati."}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-8 pt-4">
        {selectedPlanBanner}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="regName">
              {activeRole === "COUPLE" ? "Nomi (es. Chiara e Matteo)" : "Nome e Cognome Referente"}
            </Label>
            <Input
              id="regName"
              placeholder={activeRole === "COUPLE" ? "Es. Chiara e Matteo" : "Es. Marco Rossi"}
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              className="bg-stone-50 h-11"
              required
            />
          </div>

          {activeRole === "PHOTOGRAPHER" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="regCategory">Categoria Attività</Label>
                <select
                  id="regCategory"
                  value={regCategory}
                  onChange={(e) => setRegCategory(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 font-medium outline-none focus:border-amber-500"
                >
                  {PRO_CATEGORY_GROUPS.map((grp) => (
                    <optgroup key={grp.groupName} label={grp.groupName}>
                      {grp.items.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="regProvince" className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Provincia Principale (Selezione a Numero Chiuso)</span>
                </Label>
                <select
                  id="regProvince"
                  value={regProvince}
                  onChange={(e) => setRegProvince(e.target.value)}
                  required
                  className="flex h-11 w-full rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 font-medium outline-none focus:border-amber-500"
                >
                  <option value="">Scegli la tua Provincia...</option>
                  {ITALIAN_PROVINCES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name} ({p.code}) — Max {p.maxPerCategory} posti
                    </option>
                  ))}
                </select>

                {slotStatus && (
                  <div
                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      slotStatus.isFull
                        ? "bg-amber-50 border-amber-300 text-amber-950"
                        : "bg-emerald-50 border-emerald-200 text-emerald-950"
                    }`}
                  >
                    {slotStatus.isFull ? (
                      <>
                        <strong>Posti al completo per {slotStatus.categoryLabel} a {slotStatus.provinceName}:</strong>{" "}
                        registrandoti ora entrerai gratuitamente in <strong>Lista d&apos;Attesa Prioritaria</strong>.
                      </>
                    ) : (
                      <>
                        <strong>Esclusività {slotStatus.provinceName}:</strong> ancora{" "}
                        <strong className="text-emerald-700">
                          {slotStatus.remainingSlots} posti disponibili su {slotStatus.maxSlots}
                        </strong>{" "}
                        per la categoria <strong>{slotStatus.categoryLabel}</strong>.
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="regBusinessName">Nome Attività / Struttura / Studio</Label>
                <Input
                  id="regBusinessName"
                  placeholder={activeProMeta.businessPlaceholder}
                  value={regBusinessName}
                  onChange={(e) => setRegBusinessName(e.target.value)}
                  className="bg-stone-50 h-11"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="regVatNumber">
                  Partita IVA <span className="text-stone-400 font-normal">(Opzionale — sblocca Doppia Vetrina)</span>
                </Label>
                <Input
                  id="regVatNumber"
                  placeholder="Es. 02656280902 (puoi inserirla anche dopo)"
                  value={regVatNumber}
                  onChange={(e) => setRegVatNumber(e.target.value)}
                  className="bg-stone-50 h-11"
                />
              </div>
            </>
          )}

          {activeRole === "COUPLE" && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-1.5">
              <Label htmlFor="regPartnerCode" className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-amber-600" />
                Hai il Codice di un Fotografo o Fornitore Partner? (Opzionale)
              </Label>
              <Input
                id="regPartnerCode"
                placeholder="Es. F01, W01, R01 (sblocca subito il -15% sui piani)"
                value={regPartnerCode}
                onChange={(e) => setRegPartnerCode(e.target.value.toUpperCase())}
                className="bg-white h-10 font-mono uppercase text-sm border-amber-300"
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
              className="bg-stone-50 h-11"
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
              className="bg-stone-50 h-11"
              required
            />
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200 w-full">
            <Checkbox
              id="regTerms"
              checked={acceptedTerms}
              onCheckedChange={(c) => setAcceptedTerms(c as boolean)}
              className="mt-0.5 shrink-0"
            />
            <label
              htmlFor="regTerms"
              className="block flex-1 min-w-0 text-xs text-stone-700 leading-relaxed font-normal cursor-pointer text-left break-words"
            >
              Dichiaro di aver letto e accettato integralmente i{" "}
              <Link href="/terms" target="_blank" className="underline font-semibold text-stone-900 hover:text-rose-600">
                Termini e Condizioni
              </Link>{" "}
              (inclusi gli artt. 3–8 su responsabilità contenuti, licenze d&apos;autore e manleva) e l&apos;{" "}
              <Link href="/privacy" target="_blank" className="underline font-semibold text-stone-900 hover:text-rose-600">
                Informativa sulla Privacy
              </Link>
              .
            </label>
          </div>

          <Button
            type="submit"
            className="w-full min-h-12 h-auto py-3.5 px-4 text-sm sm:text-base rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold whitespace-normal text-center leading-snug shadow-sm disabled:opacity-85"
            disabled={loading || !acceptedTerms}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2 text-white">
                <Loader2 className="w-4 h-4 animate-spin shrink-0 text-white" />
                <span>Reindirizzamento in corso...</span>
              </span>
            ) : selectedPlan ? (
              `Registrati e Procedi al Pagamento (${selectedPlan.priceDisplay})`
            ) : (
              "Crea Account e Continua"
            )}
          </Button>

          <div className="text-center pt-3 border-t border-stone-100">
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
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-7 pr-0 lg:pr-8 text-center lg:text-left lg:pt-4">
          <div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-3">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-bold uppercase tracking-wider">
                Categoria: {activeProMeta.label}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-900 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Selezione a Numero Chiuso
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-4">
              Pochi professionisti scelti per provincia. Infiniti eventi.
            </h1>
            <p className="text-lg text-stone-600">{activeProMeta.proValuePitch}</p>
          </div>

          <div className="space-y-5 text-left">
            <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 p-6 rounded-2xl shadow-xl text-white border border-amber-500/35">
              <h3 className="font-bold text-amber-400 text-lg mb-3 flex items-center gap-2">
                <Star className="text-amber-400 w-5 h-5 shrink-0" /> Perché GentiLuna non è il solito portale affollato
              </h3>
              <ul className="space-y-2.5 text-stone-300 text-sm">
                <li className="flex gap-2">
                  <span className="text-amber-400 font-bold">✦</span>
                  <span>
                    <strong className="text-white">Numero Chiuso Territoriale:</strong> max 15–30 Partner per categoria in ogni provincia (niente 150 concorrenti nella stessa città!).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 font-bold">✦</span>
                  <span>
                    <strong className="text-white">Codice Partner Personale (es. F01, W01):</strong> regali il -15% ai tuoi sposi; con 5 matrimoni hai il <strong className="text-amber-300">-50% sul rinnovo</strong> e con 10 matrimoni il <strong className="text-emerald-400">100% di rinnovo GRATUITO</strong>!
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 font-bold">✦</span>
                  <span>
                    <strong className="text-white">Doppia Vetrina Stessa P.IVA:</strong> gestisci fino a 2 vetrine distinte (es. Foto + Video) con un unico account.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 font-bold">✦</span>
                  <span>
                    <strong className="text-white">Promo Founders Club:</strong> € 49/anno invece di € 299 (o parti dalla Vetrina Base 0€).
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
              <h3 className="font-bold text-stone-900 text-base mb-1.5 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Pagamento Sicuro &amp; Fatturazione P.IVA
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Attiva in 30 secondi con <strong>Carta, PostePay, Apple Pay, Google Pay, PayPal</strong> oppure tramite <strong>Bonifico Aziendale</strong>.
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
