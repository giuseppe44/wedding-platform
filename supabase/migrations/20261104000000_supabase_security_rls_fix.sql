-- =============================================================================
-- MIGRATION DI SICUREZZA COMPLETA SUPABASE / POSTGRESQL
-- Progetto: Matrimoni (GentiLuna)
-- Supabase Project ID: namvdylxeyctpjsedlmi
-- Data: 2026-11-04
--
-- CARATTERISTICHE:
-- 1. Ripetibile / Idempotente (usa IF EXISTS / DROP POLICY IF EXISTS / CREATE OR REPLACE).
-- 2. Non distruttiva (ZERO cancellazioni di tabelle, colonne o dati esistenti).
-- 3. Compatibile al 100% con Prisma Server-Side: abilita ENABLE ROW LEVEL SECURITY
--    (senza FORCE ROW LEVEL SECURITY) così il ruolo database owner usato da Prisma
--    lato server continua a operare senza interruzioni, mentre PostgREST (ruoli
--    `anon` e `authenticated`) viene blindato secondo il principio del minimo privilegio.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- SEZIONE 1: FUNZIONI HELPER DI SICUREZZA (con search_path fisso)
-- Nota: `SET search_path = public` previene vulnerabilità di search_path hijacking
-- ed evita il warning Supabase `function_search_path_mutable`.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_app_user_id()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    auth.uid()::text,
    NULLIF((NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'userId'), '')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public."User" u
    WHERE u.id = public.current_app_user_id()
      AND u.role = 'ADMIN'
  );
$$;

CREATE OR REPLACE FUNCTION public.owns_wedding(p_wedding_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public."Wedding" w
      WHERE w.id = p_wedding_id
        AND (
          w."ownerId" = public.current_app_user_id()
          OR w."coupleId" = public.current_app_user_id()
        )
    );
$$;

CREATE OR REPLACE FUNCTION public.is_assigned_pro_for_wedding(p_wedding_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public."EventAssignment" ea
    INNER JOIN public."ProfessionalProfile" pp
      ON pp.id = ea."proId"
    WHERE ea."weddingId" = p_wedding_id
      AND ea.status = 'ACTIVE'
      AND pp."userId" = public.current_app_user_id()
  );
$$;

