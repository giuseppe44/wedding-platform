# ☁️ CLOUD DEPLOY CHECKLIST (Vercel + Supabase)

L'architettura della RC 1.0 è **CLOUD READY**.
Non ci sono dipendenze dal file system locale che bloccano l'esecuzione serverless e le API sono configurate per adattarsi dinamicamente ai servizi cloud.

Ecco i passaggi manuali necessari per mettere in produzione l'app.

### CLOUD READY: SÌ 🟢

---

## 📋 PROCEDURA DI DEPLOYMENT

### 1. Crea Supabase
- Registrati/Accedi a [Supabase](https://supabase.com/).
- Crea un nuovo progetto (New Project).
- Vai su *Project Settings -> Database* e annota la `Transaction string` (DATABASE_URL) e la `Session string` (DIRECT_URL).

### 2. Crea Bucket Storage
- Su Supabase, vai su *Storage -> New Bucket*.
- Chiama il bucket esattamente **`wedding-media`**.
- Rendilo **Public**!
- Vai su *Project Settings -> API* e annota la `Project URL` e la `service_role secret`.

### 3. Aggiorna lo Schema per PostgreSQL
- Nel file locale `prisma/schema.prisma`, cambia temporaneamente la configurazione per Vercel:
  ```prisma
  datasource db {
    provider  = "postgresql"
    url       = env("DATABASE_URL")
    directUrl = env("DIRECT_URL")
  }
  ```
- **Attenzione:** Dopo averlo fatto, cancella la cartella `prisma/migrations` se presente, per non avere conflitti con SQLite durante il deploy.

### 4. Crea GitHub Repository
- Fai il push del progetto aggiornato su un tuo repository GitHub (privato o pubblico). Assicurati che il file `.env` sia inserito in `.gitignore`.

### 5. Collega Vercel e Inserisci Environment Variables
- Registrati/Accedi a [Vercel](https://vercel.com/) e importa il tuo repository.
- Prima di cliccare "Deploy", apri la sezione **Environment Variables** e inserisci ESATTAMENTE queste 5 variabili:
  1. `DATABASE_URL` (Valore: la Transaction string di Supabase)
  2. `DIRECT_URL` (Valore: la Session string di Supabase)
  3. `NEXT_PUBLIC_SUPABASE_URL` (Valore: la Project URL di Supabase)
  4. `SUPABASE_SERVICE_ROLE_KEY` (Valore: la chiave service_role di Supabase)
  5. `JWT_SECRET` (Valore: Una stringa sicura casuale, es. `mia-chiave-segreta-12345`)

### 6. Configura Build Command & Deploy
- Nella configurazione Vercel, imposta come **Build Command**:
  `npx prisma generate && npx prisma db push && next build`
- Clicca **Deploy**.

### 7. Esegui Seed Demo (Chiara & Matteo)
- Poiché Vercel Serverless non fa girare script interattivi, puoi popolare il tuo database Cloud lanciando il seed dal tuo computer locale, passandogli la stringa Cloud (avendo Node.js installato):
  `DATABASE_URL="tua_stringa_supabase" npx prisma db seed`
- *Alternativa*: puoi usare Supabase SQL Editor e copiare a mano dei finti dati se preferisci.

### 8. Testa il tutto 🚀
Usa il link Vercel generato (`https://nome-progetto.vercel.app`) per eseguire i test richiesti:
- **Test Upload:** Carica una foto come invitato. Verifica su Supabase Storage che la foto sia nel bucket `wedding-media/uploads/...`
- **Test QR Code:** Vai nella dashboard Sposi; verifica che il QR Code punti al dominio Vercel, non a localhost.
- **Test Download:** Dalla dashboard Sposi, clicca su "Scarica ZIP". Il server Vercel pescherà dal bucket e ti fornirà lo ZIP al volo.

---
*Nota Tecnica sul Limite Serverless:* La generazione dello ZIP funziona perfettamente. Tuttavia, poiché il piano Vercel gratuito ha un timeout di 10 secondi sulle Server Actions, se le foto approvate superano le diverse centinaia di megabyte (che richiedono più di 10s per il download da S3 e la compressione), l'operazione potrebbe andare in timeout. Su un piano Vercel Pro il timeout è di 5 minuti, risolvendo il problema alla radice.*
