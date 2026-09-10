"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { authenticateGuestAction, authenticateGuestByTokenAction } from "./guestAuthActions";

export default function GuestLogin({ slug, title, token }: { slug: string, title: string, token?: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (token) {
      const loginWithToken = async () => {
        try {
          const result = await authenticateGuestByTokenAction(slug, token);
          if (!result.success) {
            setError(result.error || "Link non valido o revocato");
            setLoading(false);
          }
        } catch (err) {
          setError("Errore durante l'accesso");
          setLoading(false);
        }
      };
      loginWithToken();
    }
  }, [slug, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await authenticateGuestAction(slug, password);
      if (!result.success) {
        setError(result.error || "Password errata");
      }
    } catch (err) {
      setError("Si è verificato un errore");
    } finally {
      setLoading(false);
    }
  };

  if (token && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
        <p className="text-stone-500 animate-pulse">Accesso in corso tramite link...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-stone-600" />
          </div>
          <CardTitle className="text-2xl font-serif">{title}</CardTitle>
          <CardDescription>
            Questo evento è privato. Inserisci la password per accedere.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              type="password" 
              placeholder="Password dell'evento" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifica in corso..." : "Accedi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