REVOKE ALL ON FUNCTION public.current_app_user_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.owns_wedding(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_assigned_pro_for_wedding(text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.current_app_user_id() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.owns_wedding(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_assigned_pro_for_wedding(text) TO anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- SEZIONE 2: ABILITAZIONE ROW LEVEL SECURITY (RLS) SU TUTTE LE 24 TABELLE
--            DELLO SCHEMA `public` (+ eventuale `_prisma_migrations`)
-- Risolve tutte le segnalazioni `rls_disabled_in_public` e `sensitive_columns_exposed`.
-- -----------------------------------------------------------------------------

ALTER TABLE IF EXISTS public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Family" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Wedding" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Location" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."TimelineItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Guest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Album" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Table" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."GiftOption" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."ProfessionalProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."ProfessionalService" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."EventAssignment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."ChapterSelectedGuest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."ChatMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Plan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."TravelDocument" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."SystemConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- Salvaguardia aggiuntiva: abilita RLS su eventuali tabelle residue create nello schema public
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
  END LOOP;
END $$;

-- -----------------------------------------------------------------------------
-- SEZIONE 3: HARDENING PRIVILEGI TABELLE E COLONNE (Defense-in-Depth per PostgREST)
-- Rimuove i permessi generici `ALL` concessi di default a `anon` e `authenticated`
-- e riassegna esclusivamente i privilegi minimi indispensabili, bloccando a livello
-- di colonna password, passwordHash, token, IBAN, credenziali SMTP e segreti Stripe.
-- -----------------------------------------------------------------------------

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;

-- Ruolo `service_role` mantiene accesso amministrativo completo lato server
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Ruolo `anon` (utenti non autenticati via PostgREST):
-- Accesso in sola lettura ESCLUSIVAMENTE alle colonne pubbliche non sensibili di vetrina/catalogo.
-- Nessun accesso diretto a User, Guest, SystemConfig, Subscription, Lead, Notification,
-- Conversation, ChatMessage, TravelDocument, Table, ChapterSelectedGuest, _prisma_migrations.

GRANT SELECT (
  id, category, "businessName", slug, description, "logoUrl", website,
  instagram, "coverImage", "profileImage", gallery, video1, video2,
  "serviceArea", "isActive", "createdAt", "updatedAt"
) ON public."ProfessionalProfile" TO anon;

GRANT SELECT (
  id, name, description, "priceIndicative", "order", "profileId", "createdAt", "updatedAt"
) ON public."ProfessionalService" TO anon;

GRANT SELECT (
  id, "authorRole", rating, text, "weddingId", "proId", "createdAt", "updatedAt"
) ON public."Review" TO anon;

GRANT SELECT (
  id, name, features, price, interval, "createdAt"
) ON public."Plan" TO anon;

-- Per Wedding pubblico: `passwordHash`, `ownerId`, `coupleId`, `professionalsJson` NON sono concessi ad `anon`!
GRANT SELECT (
  id, type, slug, "brideName", "groomName", date, title, description, "coverImage",
  "themeColor", "welcomeMessage", "isPublic", visibility, "externalGalleryUrl",
  "startTime", "endTime", "dressCode", "usefulInfo", "ceremonyType",
  "showGuestbook", "showSeating", "showGifts", "familyId", audience, "createdAt", "updatedAt"
) ON public."Wedding" TO anon;

GRANT SELECT (
  id, name, address, city, notes, coordinates, type, "weddingId"
) ON public."Location" TO anon;

GRANT SELECT (
  id, time, title, description, "weddingId", "order"
) ON public."TimelineItem" TO anon;

-- Per GiftOption: `iban` e `accountHolder` NON sono concessi ad `anon`!
GRANT SELECT (
  id, type, title, description, "paypalLink", "externalLink", "order", "isActive",
  "isTravelStage", "stageDate", location, "targetAmount", "raisedAmount", "weddingId",
  "createdAt", "updatedAt"
) ON public."GiftOption" TO anon;

GRANT SELECT (
  id, name, type, "weddingId", "createdAt", "updatedAt"
) ON public."Album" TO anon;

GRANT SELECT (
  id, thumbnail, type, "mimeType", status, "weddingId", "albumId",
  "uploaderName", "guestMessage", "createdAt", "updatedAt"
) ON public."Media" TO anon;

GRANT SELECT (
  id, text, "guestName", "weddingId", "createdAt", status
) ON public."Message" TO anon;

GRANT SELECT (
  id, role, "serviceId", status, "weddingId", "proId", "createdAt", "updatedAt"
) ON public."EventAssignment" TO anon;

-- Ruolo `authenticated` (utenti autenticati, sempre filtrati riga per riga dalle policy RLS):
-- Nota: `User.password` e `SystemConfig.smtpPass` restano INTERDETTI in lettura via PostgREST!
GRANT SELECT (id, email, name, role, "createdAt", "updatedAt") ON public."User" TO authenticated;
GRANT UPDATE (name, "updatedAt") ON public."User" TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."Family" TO authenticated;

GRANT SELECT (
  id, type, slug, "brideName", "groomName", date, title, description, "coverImage",
  "themeColor", "welcomeMessage", "isPublic", visibility, "requireApproval",
  "externalGalleryUrl", "startTime", "endTime", "dressCode", "usefulInfo",
  "ceremonyType", "professionalsJson", "showGuestbook", "showSeating", "showGifts",
  "createdAt", "updatedAt", "ownerId", "coupleId", "familyId", audience
) ON public."Wedding" TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public."Wedding" TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."Location" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."TimelineItem" TO authenticated;

-- Su Guest: `token` resta nascosto dalla SELECT diretta PostgREST per prevenire esfiltrazione token
GRANT SELECT (
  id, name, surname, email, phone, category, "dietaryNotes", "isAttending",
  "hasAccess", "rsvpReminder30Sent", "rsvpReminder10Sent", "weddingId", "tableId", "createdAt"
) ON public."Guest" TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public."Guest" TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."Message" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Album" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Media" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Table" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."GiftOption" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."ProfessionalProfile" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."ProfessionalService" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."EventAssignment" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."Review" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."ChapterSelectedGuest" TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public."Notification" TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public."Conversation" TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public."ChatMessage" TO authenticated;
GRANT SELECT (id, name, features, price, interval, "createdAt") ON public."Plan" TO authenticated;
GRANT SELECT (id, "userId", "planId", status, "currentPeriodEnd", "expiresAt", "createdAt", "updatedAt") ON public."Subscription" TO authenticated;
GRANT SELECT, DELETE ON public."Lead" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."TravelDocument" TO authenticated;
-- `SystemConfig` e `_prisma_migrations`: NESSUN grant a `anon` o `authenticated` (solo server/admin DB).

-- -----------------------------------------------------------------------------
-- SEZIONE 4: POLICY RLS GRANULARI (SELECT / INSERT / UPDATE / DELETE) PER OGNI TABELLA
-- Principio del minimo privilegio: nessuna policy generica `USING (true)` per authenticated.
-- -----------------------------------------------------------------------------

-- 1. Tabella: public."User" (Privata / Amministrativa)
DROP POLICY IF EXISTS "user_select_own_or_admin" ON public."User";
DROP POLICY IF EXISTS "user_insert_self_or_admin" ON public."User";
DROP POLICY IF EXISTS "user_update_own_or_admin" ON public."User";
DROP POLICY IF EXISTS "user_delete_admin_only" ON public."User";

CREATE POLICY "user_select_own_or_admin"
  ON public."User" FOR SELECT
  TO authenticated
  USING (id = public.current_app_user_id() OR public.is_admin());

CREATE POLICY "user_insert_self_or_admin"
  ON public."User" FOR INSERT
  TO authenticated
  WITH CHECK (
    (id = public.current_app_user_id() AND role IN ('COUPLE', 'PHOTOGRAPHER'))
    OR public.is_admin()
  );

CREATE POLICY "user_update_own_or_admin"
  ON public."User" FOR UPDATE
  TO authenticated
  USING (id = public.current_app_user_id() OR public.is_admin())
  WITH CHECK (
    (
      id = public.current_app_user_id()
      AND role = (SELECT u.role FROM public."User" u WHERE u.id = public.current_app_user_id())
    )
    OR public.is_admin()
  );

CREATE POLICY "user_delete_admin_only"
  ON public."User" FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 2. Tabella: public."Family" (Privata - proprietario della famiglia)
DROP POLICY IF EXISTS "family_select_owner_or_admin" ON public."Family";
DROP POLICY IF EXISTS "family_insert_owner_or_admin" ON public."Family";
DROP POLICY IF EXISTS "family_update_owner_or_admin" ON public."Family";
DROP POLICY IF EXISTS "family_delete_owner_or_admin" ON public."Family";

CREATE POLICY "family_select_owner_or_admin"
  ON public."Family" FOR SELECT
  TO authenticated
  USING ("ownerId" = public.current_app_user_id() OR public.is_admin());

CREATE POLICY "family_insert_owner_or_admin"
  ON public."Family" FOR INSERT
  TO authenticated
  WITH CHECK ("ownerId" = public.current_app_user_id() OR public.is_admin());

CREATE POLICY "family_update_owner_or_admin"
  ON public."Family" FOR UPDATE
  TO authenticated
  USING ("ownerId" = public.current_app_user_id() OR public.is_admin())
  WITH CHECK ("ownerId" = public.current_app_user_id() OR public.is_admin());

CREATE POLICY "family_delete_owner_or_admin"
  ON public."Family" FOR DELETE
  TO authenticated
  USING ("ownerId" = public.current_app_user_id() OR public.is_admin());

-- 3. Tabella: public."Wedding" (Prisma TimelineItem @@map("Wedding"))
DROP POLICY IF EXISTS "wedding_select_public_or_authorized" ON public."Wedding";
DROP POLICY IF EXISTS "wedding_insert_owner_or_admin" ON public."Wedding";
DROP POLICY IF EXISTS "wedding_update_owner_or_admin" ON public."Wedding";
DROP POLICY IF EXISTS "wedding_delete_owner_or_admin" ON public."Wedding";

CREATE POLICY "wedding_select_public_or_authorized"
  ON public."Wedding" FOR SELECT
  TO anon, authenticated
  USING (
    (visibility = 'PUBLIC' AND "passwordHash" IS NULL)
    OR public.owns_wedding(id)
    OR public.is_assigned_pro_for_wedding(id)
  );

CREATE POLICY "wedding_insert_owner_or_admin"
  ON public."Wedding" FOR INSERT
  TO authenticated
  WITH CHECK ("ownerId" = public.current_app_user_id() OR public.is_admin());

CREATE POLICY "wedding_update_owner_or_admin"
  ON public."Wedding" FOR UPDATE
  TO authenticated
  USING (public.owns_wedding(id))
  WITH CHECK (public.owns_wedding(id));

CREATE POLICY "wedding_delete_owner_or_admin"
  ON public."Wedding" FOR DELETE
  TO authenticated
  USING (public.owns_wedding(id));

-- 4. Tabella: public."Location"
DROP POLICY IF EXISTS "location_select_public_or_authorized" ON public."Location";
DROP POLICY IF EXISTS "location_insert_owner" ON public."Location";
DROP POLICY IF EXISTS "location_update_owner" ON public."Location";
DROP POLICY IF EXISTS "location_delete_owner" ON public."Location";

CREATE POLICY "location_select_public_or_authorized"
  ON public."Location" FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."Wedding" w
      WHERE w.id = "weddingId"
        AND w.visibility = 'PUBLIC'
        AND w."passwordHash" IS NULL
    )
    OR public.owns_wedding("weddingId")
    OR public.is_assigned_pro_for_wedding("weddingId")
  );

CREATE POLICY "location_insert_owner"
  ON public."Location" FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "location_update_owner"
  ON public."Location" FOR UPDATE
  TO authenticated
  USING (public.owns_wedding("weddingId"))
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "location_delete_owner"
  ON public."Location" FOR DELETE
  TO authenticated
  USING (public.owns_wedding("weddingId"));

-- 5. Tabella: public."TimelineItem" (Prisma ScheduleItem @@map("TimelineItem"))
DROP POLICY IF EXISTS "schedule_select_public_or_authorized" ON public."TimelineItem";
DROP POLICY IF EXISTS "schedule_insert_owner" ON public."TimelineItem";
DROP POLICY IF EXISTS "schedule_update_owner" ON public."TimelineItem";
DROP POLICY IF EXISTS "schedule_delete_owner" ON public."TimelineItem";

CREATE POLICY "schedule_select_public_or_authorized"
  ON public."TimelineItem" FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."Wedding" w
      WHERE w.id = "weddingId"
        AND w.visibility = 'PUBLIC'
        AND w."passwordHash" IS NULL
    )
    OR public.owns_wedding("weddingId")
    OR public.is_assigned_pro_for_wedding("weddingId")
  );

