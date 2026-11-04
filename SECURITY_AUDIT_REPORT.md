# Report Completo Audit di Sicurezza Supabase & Applicativo – Progetto Matrimoni (GentiLuna)

- **Progetto Supabase:** `Matrimoni`
- **Project ID:** `namvdylxeyctpjsedlmi`
- **Dominio Produzione:** `https://www.gentiluna.com`
- **Data Audit & Remediation:** `2026-11-04`

---

## 1. Architettura Rilevata e Causa Radice dei 27 Problemi Supabase

1. **Accesso al Database (Backend-Only via Prisma):**
   - Nessun componente frontend (`"use client"`) interroga direttamente Supabase tramite `@supabase/supabase-js` o PostgREST (`/rest/v1/*`).
   - Tutte le operazioni `SELECT`, `INSERT`, `UPDATE`, `DELETE` avvengono esclusivamente lato server Next.js (Server Components, Server Actions, API Route Handlers) tramite **Prisma Client** (`DATABASE_URL` / `DIRECT_URL`).
   - L'unico utilizzo di `@supabase/supabase-js` è confinato nel modulo server `src/lib/storage.ts` tramite `SUPABASE_SERVICE_ROLE_KEY` per il bucket privato `wedding-media`.
2. **Autenticazione e Ruoli:**
   - Autenticazione applicativa gestita tramite cookie HTTP-Only firmati con JWT HS256 (`session` per utenti registrati e `guest_session_<weddingId>` per invitati autorizzati).
   - **Ruoli identificati:** `ADMIN` (Super Admin GentiLuna), `PHOTOGRAPHER` (Professionisti / Fornitori), `COUPLE` (Sposi / Titolari Evento), `GUEST` (Invitati con password evento o token univoco RSVP).
3. **Perché Supabase Security Advisor ha rilevato esattamente 27 vulnerabilità:**
   - Lo schema `public` contiene **24 tabelle** create da `prisma db push`.
   - Su Supabase lo schema `public` è esposto automaticamente tramite API PostgREST ai ruoli `anon` e `authenticated`. Poiché Prisma non abilita automaticamente il Row Level Security (RLS), tutte le 24 tabelle risultavano prive di RLS (**24 segnalazioni `rls_disabled_in_public`**) e 3 tabelle esponevano colonne riconosciute dal linter Supabase `0023_sensitive_columns_exposed` come credenziali/token sensibili (**3 segnalazioni `sensitive_columns_exposed`**: `User.password`, `Wedding.passwordHash`, `Guest.token`), per un totale esatto di **24 + 3 = 27 vulnerabilità**.

---

## 2. Tabella Completa delle 27 Vulnerabilità Supabase e Stato di Risoluzione

> **Nota di trasparenza:** Come richiesto dalle direttive di sicurezza, **il database di produzione `namvdylxeyctpjsedlmi` NON è stato modificato direttamente senza autorizzazione**. Tutte le 27 vulnerabilità sono risolte dallo script SQL idempotente [`supabase/migrations/20261104000000_supabase_security_rls_fix.sql`](./supabase/migrations/20261104000000_supabase_security_rls_fix.sql) e scompariranno dal Security Advisor non appena eseguirai la migration nel SQL Editor di Supabase (vedi [`SUPABASE_SECURITY_README.md`](./SUPABASE_SECURITY_README.md)).

