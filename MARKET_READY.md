# MARKET READY: Digital Wedding Experience

Il prodotto ha raggiunto lo stato di **Release Candidate**.
L'architettura, la sicurezza, la navigazione e il design sono stati raffinati per essere presentati a un cliente reale (fotografo o videomaker).

## 🚀 Come avviare il progetto (Locale / Demo)

Essendo basato su SQLite, l'avvio è istantaneo:
1. Aprire il terminale nella root del progetto.
2. Eseguire `npm install` (se non già fatto).
3. Generare il database della Demo: `npm run prisma:seed`
4. Avviare in locale: `npm run dev`
5. Andare su **http://localhost:3000**

## 🌟 Il Flusso Dimostrativo Consigliato
Per mostrare l'applicativo a un fotografo, segui questo esatto percorso per massimizzare l'effetto "wow":

1. **La Promessa (Landing Page)**: Apri `localhost:3000`. Mostra la cura del design e il copy orientato al valore del ricordo condiviso. Fagli capire che questo strumento *non lo sostituisce*, ma *aumenta il valore* del suo pacchetto.
2. **L'Esperienza Invitati (Mobile App)**: Dalla landing, clicca su "Esplora Demo". Mostragli quanto è bella la galleria e la timeline da mobile. Simula l'upload di una foto (Upload multiplo). Mostragli come sia possibile lasciare una dedica. Tutto senza registrazioni!
3. **Dietro le Quinte (L'Area Sposi/Fotografo)**: Apri un'altra scheda su `localhost:3000/login`.
   - Seleziona *Fotografo (Area Pro)*. Mostragli come vede i GB occupati e come può creare un evento in 20 secondi.
   - Entra nella Dashboard di "Chiara & Matteo". Fagli vedere la **Moderazione**: un solo click per scartare foto non gradite (o dediche inadeguate) prima che diventino pubbliche. Fagli notare che il Fotografo gestisce lo ZIP massivo per lui o per gli sposi, azzerando le frizioni di consegna.

---

# ☁️ CLOUD DEMO (Vercel + Supabase)

L'applicativo è architetturalmente pronto per il deploy Serverless su **Vercel** e **Supabase** (PostgreSQL + Object Storage) con piani gratuiti.

### Provider Utilizzati (Gratuiti)
- **Vercel**: Hosting Next.js App Router.
- **Supabase**: Database PostgreSQL + Storage Bucket (S3 API).

### Configurazione Supabase (Database & Storage)
1. Crea un progetto gratuito su Supabase.
2. Ottieni le stringhe di connessione Database (Transaction mode `DATABASE_URL` e Session mode `DIRECT_URL`).
3. Crea un Bucket pubblico su Supabase Storage chiamato **`wedding-media`**.

### Procedura Deploy Vercel
1. Carica il progetto su un repository GitHub.
2. Importa il progetto in Vercel.
3. Imposta le seguenti **Variabili d'Ambiente** (Environment Variables) in Vercel:
   ```env
   # SUPABASE DATABASE
   DATABASE_URL="postgres://postgres.[YOUR-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
   DIRECT_URL="postgres://postgres.[YOUR-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

   # SUPABASE STORAGE
   NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-REF].supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="eyJh..."
   ```
4. **Modifica necessaria per Postgres**: Nel file `prisma/schema.prisma`, cambia `provider = "sqlite"` in `provider = "postgresql"` (sebbene Prisma 6 possa gestirlo dinamicamente, per retrocompatibilità è bene cambiarlo). Aggiungi `directUrl = env("DIRECT_URL")` nel blocco datasource.
5. In Vercel, imposta il **Build Command**: 
   `npm run prisma:generate && prisma db push && next build`
6. Effettua il Deploy. Vercel genererà un URL `https://[nome-progetto].vercel.app`.

### Adattamento Storage Automatico
Il codice sorgente include già un adapter `src/lib/storage.ts`.
- **Se rileva** le variabili d'ambiente di Supabase, **devia tutti gli upload e i download** (anche quelli dello ZIP archiver) sui bucket cloud di Supabase.
- **Se NON le rileva** (es. in locale), mantiene tutto come `local fs` dentro `public/uploads`.
La logica funzionale non cambia di una virgola, la codebase rimane unica e coerente.

### Limiti del Piano Gratuito
- **Supabase Storage**: Limite di 1 GB di spazio gratuito totale, massimo 50 MB per singolo file di upload. Il server blocca già file sopra i 100 MB, ma su Supabase fallirebbe a 50MB. *Questo limite è sufficiente per validare l'app e generare decine di prove con i clienti, ma per una reale stagione matrimoniale servirà un piano a pagamento ($25/mese).*
- **Vercel Serverless Functions**: 10 secondi timeout. Generare lo ZIP per centinaia di mega potrebbe andare in timeout su Vercel free tier; si consiglia nel P2 di delegare la generazione ZIP a un background worker.