CREATE POLICY "schedule_insert_owner"
  ON public."TimelineItem" FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "schedule_update_owner"
  ON public."TimelineItem" FOR UPDATE
  TO authenticated
  USING (public.owns_wedding("weddingId"))
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "schedule_delete_owner"
  ON public."TimelineItem" FOR DELETE
  TO authenticated
  USING (public.owns_wedding("weddingId"));

-- 6. Tabella: public."Guest" (Strettamente Privata: email, phone, allergie, token RSVP)
DROP POLICY IF EXISTS "guest_select_wedding_owner" ON public."Guest";
DROP POLICY IF EXISTS "guest_insert_wedding_owner" ON public."Guest";
DROP POLICY IF EXISTS "guest_update_wedding_owner" ON public."Guest";
DROP POLICY IF EXISTS "guest_delete_wedding_owner" ON public."Guest";

CREATE POLICY "guest_select_wedding_owner"
  ON public."Guest" FOR SELECT
  TO authenticated
  USING (public.owns_wedding("weddingId"));

CREATE POLICY "guest_insert_wedding_owner"
  ON public."Guest" FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "guest_update_wedding_owner"
  ON public."Guest" FOR UPDATE
  TO authenticated
  USING (public.owns_wedding("weddingId"))
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "guest_delete_wedding_owner"
  ON public."Guest" FOR DELETE
  TO authenticated
  USING (public.owns_wedding("weddingId"));

-- 7. Tabella: public."Message" (Guestbook dediche)
DROP POLICY IF EXISTS "message_select_approved_or_owner" ON public."Message";
DROP POLICY IF EXISTS "message_insert_owner" ON public."Message";
DROP POLICY IF EXISTS "message_update_owner" ON public."Message";
DROP POLICY IF EXISTS "message_delete_owner" ON public."Message";