| # | Codice Linter Supabase | Tabella / Oggetto | Classificazione Dati | Intervento Implementato (RLS + Policy + Grants) | Stato |
|---|---|---|---|---|---|
| 1 | `rls_disabled_in_public` | `public."GiftOption"` | Privato (IBAN) / Pubblico parziale | RLS abilitato; `REVOKE` colonne `iban` e `accountHolder` da `anon`; policy CRUD solo proprietario evento; vista sicura `public_gift_options_view`. | **Pronta in Migration SQL + Patch Codice** |
| 2 | `rls_disabled_in_public` | `public."ProfessionalService"` | Pubblico (se profilo attivo) / Privato scrittura | RLS abilitato; `SELECT` solo se `ProfessionalProfile.isActive = true` o titolare; `INSERT`/`UPDATE`/`DELETE` solo titolare profilo o `ADMIN`. | **Pronta in Migration SQL** |
| 3 | `rls_disabled_in_public` | `public."User"` | Strettamente Privato / Admin | RLS abilitato; `REVOKE` colonna `password` da `anon` e `authenticated`; `SELECT`/`UPDATE` solo proprio profilo (senza cambio `role`); `DELETE` solo `ADMIN`. | **Pronta in Migration SQL + Hashing `scrypt`** |
| 4 | `rls_disabled_in_public` | `public."Family"` | Privato | RLS abilitato; zero permessi ad `anon`; `SELECT`/`INSERT`/`UPDATE`/`DELETE` solo `ownerId` o `ADMIN`. | **Pronta in Migration SQL** |
| 5 | `rls_disabled_in_public` | `public."Wedding"` | Misto (Pubblico solo se `PUBLIC` senza password) | RLS abilitato; `REVOKE` `passwordHash` da `anon`; `SELECT` pubblica solo per `visibility = 'PUBLIC' AND passwordHash IS NULL`; scrittura solo `owns_wedding(id)`. | **Pronta in Migration SQL + Patch Codice** |
| 6 | `rls_disabled_in_public` | `public."Location"` | Misto (legato a visibilità `Wedding`) | RLS abilitato; `SELECT` pubblica solo se evento padre pubblico; `INSERT`/`UPDATE`/`DELETE` solo proprietario evento. | **Pronta in Migration SQL** |
| 7 | `rls_disabled_in_public` | `public."TimelineItem"` | Misto (Programma orario evento) | RLS abilitato; `SELECT` pubblica solo se evento padre pubblico; `INSERT`/`UPDATE`/`DELETE` solo proprietario evento. | **Pronta in Migration SQL + Patch Auth** |
| 8 | `rls_disabled_in_public` | `public."Guest"` | Strettamente Privato (PII + allergie + token) | RLS abilitato; zero accesso `anon`; `REVOKE` colonna `token` da PostgREST; CRUD riservato esclusivamente a `owns_wedding("weddingId")`. | **Pronta in Migration SQL + Patch Codice** |
| 9 | `rls_disabled_in_public` | `public."Message"` | Misto (Guestbook moderato) | RLS abilitato; `SELECT` pubblica solo per messaggi `APPROVED` su eventi `PUBLIC` con `showGuestbook = true`; gestione riservata al proprietario. | **Pronta in Migration SQL + Patch Codice** |
| 10 | `rls_disabled_in_public` | `public."Album"` | Misto (Raccolte fotografiche) | RLS abilitato; `SELECT` pubblica solo su eventi `PUBLIC`; `INSERT`/`UPDATE`/`DELETE` solo proprietario evento. | **Pronta in Migration SQL** |
| 11 | `rls_disabled_in_public` | `public."Media"` | Misto (Foto/Video moderati) | RLS abilitato; `SELECT` pubblica solo per media `APPROVED` su eventi `PUBLIC` (senza esporre `url` storage grezzo ad `anon`); scrittura solo proprietario. | **Pronta in Migration SQL + Proxy Firmato** |
| 12 | `rls_disabled_in_public` | `public."Table"` | Privato (Gestione tavoli ricevimento) | RLS abilitato; zero accesso `anon`; `SELECT`/`INSERT`/`UPDATE`/`DELETE` solo `owns_wedding("weddingId")`. | **Pronta in Migration SQL** |
| 13 | `rls_disabled_in_public` | `public."ProfessionalProfile"` | Vetrina Pubblica (`isActive = true`) | RLS abilitato; ad `anon` concesse solo colonne vetrina (esclusi recapiti diretti privati); scrittura solo titolare `userId` o `ADMIN`. | **Pronta in Migration SQL** |
| 14 | `rls_disabled_in_public` | `public."EventAssignment"` | Misto (Sposi + Professionista incaricato) | RLS abilitato; lettura consentita a sposi, professionista assegnato o vetrina pubblica attiva; modifica/revoca solo sposi proprietari o `ADMIN`. | **Pronta in Migration SQL** |
| 15 | `rls_disabled_in_public` | `public."Review"` | Pubblico in lettura / Scrittura verificata | RLS abilitato; lettura su profili attivi; inserimento/modifica/cancellazione vincolati all'autore proprietario dell'evento o `ADMIN`. | **Pronta in Migration SQL** |
| 16 | `rls_disabled_in_public` | `public."ChapterSelectedGuest"` | Strettamente Privato | RLS abilitato; zero accesso `anon`; CRUD riservato esclusivamente a `owns_wedding("chapterId")`. | **Pronta in Migration SQL** |
| 17 | `rls_disabled_in_public` | `public."Notification"` | Strettamente Privato per utente | RLS abilitato; zero accesso `anon`; `SELECT`/`UPDATE`/`DELETE` solo destinatario `userId` o `ADMIN`; `INSERT` bloccato a client esterni. | **Pronta in Migration SQL + Patch Codice** |
| 18 | `rls_disabled_in_public` | `public."Conversation"` | Strettamente Privato (Chat Sposi-Pro) | RLS abilitato; zero accesso `anon`; accesso solo ai due partecipanti con `EventAssignment` `ACTIVE` o `ADMIN`. | **Pronta in Migration SQL** |
| 19 | `rls_disabled_in_public` | `public."ChatMessage"` | Strettamente Privato (Messaggi Chat) | RLS abilitato; zero accesso `anon`; lettura/invio solo partecipanti con `senderId = current_app_user_id()` e assegnazione `ACTIVE`. | **Pronta in Migration SQL** |
| 20 | `rls_disabled_in_public` | `public."Plan"` | Catalogo Pubblico + Riga Segreta Admin | RLS abilitato; policy `name <> '__STRIPE_KEYS__' OR is_admin()` blocca l'esposizione delle chiavi Stripe salvate in DB; scrittura solo `ADMIN`. | **Pronta in Migration SQL + Patch Server** |
| 21 | `rls_disabled_in_public` | `public."Subscription"` | Strettamente Privato / Fatturazione | RLS abilitato; zero accesso `anon`; colonne `stripeCustomerId`/`stripeSubscriptionId` revocate; lettura solo `userId` o `ADMIN`; scrittura solo server/`ADMIN`. | **Pronta in Migration SQL + Patch Billing** |
| 22 | `rls_disabled_in_public` | `public."Lead"` | Strettamente Amministrativo | RLS abilitato; zero accesso `anon`; `SELECT`/`INSERT`/`UPDATE`/`DELETE` via PostgREST riservati esclusivamente a `ADMIN`. | **Pronta in Migration SQL** |
| 23 | `rls_disabled_in_public` | `public."TravelDocument"` | Strettamente Privato (Biglietti/Voucher) | RLS abilitato; zero accesso `anon`; accesso solo a sposi proprietari, agenzia/pro assegnato o `ADMIN`. | **Pronta in Migration SQL + Proxy Auth** |
| 24 | `rls_disabled_in_public` | `public."SystemConfig"` | Strettamente Amministrativo (Credenziali SMTP) | RLS abilitato; tutti i privilegi PostgREST revocati da `anon` e `authenticated`; policy esclusiva `is_admin()`. | **Pronta in Migration SQL + Masking UI** |
| 25 | `sensitive_columns_exposed` | `public."User"` (`password`) | Credenziali Autenticazione | RLS abilitato + `REVOKE SELECT(password)` + hashing crittografico `crypto.scryptSync` con migrazione trasparente al login + esclusione `password` dalle query Admin. | **Risolta in Codice + Migration SQL** |
| 26 | `sensitive_columns_exposed` | `public."Wedding"` (`passwordHash`) | Credenziali Accesso Evento | RLS abilitato + `REVOKE SELECT("passwordHash")` per `anon` + hashing `scrypt` password evento + esclusione `passwordHash` dai client props (`RSVPPage`). | **Risolta in Codice + Migration SQL** |
| 27 | `sensitive_columns_exposed` | `public."Guest"` (`token`) + colonne sensibili correlate (`GiftOption.iban`, `SystemConfig.smtpPass`) | Token Segreti RSVP / Dati Bancari / Segreti SMTP | RLS abilitato + `REVOKE` su `Guest.token`, `GiftOption.iban`, `GiftOption.accountHolder`, `SystemConfig.smtpPass` + rimozione `iban` e `token` dai payload RSC verso Client Components. | **Risolta in Codice + Migration SQL** |

