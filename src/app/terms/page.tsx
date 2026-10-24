import Link from "next/link";
import { Scale, ShieldAlert, FileCheck, ArrowLeft, Heart } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Termini e Condizioni d'Uso | GentiLuna",
  description: "Condizioni Generali di Contratto, Regolamento d'Uso, Copyright e Limitazione di Responsabilità della piattaforma GentiLuna (gentiluna.com).",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] flex flex-col font-sans text-stone-800">
      {/* Top Navbar */}
      <nav className="bg-stone-950 text-white px-6 py-5 border-b border-stone-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-serif text-white">
            <Heart className="w-6 h-6 text-rose-500" />
            GentiLuna
          </Link>
          <Link href="/" className="text-sm text-stone-300 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Torna alla Home
          </Link>
        </div>
      </nav>

      <main className="flex-grow py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-14 rounded-3xl shadow-sm border border-stone-200">
          <div className="border-b border-stone-200 pb-8 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest mb-4">
              <Scale className="w-4 h-4" /> Condizioni Generali d&apos;Uso e Contratto
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-stone-900 mb-3">
              Termini e Condizioni di Servizio
            </h1>
            <p className="text-stone-500 text-sm">
              Regolamento contrattuale per l&apos;accesso e l&apos;utilizzo della piattaforma <strong>GentiLuna</strong> (<strong>gentiluna.com</strong>), di titolarità di <strong>TopWebsite.it di Giuseppe Urgeghe</strong>.
            </p>
            <p className="text-stone-400 text-xs mt-2">
              <strong>Ultimo aggiornamento:</strong> 24 Ottobre 2026
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 mb-10 text-sm text-rose-950">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base mb-1">Avviso Importante su Proprietà dei Contenuti e Responsabilità</p>
                <p className="leading-relaxed">
                  La navigazione, la registrazione, la conferma di partecipazione (RSVP) o il caricamento di qualsiasi file, fotografia, video, brano audio o testo su <strong>GentiLuna</strong> comportano l&apos;accettazione integrale e incondizionata dei presenti Termini e Condizioni e della <Link href="/privacy" className="underline font-semibold">Privacy Policy</Link>. Chiunque carichi contenuti dichiara e garantisce sotto la propria esclusiva responsabilità civile e penale di esserne il legittimo proprietario o di disporre delle relative licenze e liberatorie, manlevando integralmente il Titolare della piattaforma.
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-stone max-w-none space-y-8 text-stone-700 leading-relaxed">
            {/* 1. IDENTIFICAZIONE DEL FORNITORE */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">1. Titolare della Piattaforma</h2>
              <p>
                La piattaforma web <strong>GentiLuna</strong> (accessibile all&apos;indirizzo <a href="https://gentiluna.com" className="text-rose-600 underline">https://gentiluna.com</a>) è di proprietà ed è gestita da:
              </p>
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 text-sm space-y-1.5 mt-3">
                <p><strong>Impresa Titolare:</strong> TopWebsite.it di Giuseppe Urgeghe (Impresa Individuale Urgeghe Giuseppe)</p>
                <p><strong>Sede Legale:</strong> Zona Industriale Predda Niedda, Strada 3 – 07100 Sassari (SS), Italia</p>
                <p><strong>Partita IVA:</strong> 02656280902 – <strong>REA:</strong> SS - 203474</p>
                <p><strong>PEC:</strong> <a href="mailto:giuseppe.topwebsite@pec.it" className="text-rose-600 underline">giuseppe.topwebsite@pec.it</a></p>
                <p><strong>Email Supporto e Segnalazioni Legali:</strong> <a href="mailto:web@topwebsite.it" className="text-rose-600 underline">web@topwebsite.it</a> / <a href="mailto:info@gentiluna.com" className="text-rose-600 underline">info@gentiluna.com</a></p>
              </div>
            </section>

            {/* 2. OGGETTO DEL SERVIZIO */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">2. Oggetto del Servizio</h2>
              <p>
                <strong>GentiLuna</strong> fornisce un&apos;infrastruttura tecnologica in cloud (Software-as-a-Service) che consente:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Alle Coppie e alle Famiglie (&ldquo;Sposi&rdquo;):</strong> di creare uno spazio digitale dedicato al proprio matrimonio e ai capitoli della propria vita, raccogliere foto e video dagli invitati tramite QR Code, gestire conferme di presenza (RSVP), allergie/intolleranze, disposizione dei tavoli, dediche e liste regalo.</li>
                <li><strong>Agli Invitati (&ldquo;Ospiti&rdquo;):</strong> di visualizzare le informazioni dell&apos;evento, confermare la propria partecipazione e caricare fotografie, video e messaggi di auguri per gli Sposi.</li>
                <li><strong>Ai Professionisti del Settore (&ldquo;Professionisti / Fornitori&rdquo;):</strong> di pubblicare una vetrina promozionale nella directory, caricare il proprio portfolio, consegnare gallerie fotografiche agli sposi e ricevere richieste di contatto o recensioni.</li>
              </ul>
            </section>

            {/* 3. PROPRIETÀ DEI FILE, LICENZE D'USO E RESPONSABILITÀ ESCLUSIVA DELL'UTENTE */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">
                3. Proprietà dei Contenuti Caricati, Licenze Obbligatorie e Responsabilità Esclusiva dell&apos;Utente
              </h2>
              <p>
                Tutti i file, le fotografie, le immagini, i video, le tracce musicali/audio (MP3), i loghi, i documenti PDF, le recensioni e i testi (di seguito <strong>&ldquo;Contenuti&rdquo;</strong>) caricati sulla piattaforma restano di proprietà dei rispettivi autori o titolari, ma sono soggetti alle seguenti condizioni inderogabili:
              </p>
              <ul className="list-disc pl-6 space-y-2.5 mt-3">
                <li>
                  <strong>Garanzia di Titolarità e Licenza:</strong> L&apos;Utente (sia esso Sposo, Invitato, Professionista o semplice visitatore) che carica qualsiasi Contenuto su <strong>GentiLuna</strong> dichiara e garantisce espressamente di esserne l&apos;unico e legittimo autore/proprietario, oppure di possedere idonea licenza d&apos;uso, autorizzazione scritta dei titolari del diritto d&apos;autore (copyright, SIAE, diritti connessi per brani musicali e fotografie professionali) e piena facoltà legale di riprodurlo e condividerlo online.
                </li>
                <li>
                  <strong>Consenso delle Persone Ritratte e Tutela dei Minori:</strong> L&apos;Utente che carica fotografie o video ritraenti persone fisiche garantisce sotto la propria esclusiva responsabilità di aver acquisito il consenso degli interessati alla pubblicazione all&apos;interno dello spazio evento (e, nel caso di minori di età, il consenso di entrambi i genitori o esercenti la responsabilità genitoriale ai sensi dell&apos;Art. 96 Legge 633/1941 e del GDPR).
                </li>
                <li>
                  <strong>Divieto di Contenuti Illeciti:</strong> È severamente vietato caricare materiale coperto da copyright altrui senza licenza, materiale diffamatorio, osceno, pornografico, blasfemo, discriminatorio, violento, lesivo della dignità altrui o contrario a norme imperative di legge e all&apos;ordine pubblico.
                </li>
                <li>
                  <strong>Responsabilità Penale e Civile Esclusiva:</strong> Ogni Utente risponde in proprio, sia civilmente che penalmente, per qualsiasi file, testo, immagine, audio o video da lui caricato o condiviso tramite la piattaforma.
                </li>
              </ul>
            </section>

            {/* 4. CLAUSOLA DI MANLEVA TOTALE */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">
                4. Clausola di Manleva Totale e Indennizzo a favore del Titolare
              </h2>
              <p>
                Accettando i presenti Termini, l&apos;Utente si impegna a <strong>manlevare, difendere e tenere integralmente indenne TopWebsite.it di Giuseppe Urgeghe</strong> (nonché i suoi collaboratori e fornitori tecnici) da qualsiasi reclamo, diffida, contestazione, richiesta di risarcimento danni (patrimoniali e non patrimoniali), sanzione amministrativa o pecuniaria, onere o spesa legale (incluse le spese di difesa tecnica e processuale) avanzata da terzi, da altri utenti, da invitati, da professionisti, da enti di gestione collettiva dei diritti (es. SIAE, SCF) o da Autorità pubbliche in conseguenza di:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 mt-2">
                <li>caricamento di foto, video, brani musicali, testi o documenti privi delle necessarie licenze o diritti d&apos;autore;</li>
                <li>violazione della privacy o del diritto all&apos;immagine di persone ritratte nelle foto/video caricati;</li>
                <li>pubblicazione di recensioni mendaci, diffamatorie o lesive della reputazione di professionisti o terzi;</li>
                <li>qualsiasi uso improprio o illecito della piattaforma da parte dell&apos;Utente o dei suoi invitati.</li>
              </ul>
            </section>

            {/* 5. RUOLO DI HOSTING PROVIDER PASSIVO E RIMOZIONE CONTENUTI */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">
                5. Ruolo di Hosting Provider Passivo (D.Lgs. 70/2003 e Reg. UE 2022/2065 - DSA)
              </h2>
              <p>
                <strong>TopWebsite.it di Giuseppe Urgeghe</strong> opera esclusivamente quale fornitore tecnico di servizi della società dell&apos;informazione (hosting provider passivo ai sensi dell&apos;Art. 16 del D.Lgs. 70/2003 e del Regolamento UE 2022/2065 &ldquo;Digital Services Act&rdquo;). Il Titolare non è soggetto a un obbligo generale di sorveglianza preventiva sui Contenuti caricati dagli utenti né a un obbligo generale di ricercare attivamente fatti o circostanze che indichino la presenza di attività illecite.
              </p>
              <p className="mt-3">
                <strong>Procedura di Segnalazione e Rimozione (Notice &amp; Takedown):</strong> Qualora il Titolare riceva una segnalazione circostanziata circa la presunta illiceità o violazione di copyright/privacy di un Contenuto (inviata a <a href="mailto:web@topwebsite.it" className="text-rose-600 underline">web@topwebsite.it</a> o <a href="mailto:giuseppe.topwebsite@pec.it" className="text-rose-600 underline">giuseppe.topwebsite@pec.it</a>), si riserva il diritto insindacabile di rimuovere o disabilitare l&apos;accesso al Contenuto stesso con effetto immediato e senza preavviso, nonché di sospendere o chiudere l&apos;account responsabile senza alcun obbligo di rimborso.
              </p>
            </section>

            {/* 6. ESTRANEITÀ AI RAPPORTI TRA UTENTI, LISTE REGALO E ALLERGIE RSVP */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">
                6. Esclusione di Responsabilità per Rapporti tra Utenti, Liste Regalo e Dati RSVP
              </h2>
              <ul className="list-disc pl-6 space-y-2.5">
                <li>
                  <strong>Contratti tra Sposi e Professionisti:</strong> GentiLuna non è parte di alcun contratto, incarico professionale, preventivo o accordo economico stipulato tra le Coppie e i Professionisti presenti sul portale. TopWebsite.it di Giuseppe Urgeghe non garantisce l&apos;esecuzione, la qualità o la puntualità delle prestazioni dei Professionisti e declina ogni responsabilità per eventuali inadempimenti, ritardi, cancellazioni o controversie tra le parti.
                </li>
                <li>
                  <strong>Liste Regalo e Coordinate IBAN:</strong> La funzionalità &ldquo;Lista Regalo / Viaggio di Nozze&rdquo; si limita a mostrare in forma testuale le coordinate bancarie (IBAN) indicate autonomamente dagli Sposi. GentiLuna non incassa, non intermedia e non trattiene alcuna somma destinata ai regali degli sposi e non è responsabile della correttezza dell&apos;IBAN inserito o dell&apos;effettivo utilizzo delle somme donate dagli invitati.
                </li>
                <li>
                  <strong>Segnalazione Allergie e Intolleranze Alimentari (RSVP):</strong> Lo strumento di raccolta delle note alimentari e allergie degli invitati ha natura puramente ausiliaria e organizzativa. <strong>TopWebsite.it di Giuseppe Urgeghe declina ogni responsabilità per errori di trascrizione, mancata ricezione o mancata presa visione delle allergie da parte degli Sposi, dei Wedding Planner o del servizio di Catering/Ristorazione.</strong> Gli invitati affetti da allergie o patologie alimentari (in particolare allergie gravi o a rischio anafilassi) sono sempre tenuti a verificare personalmente gli ingredienti con il personale di sala e di cucina durante l&apos;evento.
                </li>
              </ul>
            </section>

            {/* 7. PIANI DI ABBONAMENTO, LIMITI E DISPONIBILITÀ DEL SERVIZIO */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">
                7. Piani, Pagamenti e Limitazione di Responsabilità Tecnica
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Erogazione &ldquo;Così com&apos;è&rdquo; (As-Is):</strong> Il servizio viene fornito con i massimi standard di sicurezza e continuità, ma non è garantita l&apos;assenza assoluta di interruzioni dovute a manutenzioni programmate, guasti di rete internet, disservizi dei data center terzi o cause di forza maggiore.
                </li>
                <li>
                  <strong>Onere di Backup Personale:</strong> Pur adottando sistemi di archiviazione cloud ridondati, si raccomanda vivamente agli Sposi e ai Professionisti di conservare sempre una copia di backup locale delle proprie fotografie e video originali. Nei limiti massimi consentiti dalla legge, l&apos;eventuale responsabilità complessiva del Titolare per qualsiasi danno diretto non potrà in nessun caso eccedere l&apos;importo effettivamente corrisposto dall&apos;Utente per il servizio nei 12 mesi precedenti l&apos;evento dannoso.
                </li>
              </ul>
            </section>

            {/* 8. LEGGE APPLICABILE E FORO COMPETENTE */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">
                8. Legge Applicabile e Foro Competente
              </h2>
              <p>
                I presenti Termini e Condizioni sono regolati dalla legge italiana. Per qualsiasi controversia inerente alla validità, interpretazione, esecuzione o risoluzione dei presenti Termini:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 mt-2">
                <li>qualora l&apos;Utente agisca in qualità di Professionista o Impresa (B2B), sarà competente in via esclusiva il <strong>Foro di Sassari</strong>;</li>
                <li>qualora l&apos;Utente agisca in qualità di Consumatore ai sensi del D.Lgs. 206/2005 (Codice del Consumo), sarà competente il Foro del luogo di residenza o domicilio del Consumatore, se ubicato nel territorio dello Stato italiano.</li>
              </ul>
              <p className="mt-4 text-sm text-stone-600">
                Ai sensi degli Artt. 1341 e 1342 del Codice Civile, l&apos;Utente dichiara di aver letto e di approvare specificamente le clausole di cui agli Articoli: <strong>3 (Proprietà dei contenuti e responsabilità esclusiva dell&apos;Utente)</strong>, <strong>4 (Clausola di manleva totale e indennizzo)</strong>, <strong>5 (Rimozione contenuti e sospensione account)</strong>, <strong>6 (Esclusione di responsabilità per rapporti tra utenti, liste regalo e allergie alimentari)</strong>, <strong>7 (Limitazione di responsabilità tecnica)</strong> e <strong>8 (Foro esclusivo di Sassari per rapporti tra professionisti)</strong>.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-stone-500">
            <Link href="/" className="hover:text-stone-900 font-medium flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Torna alla Home di GentiLuna
            </Link>
            <Link href="/privacy" className="text-rose-600 hover:underline font-semibold flex items-center gap-1">
              <FileCheck className="w-4 h-4" /> Consulta l&apos;Informativa sulla Privacy e Cookie Policy →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