CREATE POLICY "message_select_approved_or_owner"
  ON public."Message" FOR SELECT
  TO anon, authenticated
  USING (
    (
      status = 'APPROVED'
      AND EXISTS (
        SELECT 1 FROM public."Wedding" w
        WHERE w.id = "weddingId"
          AND w.visibility = 'PUBLIC'
          AND w."passwordHash" IS NULL
          AND w."showGuestbook" = true
      )
    )
    OR public.owns_wedding("weddingId")
  );

CREATE POLICY "message_insert_owner"
  ON public."Message" FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "message_update_owner"
  ON public."Message" FOR UPDATE
  TO authenticated
  USING (public.owns_wedding("weddingId"))
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "message_delete_owner"
  ON public."Message" FOR DELETE
  TO authenticated
  USING (public.owns_wedding("weddingId"));

-- 8. Tabella: public."Album"
DROP POLICY IF EXISTS "album_select_public_or_owner" ON public."Album";
DROP POLICY IF EXISTS "album_insert_owner" ON public."Album";
DROP POLICY IF EXISTS "album_update_owner" ON public."Album";
DROP POLICY IF EXISTS "album_delete_owner" ON public."Album";

CREATE POLICY "album_select_public_or_owner"
  ON public."Album" FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."Wedding" w
      WHERE w.id = "weddingId"
        AND w.visibility = 'PUBLIC'
        AND w."passwordHash" IS NULL
    )
    OR public.owns_wedding("weddingId")
  );

CREATE POLICY "album_insert_owner"
  ON public."Album" FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "album_update_owner"
  ON public."Album" FOR UPDATE
  TO authenticated
  USING (public.owns_wedding("weddingId"))
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "album_delete_owner"
  ON public."Album" FOR DELETE
  TO authenticated
  USING (public.owns_wedding("weddingId"));

-- 9. Tabella: public."Media"
DROP POLICY IF EXISTS "media_select_approved_or_owner" ON public."Media";
DROP POLICY IF EXISTS "media_insert_owner" ON public."Media";
DROP POLICY IF EXISTS "media_update_owner" ON public."Media";
DROP POLICY IF EXISTS "media_delete_owner" ON public."Media";

CREATE POLICY "media_select_approved_or_owner"
  ON public."Media" FOR SELECT
  TO anon, authenticated
  USING (
    (
      status = 'APPROVED'
      AND EXISTS (
        SELECT 1 FROM public."Wedding" w
        WHERE w.id = "weddingId"
          AND w.visibility = 'PUBLIC'
          AND w."passwordHash" IS NULL
      )
    )
    OR public.owns_wedding("weddingId")
  );

CREATE POLICY "media_insert_owner"
  ON public."Media" FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "media_update_owner"
  ON public."Media" FOR UPDATE
  TO authenticated
  USING (public.owns_wedding("weddingId"))
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "media_delete_owner"
  ON public."Media" FOR DELETE
  TO authenticated
  USING (public.owns_wedding("weddingId"));

-- 10. Tabella: public."Table" (Gestione tavoli privata sposi/fotografo)
DROP POLICY IF EXISTS "table_select_owner" ON public."Table";
DROP POLICY IF EXISTS "table_insert_owner" ON public."Table";
DROP POLICY IF EXISTS "table_update_owner" ON public."Table";
DROP POLICY IF EXISTS "table_delete_owner" ON public."Table";

CREATE POLICY "table_select_owner"
  ON public."Table" FOR SELECT
  TO authenticated
  USING (public.owns_wedding("weddingId"));

CREATE POLICY "table_insert_owner"
  ON public."Table" FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "table_update_owner"
  ON public."Table" FOR UPDATE
  TO authenticated
  USING (public.owns_wedding("weddingId"))
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "table_delete_owner"
  ON public."Table" FOR DELETE
  TO authenticated
  USING (public.owns_wedding("weddingId"));

-- 11. Tabella: public."GiftOption" (PROBLEMA 1 SEGNALATO DA SUPABASE)
-- Nota: Le colonne sensibili `iban` e `accountHolder` sono revocate per `anon`!
DROP POLICY IF EXISTS "gift_option_select_public_safe_or_owner" ON public."GiftOption";
DROP POLICY IF EXISTS "gift_option_insert_owner" ON public."GiftOption";
DROP POLICY IF EXISTS "gift_option_update_owner" ON public."GiftOption";
DROP POLICY IF EXISTS "gift_option_delete_owner" ON public."GiftOption";

CREATE POLICY "gift_option_select_public_safe_or_owner"
  ON public."GiftOption" FOR SELECT
  TO anon, authenticated
  USING (
    (
      "isActive" = true
      AND EXISTS (
        SELECT 1 FROM public."Wedding" w
        WHERE w.id = "weddingId"
          AND w.visibility = 'PUBLIC'
          AND w."passwordHash" IS NULL
          AND w."showGifts" = true
      )
    )
    OR public.owns_wedding("weddingId")
  );

CREATE POLICY "gift_option_insert_owner"
  ON public."GiftOption" FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "gift_option_update_owner"
  ON public."GiftOption" FOR UPDATE
  TO authenticated
  USING (public.owns_wedding("weddingId"))
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "gift_option_delete_owner"
  ON public."GiftOption" FOR DELETE
  TO authenticated
  USING (public.owns_wedding("weddingId"));