---

## 3. Vulnerabilità Applicative (Backend / Frontend Next.js) Individuate e Corrette nel Codice

Oltre alle 27 segnalazioni database di Supabase, l'audit sul codice sorgente ha individuato e **già risolto** **11 vulnerabilità applicative**:

1. **Esposizione Server Action non autenticata di chiavi Stripe e attivazione piani gratuita (`src/app/stripeActions.ts` -> `src/lib/stripeServer.ts`):**
   - *Problema:* `getStripeAdminConfig()` e `activateUserPlanInDb()` erano esportate in un file `"use server"`, rendendole endpoint HTTP invocabili senza sessione `ADMIN`.
   - *Soluzione:* Spostate nel modulo esclusivamente server-side `src/lib/stripeServer.ts` (non invocabile dal client) e mascherate `secretKey` / `webhookSecret` / `smtpPass` nell'interfaccia Admin (`SettingsClient`).
2. **Verifica anti-manomissione ritorno pagamento e Webhook Stripe (`src/app/dashboard/billing/page.tsx`, `src/app/api/stripe/webhook/route.ts`):**
   - *Problema:* L'URL `/dashboard/billing?success=true&plan=...` attivava il piano senza verificare l'effettivo pagamento su Stripe, e il webhook accettava JSON non firmato se `STRIPE_WEBHOOK_SECRET` non era impostato.
   - *Soluzione:* Introdotta verifica crittografica server-to-server tramite API ufficiali Stripe (`checkout.sessions.retrieve` / `events.retrieve`) prima di attivare qualsiasi abbonamento.
