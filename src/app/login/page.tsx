"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { loginAction } from "@/app/actions";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"PHOTOGRAPHER" | "COUPLE">("PHOTOGRAPHER");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginAction(role);
    if (role === "PHOTOGRAPHER") router.push("/dashboard");
    else router.push("/couple/demo-chiara-e-matteo");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-100">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="text-center bg-stone-900 text-white rounded-t-xl pb-8 pt-8">
          <CardTitle className="text-3xl font-serif">Accedi</CardTitle>
          <p className="text-stone-300 mt-2 text-sm font-light">Gestisci il tuo Spazio Digitale</p>
        </CardHeader>
        <CardContent className="pt-8 px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-stone-700">Seleziona il tuo ruolo</Label>
              <select 
                className="w-full p-3 border border-stone-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                value={role} 
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="PHOTOGRAPHER">Fotografo (Area Pro)</option>
                <option value="COUPLE">Sposi (Dashboard Moderazione)</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <Label className="text-stone-700">Email (Demo Mode)</Label>
              <Input type="email" required defaultValue={role === "PHOTOGRAPHER" ? "demo@fotografo.it" : "sposi@chiaraematteo.it"} className="bg-stone-50 p-3 h-12" />
            </div>

            <div className="space-y-3">
              <Label className="text-stone-700">Password</Label>
              <Input type="password" required defaultValue="password" className="bg-stone-50 p-3 h-12" />
            </div>

            <Button type="submit" className="w-full h-14 text-lg rounded-full mt-4 bg-stone-900 hover:bg-stone-800">
              Accedi
            </Button>
            
            <div className="text-center mt-6">
              <button type="button" onClick={() => router.push('/')} className="text-sm text-stone-500 hover:text-stone-800 underline">Torna alla Home</button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