-- 12. Tabella: public."ProfessionalProfile" (Vetrina pubblica se attivo; scrittura solo titolare)
DROP POLICY IF EXISTS "pro_profile_select_active_or_owner" ON public."ProfessionalProfile";
DROP POLICY IF EXISTS "pro_profile_insert_owner" ON public."ProfessionalProfile";
DROP POLICY IF EXISTS "pro_profile_update_owner" ON public."ProfessionalProfile";
DROP POLICY IF EXISTS "pro_profile_delete_owner" ON public."ProfessionalProfile";

CREATE POLICY "pro_profile_select_active_or_owner"
  ON public."ProfessionalProfile" FOR SELECT
  TO anon, authenticated
  USING (
    "isActive" = true
    OR "userId" = public.current_app_user_id()
    OR public.is_admin()
  );

CREATE POLICY "pro_profile_insert_owner"
  ON public."ProfessionalProfile" FOR INSERT
  TO authenticated
  WITH CHECK ("userId" = public.current_app_user_id() OR public.is_admin());

CREATE POLICY "pro_profile_update_owner"
  ON public."ProfessionalProfile" FOR UPDATE
  TO authenticated
  USING ("userId" = public.current_app_user_id() OR public.is_admin())
  WITH CHECK ("userId" = public.current_app_user_id() OR public.is_admin());

CREATE POLICY "pro_profile_delete_owner"
  ON public."ProfessionalProfile" FOR DELETE
  TO authenticated
  USING ("userId" = public.current_app_user_id() OR public.is_admin());

-- 13. Tabella: public."ProfessionalService" (PROBLEMA 2 SEGNALATO DA SUPABASE)
DROP POLICY IF EXISTS "pro_service_select_active_profile_or_owner" ON public."ProfessionalService";
DROP POLICY IF EXISTS "pro_service_insert_profile_owner" ON public."ProfessionalService";
DROP POLICY IF EXISTS "pro_service_update_profile_owner" ON public."ProfessionalService";
DROP POLICY IF EXISTS "pro_service_delete_profile_owner" ON public."ProfessionalService";

CREATE POLICY "pro_service_select_active_profile_or_owner"
  ON public."ProfessionalService" FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."ProfessionalProfile" pp
      WHERE pp.id = "profileId"
        AND (
          pp."isActive" = true
          OR pp."userId" = public.current_app_user_id()
        )
    )
    OR public.is_admin()
  );

CREATE POLICY "pro_service_insert_profile_owner"
  ON public."ProfessionalService" FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."ProfessionalProfile" pp
      WHERE pp.id = "profileId"
        AND pp."userId" = public.current_app_user_id()
    )
    OR public.is_admin()
  );

CREATE POLICY "pro_service_update_profile_owner"
  ON public."ProfessionalService" FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."ProfessionalProfile" pp
      WHERE pp.id = "profileId"
        AND pp."userId" = public.current_app_user_id()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."ProfessionalProfile" pp
      WHERE pp.id = "profileId"
        AND pp."userId" = public.current_app_user_id()
    )
    OR public.is_admin()
  );

CREATE POLICY "pro_service_delete_profile_owner"
  ON public."ProfessionalService" FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."ProfessionalProfile" pp
      WHERE pp.id = "profileId"
        AND pp."userId" = public.current_app_user_id()
    )
    OR public.is_admin()
  );

-- 14. Tabella: public."EventAssignment"
DROP POLICY IF EXISTS "assignment_select_authorized" ON public."EventAssignment";
DROP POLICY IF EXISTS "assignment_insert_wedding_owner" ON public."EventAssignment";
DROP POLICY IF EXISTS "assignment_update_wedding_owner" ON public."EventAssignment";
DROP POLICY IF EXISTS "assignment_delete_wedding_owner" ON public."EventAssignment";

CREATE POLICY "assignment_select_authorized"
  ON public."EventAssignment" FOR SELECT
  TO anon, authenticated
  USING (
    public.owns_wedding("weddingId")
    OR EXISTS (
      SELECT 1 FROM public."ProfessionalProfile" pp
      WHERE pp.id = "proId"
        AND pp."userId" = public.current_app_user_id()
    )
    OR (
      status = 'ACTIVE'
      AND EXISTS (
        SELECT 1 FROM public."Wedding" w
        WHERE w.id = "weddingId"
          AND w.visibility = 'PUBLIC'
          AND w."passwordHash" IS NULL
      )
    )
  );

CREATE POLICY "assignment_insert_wedding_owner"
  ON public."EventAssignment" FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "assignment_update_wedding_owner"
  ON public."EventAssignment" FOR UPDATE
  TO authenticated
  USING (public.owns_wedding("weddingId"))
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "assignment_delete_wedding_owner"
  ON public."EventAssignment" FOR DELETE
  TO authenticated
  USING (public.owns_wedding("weddingId"));

-- 15. Tabella: public."Review"
DROP POLICY IF EXISTS "review_select_public_or_authorized" ON public."Review";
DROP POLICY IF EXISTS "review_insert_author_owner" ON public."Review";
DROP POLICY IF EXISTS "review_update_author_or_admin" ON public."Review";
DROP POLICY IF EXISTS "review_delete_author_or_admin" ON public."Review";

CREATE POLICY "review_select_public_or_authorized"
  ON public."Review" FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."ProfessionalProfile" pp
      WHERE pp.id = "proId"
        AND (pp."isActive" = true OR pp."userId" = public.current_app_user_id())
    )
    OR "authorId" = public.current_app_user_id()
    OR public.owns_wedding("weddingId")
  );

CREATE POLICY "review_insert_author_owner"
  ON public."Review" FOR INSERT
  TO authenticated
  WITH CHECK (
    ("authorId" = public.current_app_user_id() AND public.owns_wedding("weddingId"))
    OR public.is_admin()
  );