3. **Mancanza di controllo proprietà su `updateBranding` e `addTimelineItem` (`src/app/coupleActions.ts`):**
   - *Problema:* Qualsiasi utente autenticato poteva modificare colori/messaggi o aggiungere tappe orarie a matrimoni altrui conoscendone il `timelineItemId`.
   - *Soluzione:* Aggiunta verifica rigorosa `wedding.ownerId === session.userId || wedding.coupleId === session.userId || session.role === "ADMIN"`.
4. **Esposizione IBAN nel payload HTML prima del click su "Mostra IBAN" (`src/app/w/[slug]/chapter/[chapterSlug]/page.tsx`, `GiftSection.tsx`):**
   - *Problema:* L'intero oggetto `giftOptions` (inclusi `iban` e `accountHolder`) veniva passato al Client Component `GiftSection`.
   - *Soluzione:* Rimossi `iban` e `accountHolder` dalle props iniziali (sostituiti da `hasIban: boolean`); l'IBAN viene recuperato esclusivamente su richiesta tramite `revealIban()` dopo `verifyTimelineAccess`.
5. **Esposizione `Guest.token`, `email`, `phone` e `dietaryNotes` nel Tableau pubblico (`src/app/w/[slug]/seating/page.tsx`, `seatingActions.ts`):**
   - *Problema:* `prisma.guest.findMany` passava l'intera riga ospite al Client Component `SeatingVisualizer`, esponendo nell'HTML i token segreti RSVP e le note alimentari/allergie. Inoltre `searchGuestSeating` non verificava `verifyTimelineAccess`.
   - *Soluzione:* Limitata la `select` ai soli campi visivi (`id`, `name`, `surname`, `tableId`, `category`) e aggiunto controllo `verifyTimelineAccess` + `showSeating` in `searchGuestSeating`.
6. **Controllo accessi incompleto su capitoli protetti da Password o Invitati Selezionati (`mediaActions.ts`, `api/download/[slug]/route.ts`, `uploadAction.ts`, `guestActions.ts`, `actions.ts#getLiveMedia`):**
   - *Problema:* Controllavano solo `visibility === "PRIVATE"`, ignorando `PASSWORD` e `SELECTED_GUESTS`.
   - *Soluzione:* Unificati tutti i controlli tramite `verifyTimelineAccess(chapter, "VIEW_PUBLIC")`.
7. **Iniezione notifiche esterne (`src/app/notificationActions.ts` -> `src/lib/notifications.ts`):**
   - *Problema:* `createSystemNotification` era esportata in un file `"use server"`.
   - *Soluzione:* Spostata nel modulo interno `src/lib/notifications.ts`.
8. **Password salvate in chiaro (`src/lib/password.ts`, `src/app/actions.ts`, `src/app/coupleActions.ts`, `src/app/w/[slug]/guestAuthActions.ts`):**
   - *Problema:* Le password utenti ed eventi venivano confrontate e salvate in chiaro.
   - *Soluzione:* Implementato hashing `crypto.scryptSync` con salt casuale a 128 bit e confronto `timingSafeEqual`, con aggiornamento automatico trasparente al primo login per non bloccare nessun utente esistente.
9. **Bypass `Bearer undefined` sul Cron RSVP (`src/app/api/cron/rsvp/route.ts`):**
   - *Problema:* Se `CRON_SECRET` non era configurato, `Authorization: Bearer undefined` superava il controllo.
   - *Soluzione:* Bloccato l'accesso quando `!process.env.CRON_SECRET`.
10. **Bucket Storage Privato e Proxy Documenti Viaggio / Portfolio Pro (`src/app/api/media/pro/route.ts`, `src/app/api/travel-doc/[id]/route.ts`):**
    - *Soluzione:* Creati endpoint proxy con Signed URL lato server e verifica permessi, mantenendo `wedding-media` privato (`public = false`).
11. **Hardening Cookie JWT e Log Query Produzione (`src/lib/auth.ts`, `src/lib/accessControl.ts`, `src/lib/prisma.ts`):**
    - *Soluzione:* Aggiunti flag `secure` e `sameSite: "lax"` sui cookie di sessione, derivazione HMAC sicura del segreto JWT e disattivazione di `log: ["query"]` in produzione.
