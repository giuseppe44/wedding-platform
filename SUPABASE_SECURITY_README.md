# Guida Operativa di Sicurezza & Deploy – Progetto Matrimoni (`namvdylxeyctpjsedlmi`)

Questa guida spiega passo-passo come applicare in totale sicurezza le migration SQL sul database Supabase **senza perdere alcun dato** e come pubblicare il codice aggiornato su GitHub / Vercel mantenendo il **100% delle funzionalità esistenti**.

---

## Passo 1 – Backup Rapido Preliminare (Consigliato per Best Practice)

Anche se la migration SQL è **interamente non distruttiva** (non elimina tabelle, colonne né righe), prima di eseguire modifiche su produzione:
1. Accedi a [Supabase Dashboard](https://supabase.com/dashboard/project/namvdylxeyctpjsedlmi).
2. Vai su **Database → Backups** e verifica che l'ultimo backup automatico sia presente (oppure scarica uno snapshot rapido se desiderato).

---

## Passo 2 – Applicazione della Migration SQL (RLS + Policy + Viste + Storage)

1. Apri la dashboard del progetto **Matrimoni** (`namvdylxeyctpjsedlmi`):
   - `https://supabase.com/dashboard/project/namvdylxeyctpjsedlmi/sql/new`
2. Apri il file:
   - [`supabase/migrations/20261104000000_supabase_security_rls_fix.sql`](./supabase/migrations/20261104000000_supabase_security_rls_fix.sql)
3. Copia **tutto** il contenuto del file SQL, incollalo nell'editor SQL di Supabase e clicca **Run**.
4. Attendi il messaggio `Success. No rows returned`.
   - *Nota:* Lo script è **ripetibile (idempotente)**: può essere rieseguito in qualsiasi momento (anche dopo futuri `prisma db push`) senza generare errori di duplicazione.

---

## Passo 3 – Verifica Immediata in Supabase Security Advisor

Subito dopo aver eseguito lo script SQL:
1. Nel menu laterale di Supabase apri **Advisors → Security Advisor**:
   - `https://supabase.com/dashboard/project/namvdylxeyctpjsedlmi/advisors/security`
2. Clicca sul pulsante **Refresh** in alto a destra.
3. **Risultato atteso:**
   - Tutte le **24 segnalazioni `rls_disabled_in_public`** (incluse `public.GiftOption` e `public.ProfessionalService`) risulteranno **azzerate (0 errori)**.
   - Tutte le **segnalazioni `sensitive_columns_exposed`** risulteranno **azzerate (0 errori)**.

### Eventuali impostazioni Auth opzionali in Dashboard Supabase
Nel caso Security Advisor mostri avvisi informativi (WARN) legati al modulo GoTrue/Auth di Supabase non modificabili via SQL (es. *Leaked Password Protection*):
- Vai su **Authentication → Providers → Email** (o **Authentication → Attack Protection**) e attiva **Enable Leaked Password Protection (HaveIBeenPwned)** se disponibile nel tuo piano Supabase.

---

## Passo 4 – Variabili d'Ambiente Consigliate su Vercel

Verifica su **Vercel → Settings → Environment Variables** che siano presenti (e **MAI** prefissate con `NEXT_PUBLIC_` per i segreti):

| Variabile | Visibilità | Scopo |
|---|---|---|
| `DATABASE_URL` | **Solo Server** | Connessione Prisma PostgreSQL (Transaction Pooler) |
| `DIRECT_URL` | **Solo Server** | Connessione diretta Prisma PostgreSQL |
| `NEXT_PUBLIC_SUPABASE_URL` | Pubblica | URL istanza Supabase (`https://namvdylxeyctpjsedlmi.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Solo Server** | Upload e generazione Signed URL sul bucket privato `wedding-media` |
| `JWT_SECRET` | **Solo Server** | Stringa casuale lunga (almeno 32 caratteri) per firmare i cookie di sessione |
| `ADMIN_PASSWORD` | **Solo Server** | Password amministratore (se omessa mantiene la password attuale configurata) |
| `CRON_SECRET` | **Solo Server** | Segreto per autorizzare il job `/api/cron/rsvp` |
| `STRIPE_WEBHOOK_SECRET` | **Solo Server** | Firma crittografica `whsec_...` del webhook `/api/stripe/webhook` (configurabile anche da `/admin#impostazioni`) |

> **Importante su `prisma db push`:** Durante il deploy Vercel (`prisma db push && next build`), Prisma aggiorna solo eventuali nuove colonne dello schema **senza disattivare il RLS** già abilitato sulle tabelle esistenti. Se in futuro dovessi creare **nuove tabelle** in `prisma/schema.prisma`, riesegui semplicemente `20261104000000_supabase_security_rls_fix.sql` nel SQL Editor di Supabase.

---

## Passo 5 – Caricamento del Codice Aggiornato su GitHub & Deploy

1. Carica i file aggiornati contenuti nelle cartelle pronte sul Desktop (`Caricamento_Github_Parte_1` e `Caricamento_Github_Parte_2`) nel repository GitHub `giuseppe44/wedding-platform`.
2. Attendi circa 60-90 secondi che Vercel completi la build automatica su `https://www.gentiluna.com`.

---

## Passo 6 – Checklist di Verifica Post-Deploy

1. **Utente Anonimo (Non autenticato):**
   - Può visitare homepage, `/prezzi`, `/fornitori`, vetrine pubbliche `/pro/<slug>` ed eventi pubblici `/w/<slug>`.
   - **NON** vede mai `iban`, `passwordHash`, `Guest.token` o note allergiche nel codice sorgente della pagina; l'IBAN compare solo cliccando *Mostra IBAN per Bonifico* sugli eventi a cui ha accesso.
   - Eventi `PRIVATE` o protetti da `PASSWORD` richiedono regolarmente password o link invito prima di mostrare foto, scaricare lo ZIP (`/api/download/<slug>`) o caricare media.
   - Chiamate dirette alle API PostgREST (`https://namvdylxeyctpjsedlmi.supabase.co/rest/v1/User`, `/Guest`, `/SystemConfig`, `/Subscription`, `/Lead`) con chiave `anon` restituiscono accesso negato / zero righe private.
2. **Sposi (`COUPLE`) e Professionisti (`PHOTOGRAPHER`):**
   - Registrazione e login funzionano regolarmente (gli account già esistenti vengono migrati automaticamente a password hashata `scrypt` al primo login senza dover reimpostare la password).
   - Creazione/modifica/eliminazione di `GiftOption` (Lista Nozze / Tappe Viaggio), `ProfessionalService` (Servizi Professionista), Invitati, Tavoli, Foto, Capitoli e Documenti di Viaggio funzionano al 100%.
   - Un Utente A autenticato non può modificare branding, programma, regali, servizi o media appartenenti all'Utente B.
3. **Amministratore (`ADMIN`):**
   - Accesso regolare a `https://www.gentiluna.com/admin`, cambio piani utenti e salvataggio configurazione Stripe / SMTP (con segreti mascherati lato browser).