CREATE POLICY "review_update_author_or_admin"
  ON public."Review" FOR UPDATE
  TO authenticated
  USING ("authorId" = public.current_app_user_id() OR public.is_admin())
  WITH CHECK ("authorId" = public.current_app_user_id() OR public.is_admin());

CREATE POLICY "review_delete_author_or_admin"
  ON public."Review" FOR DELETE
  TO authenticated
  USING ("authorId" = public.current_app_user_id() OR public.is_admin());

-- 16. Tabella: public."ChapterSelectedGuest" (Privata)
DROP POLICY IF EXISTS "chapter_selected_guest_select_owner" ON public."ChapterSelectedGuest";
DROP POLICY IF EXISTS "chapter_selected_guest_insert_owner" ON public."ChapterSelectedGuest";
DROP POLICY IF EXISTS "chapter_selected_guest_update_owner" ON public."ChapterSelectedGuest";
DROP POLICY IF EXISTS "chapter_selected_guest_delete_owner" ON public."ChapterSelectedGuest";

CREATE POLICY "chapter_selected_guest_select_owner"
  ON public."ChapterSelectedGuest" FOR SELECT
  TO authenticated
  USING (public.owns_wedding("chapterId"));

CREATE POLICY "chapter_selected_guest_insert_owner"
  ON public."ChapterSelectedGuest" FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_wedding("chapterId"));

CREATE POLICY "chapter_selected_guest_update_owner"
  ON public."ChapterSelectedGuest" FOR UPDATE
  TO authenticated
  USING (public.owns_wedding("chapterId"))
  WITH CHECK (public.owns_wedding("chapterId"));

CREATE POLICY "chapter_selected_guest_delete_owner"
  ON public."ChapterSelectedGuest" FOR DELETE
  TO authenticated
  USING (public.owns_wedding("chapterId"));

-- 17. Tabella: public."Notification" (Privata per singolo utente)
DROP POLICY IF EXISTS "notification_select_own" ON public."Notification";
DROP POLICY IF EXISTS "notification_insert_admin_only" ON public."Notification";
DROP POLICY IF EXISTS "notification_update_own" ON public."Notification";
DROP POLICY IF EXISTS "notification_delete_own" ON public."Notification";

CREATE POLICY "notification_select_own"
  ON public."Notification" FOR SELECT
  TO authenticated
  USING ("userId" = public.current_app_user_id() OR public.is_admin());

CREATE POLICY "notification_insert_admin_only"
  ON public."Notification" FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "notification_update_own"
  ON public."Notification" FOR UPDATE
  TO authenticated
  USING ("userId" = public.current_app_user_id() OR public.is_admin())
  WITH CHECK ("userId" = public.current_app_user_id() OR public.is_admin());

CREATE POLICY "notification_delete_own"
  ON public."Notification" FOR DELETE
  TO authenticated
  USING ("userId" = public.current_app_user_id() OR public.is_admin());

-- 18. Tabella: public."Conversation" (Privata tra sposi e professionista assegnato)
DROP POLICY IF EXISTS "conversation_select_participant" ON public."Conversation";
DROP POLICY IF EXISTS "conversation_insert_participant" ON public."Conversation";
DROP POLICY IF EXISTS "conversation_update_participant" ON public."Conversation";
DROP POLICY IF EXISTS "conversation_delete_admin" ON public."Conversation";

CREATE POLICY "conversation_select_participant"
  ON public."Conversation" FOR SELECT
  TO authenticated
  USING (
    public.owns_wedding("weddingId")
    OR EXISTS (
      SELECT 1 FROM public."ProfessionalProfile" pp
      WHERE pp.id = "proId"
        AND pp."userId" = public.current_app_user_id()
    )
  );

CREATE POLICY "conversation_insert_participant"
  ON public."Conversation" FOR INSERT
  TO authenticated
  WITH CHECK (
    (
      public.owns_wedding("weddingId")
      OR EXISTS (
        SELECT 1 FROM public."ProfessionalProfile" pp
        WHERE pp.id = "proId"
          AND pp."userId" = public.current_app_user_id()
      )
    )
    AND EXISTS (
      SELECT 1 FROM public."EventAssignment" ea
      WHERE ea."weddingId" = "Conversation"."weddingId"
        AND ea."proId" = "Conversation"."proId"
        AND ea.status = 'ACTIVE'
    )
  );

CREATE POLICY "conversation_update_participant"
  ON public."Conversation" FOR UPDATE
  TO authenticated
  USING (
    public.owns_wedding("weddingId")
    OR EXISTS (
      SELECT 1 FROM public."ProfessionalProfile" pp
      WHERE pp.id = "proId"
        AND pp."userId" = public.current_app_user_id()
    )
  )
  WITH CHECK (
    public.owns_wedding("weddingId")
    OR EXISTS (
      SELECT 1 FROM public."ProfessionalProfile" pp
      WHERE pp.id = "proId"
        AND pp."userId" = public.current_app_user_id()
    )
  );

CREATE POLICY "conversation_delete_admin"
  ON public."Conversation" FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 19. Tabella: public."ChatMessage" (Privata - messaggi interni conversazione)
DROP POLICY IF EXISTS "chat_message_select_participant" ON public."ChatMessage";
DROP POLICY IF EXISTS "chat_message_insert_sender" ON public."ChatMessage";
DROP POLICY IF EXISTS "chat_message_update_recipient_or_admin" ON public."ChatMessage";
DROP POLICY IF EXISTS "chat_message_delete_admin" ON public."ChatMessage";

CREATE POLICY "chat_message_select_participant"
  ON public."ChatMessage" FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."Conversation" c
      LEFT JOIN public."ProfessionalProfile" pp ON pp.id = c."proId"
      WHERE c.id = "conversationId"
        AND (
          public.owns_wedding(c."weddingId")
          OR pp."userId" = public.current_app_user_id()
        )
    )
  );

CREATE POLICY "chat_message_insert_sender"
  ON public."ChatMessage" FOR INSERT
  TO authenticated
  WITH CHECK (
    "senderId" = public.current_app_user_id()
    AND EXISTS (
      SELECT 1 FROM public."Conversation" c
      INNER JOIN public."EventAssignment" ea
        ON ea."weddingId" = c."weddingId" AND ea."proId" = c."proId"
      LEFT JOIN public."ProfessionalProfile" pp ON pp.id = c."proId"
      WHERE c.id = "conversationId"
        AND ea.status = 'ACTIVE'
        AND (
          public.owns_wedding(c."weddingId")
          OR pp."userId" = public.current_app_user_id()
        )
    )
  );

CREATE POLICY "chat_message_update_recipient_or_admin"
  ON public."ChatMessage" FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."Conversation" c
      LEFT JOIN public."ProfessionalProfile" pp ON pp.id = c."proId"
      WHERE c.id = "conversationId"
        AND (
          public.owns_wedding(c."weddingId")
          OR pp."userId" = public.current_app_user_id()
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."Conversation" c
      LEFT JOIN public."ProfessionalProfile" pp ON pp.id = c."proId"
      WHERE c.id = "conversationId"
        AND (
          public.owns_wedding(c."weddingId")
          OR pp."userId" = public.current_app_user_id()
        )
    )
  );

CREATE POLICY "chat_message_delete_admin"
  ON public."ChatMessage" FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 20. Tabella: public."Plan" (Catalogo Piani; esclude rigorosamente la riga segreta `__STRIPE_KEYS__`!)
DROP POLICY IF EXISTS "plan_select_public_catalog" ON public."Plan";
DROP POLICY IF EXISTS "plan_insert_admin_only" ON public."Plan";
DROP POLICY IF EXISTS "plan_update_admin_only" ON public."Plan";
DROP POLICY IF EXISTS "plan_delete_admin_only" ON public."Plan";

CREATE POLICY "plan_select_public_catalog"
  ON public."Plan" FOR SELECT
  TO anon, authenticated
  USING (
    name <> '__STRIPE_KEYS__'
    OR public.is_admin()
  );

CREATE POLICY "plan_insert_admin_only"
  ON public."Plan" FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "plan_update_admin_only"
  ON public."Plan" FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "plan_delete_admin_only"
  ON public."Plan" FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 21. Tabella: public."Subscription" (Privata - fatturazione utente)
DROP POLICY IF EXISTS "subscription_select_own_or_admin" ON public."Subscription";
DROP POLICY IF EXISTS "subscription_insert_admin_only" ON public."Subscription";
DROP POLICY IF EXISTS "subscription_update_admin_only" ON public."Subscription";
DROP POLICY IF EXISTS "subscription_delete_admin_only" ON public."Subscription";

CREATE POLICY "subscription_select_own_or_admin"
  ON public."Subscription" FOR SELECT
  TO authenticated
  USING ("userId" = public.current_app_user_id() OR public.is_admin());

CREATE POLICY "subscription_insert_admin_only"
  ON public."Subscription" FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "subscription_update_admin_only"
  ON public."Subscription" FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "subscription_delete_admin_only"
  ON public."Subscription" FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 22. Tabella: public."Lead" (Amministrativa - contatti commerciali)
DROP POLICY IF EXISTS "lead_select_admin_only" ON public."Lead";
DROP POLICY IF EXISTS "lead_insert_admin_only" ON public."Lead";
DROP POLICY IF EXISTS "lead_update_admin_only" ON public."Lead";
DROP POLICY IF EXISTS "lead_delete_admin_only" ON public."Lead";

CREATE POLICY "lead_select_admin_only"
  ON public."Lead" FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "lead_insert_admin_only"
  ON public."Lead" FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "lead_update_admin_only"
  ON public."Lead" FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "lead_delete_admin_only"
  ON public."Lead" FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 23. Tabella: public."TravelDocument" (Privata - biglietti/voucher viaggio di nozze)
DROP POLICY IF EXISTS "travel_doc_select_authorized" ON public."TravelDocument";
DROP POLICY IF EXISTS "travel_doc_insert_authorized" ON public."TravelDocument";
DROP POLICY IF EXISTS "travel_doc_update_owner" ON public."TravelDocument";
DROP POLICY IF EXISTS "travel_doc_delete_authorized" ON public."TravelDocument";

CREATE POLICY "travel_doc_select_authorized"
  ON public."TravelDocument" FOR SELECT
  TO authenticated
  USING (
    public.owns_wedding("weddingId")
    OR public.is_assigned_pro_for_wedding("weddingId")
  );

CREATE POLICY "travel_doc_insert_authorized"
  ON public."TravelDocument" FOR INSERT
  TO authenticated
  WITH CHECK (
    public.owns_wedding("weddingId")
    OR public.is_assigned_pro_for_wedding("weddingId")
  );

CREATE POLICY "travel_doc_update_owner"
  ON public."TravelDocument" FOR UPDATE
  TO authenticated
  USING (public.owns_wedding("weddingId"))
  WITH CHECK (public.owns_wedding("weddingId"));

CREATE POLICY "travel_doc_delete_authorized"
  ON public."TravelDocument" FOR DELETE
  TO authenticated
  USING (
    public.owns_wedding("weddingId")
    OR public.is_assigned_pro_for_wedding("weddingId")
  );

-- 24. Tabella: public."SystemConfig" (Strettamente Amministrativa - credenziali SMTP)
DROP POLICY IF EXISTS "system_config_select_admin_only" ON public."SystemConfig";
DROP POLICY IF EXISTS "system_config_insert_admin_only" ON public."SystemConfig";
DROP POLICY IF EXISTS "system_config_update_admin_only" ON public."SystemConfig";
DROP POLICY IF EXISTS "system_config_delete_admin_only" ON public."SystemConfig";

CREATE POLICY "system_config_select_admin_only"
  ON public."SystemConfig" FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "system_config_insert_admin_only"
  ON public."SystemConfig" FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "system_config_update_admin_only"
  ON public."SystemConfig" FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "system_config_delete_admin_only"
  ON public."SystemConfig" FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 25 (Opzionale se presente). Tabella: public."_prisma_migrations"
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = '_prisma_migrations'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "prisma_migrations_deny_all" ON public."_prisma_migrations";';
    EXECUTE 'CREATE POLICY "prisma_migrations_deny_all" ON public."_prisma_migrations" FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);';
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- SEZIONE 5: VISTE PUBBLICHE SICURE (`security_invoker = true`)
-- Espongono unicamente le colonne pubbliche strettamente necessarie senza mai
-- esporre password, hash, IBAN, intestatari conto, token o recapiti bloccati.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.public_professional_profiles_view
WITH (security_invoker = true)
AS
SELECT
  pp.id,
  pp.category,
  pp."businessName",
  pp.slug,
  pp.description,
  pp."logoUrl",
  pp.website,
  pp.instagram,
  pp."coverImage",
  pp."profileImage",
  pp.gallery,
  pp.video1,
  pp.video2,
  pp."serviceArea",
  pp."createdAt"
FROM public."ProfessionalProfile" pp
WHERE pp."isActive" = true;

CREATE OR REPLACE VIEW public.public_professional_services_view
WITH (security_invoker = true)
AS
SELECT
  ps.id,
  ps.name,
  ps.description,
  ps."priceIndicative",
  ps."order",
  ps."profileId"
FROM public."ProfessionalService" ps
INNER JOIN public."ProfessionalProfile" pp
  ON pp.id = ps."profileId"
WHERE pp."isActive" = true;

CREATE OR REPLACE VIEW public.public_weddings_view
WITH (security_invoker = true)
AS
SELECT
  w.id,
  w.type,
  w.slug,
  w."brideName",
  w."groomName",
  w.date,
  w.title,
  w.description,
  w."coverImage",
  w."themeColor",
  w."welcomeMessage",
  w."externalGalleryUrl",
  w."startTime",
  w."endTime",
  w."dressCode",
  w."usefulInfo",
  w."ceremonyType",
  w."showGuestbook",
  w."showSeating",
  w."showGifts"
FROM public."Wedding" w
WHERE w.visibility = 'PUBLIC'
  AND w."passwordHash" IS NULL;

CREATE OR REPLACE VIEW public.public_gift_options_view
WITH (security_invoker = true)
AS
SELECT
  go.id,
  go.type,
  go.title,
  go.description,
  go."paypalLink",
  go."externalLink",
  go."order",
  go."isTravelStage",
  go."stageDate",
  go.location,
  go."targetAmount",
  go."raisedAmount",
  go."weddingId"
FROM public."GiftOption" go
INNER JOIN public."Wedding" w
  ON w.id = go."weddingId"
WHERE go."isActive" = true
  AND w.visibility = 'PUBLIC'
  AND w."passwordHash" IS NULL
  AND w."showGifts" = true;

GRANT SELECT ON public.public_professional_profiles_view TO anon, authenticated, service_role;
GRANT SELECT ON public.public_professional_services_view TO anon, authenticated, service_role;
GRANT SELECT ON public.public_weddings_view TO anon, authenticated, service_role;
GRANT SELECT ON public.public_gift_options_view TO anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- SEZIONE 6: SICUREZZA SUPABASE STORAGE (Bucket `wedding-media`)
-- Mantiene privato il bucket `wedding-media` (l'app genera Signed URL lato server
-- con `SUPABASE_SERVICE_ROLE_KEY` dopo aver verificato `verifyTimelineAccess`).
-- -----------------------------------------------------------------------------

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'storage' AND table_name = 'buckets'
  ) THEN
    UPDATE storage.buckets
    SET public = false
    WHERE id = 'wedding-media';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'storage' AND table_name = 'objects'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "wedding_media_owner_select" ON storage.objects;';
    EXECUTE 'DROP POLICY IF EXISTS "wedding_media_owner_insert" ON storage.objects;';
    EXECUTE 'DROP POLICY IF EXISTS "wedding_media_owner_delete" ON storage.objects;';

    EXECUTE $pol1$
      CREATE POLICY "wedding_media_owner_select"
        ON storage.objects FOR SELECT
        TO authenticated
        USING (
          bucket_id = 'wedding-media'
          AND (
            public.is_admin()
            OR public.owns_wedding((storage.foldername(name))[2])
          )
        );
    $pol1$;

    EXECUTE $pol2$
      CREATE POLICY "wedding_media_owner_insert"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (
          bucket_id = 'wedding-media'
          AND (
            public.is_admin()
            OR public.owns_wedding((storage.foldername(name))[2])
          )
        );
    $pol2$;

    EXECUTE $pol3$
      CREATE POLICY "wedding_media_owner_delete"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (
          bucket_id = 'wedding-media'
          AND (
            public.is_admin()
            OR public.owns_wedding((storage.foldername(name))[2])
          )
        );
    $pol3$;
  END IF;
END $$;

COMMIT;
