import Link from "next/link";
import { Shield, Lock, FileText, ArrowLeft, Heart } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy & Cookie Policy | GentiLuna",
  description: "Informativa sul trattamento dei dati personali e Cookie Policy di GentiLuna (gentiluna.com) ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679 (GDPR).",
};

export default function PrivacyPolicyPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest mb-4">
              <Shield className="w-4 h-4" /> GDPR UE 2016/679
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-stone-900 mb-3">
              Informativa sulla Privacy e Cookie Policy
            </h1>
            <p className="text-stone-500 text-sm">
              Ai sensi degli Artt. 13 e 14 del Regolamento (UE) 2016/679 (&ldquo;GDPR&rdquo;) e del D.Lgs. 196/2003 (così come modificato dal D.Lgs. 101/2018) per la piattaforma <strong>GentiLuna</strong> (<strong>gentiluna.com</strong>).
            </p>
            <p className="text-stone-400 text-xs mt-2">
              <strong>Ultimo aggiornamento:</strong> 24 Ottobre 2026
            </p>
          </div>

          <div className="prose prose-stone max-w-none space-y-8 text-stone-700 leading-relaxed">
            {/* 1. TITOLARE DEL TRATTAMENTO */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">1. Titolare del Trattamento dei Dati</h2>
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 text-sm space-y-1.5">
                <p><strong>Denominazione / Titolare:</strong> TopWebsite.it di Giuseppe Urgeghe (Impresa Individuale Urgeghe Giuseppe)</p>
                <p><strong>Piattaforma gestita:</strong> GentiLuna (<a href="https://gentiluna.com" className="text-rose-600 underline">https://gentiluna.com</a>)</p>
                <p><strong>Sede Legale:</strong> Zona Industriale Predda Niedda, Strada 3 – 07100 Sassari (SS), Italia</p>
                <p><strong>Partita IVA:</strong> 02656280902 – <strong>REA:</strong> SS - 203474</p>
                <p><strong>PEC:</strong> <a href="mailto:giuseppe.topwebsite@pec.it" className="text-rose-600 underline">giuseppe.topwebsite@pec.it</a></p>
                <p><strong>Email Contatto Privacy e Supporto:</strong> <a href="mailto:web@topwebsite.it" className="text-rose-600 underline">web@topwebsite.it</a> / <a href="mailto:info@gentiluna.com" className="text-rose-600 underline">info@gentiluna.com</a></p>
              </div>
            </section>

            {/* 2. RUOLO DELLE PARTI */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">2. Qualificazione Soggettiva nel Trattamento dei Dati</h2>
              <p>
                Ai fini della normativa sulla protezione dei dati personali, il ruolo di <strong>TopWebsite.it di Giuseppe Urgeghe</strong> varia in funzione della tipologia di dato trattato:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Titolare Autonomo del Trattamento:</strong> per i dati di registrazione, fatturazione, gestione account e richieste commerciali degli utenti registrati (Sposi, Famiglie e Professionisti), nonché per i dati di navigazione e sicurezza tecnica del sito <strong>gentiluna.com</strong>.
                </li>
                <li>
                  <strong>Fornitore Tecnico di Spazio Hosting / Responsabile del Trattamento (ex Art. 28 GDPR):</strong> in relazione ai dati degli invitati (nomi, email, tavoli, allergie), alle fotografie, ai video, agli audio e ai testi caricati dagli Sposi, dagli Invitati o dai Professionisti all&apos;interno dei singoli spazi evento. Gli Sposi e/o i Professionisti che creano un evento e caricano dati di terzi agiscono sotto la propria esclusiva responsabilità quali Titolari del trattamento (o nell&apos;ambito di attività strettamente personale e domestica ai sensi dell&apos;Art. 2, par. 2, lett. c del GDPR), garantendo di aver raccolto ogni necessario consenso dagli interessati.
                </li>
              </ul>
            </section>

            {/* 3. TIPOLOGIE DI DATI RACCOLTI */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">3. Categorie di Dati Personali Trattati</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Dati Anagrafici, di Contatto e Account:</strong> nome, cognome, ragione sociale, indirizzo email, recapito telefonico, città/provincia, credenziali di accesso criptate.
                </li>
                <li>
                  <strong>Dati degli Eventi e Capitoli:</strong> date, luoghi, programma cerimonia, liste regalo e coordinate IBAN inserite volontariamente dagli Sposi per ricevere liberalità dagli invitati.
                </li>
                <li>
                  <strong>Dati degli Invitati e Categorie Particolari di Dati (Art. 9 GDPR):</strong> nome, cognome, indirizzo email per l&apos;invio di promemoria RSVP e, ove conferito volontariamente dall&apos;invitato o dagli sposi, indicazioni relative ad <strong>allergie, intolleranze o regimi alimentari</strong>. Tali dati sono trattati esclusivamente previo consenso esplicito (Art. 9, par. 2, lett. a GDPR) al solo scopo di consentire agli Sposi di organizzare il ricevimento.
                </li>
                <li>
                  <strong>Contenuti Multimediali Generati dagli Utenti (UGC):</strong> fotografie, video, brani musicali (MP3), recensioni, dediche e documenti di viaggio caricati da Sposi, Invitati o Professionisti.
                </li>
                <li>
                  <strong>Dati di Pagamento:</strong> i pagamenti degli abbonamenti sulla piattaforma sono gestiti interamente tramite il circuito certificato PCI-DSS <strong>Stripe</strong>. Il Titolare non memorizza né ha accesso ai numeri completi delle carte di credito.
                </li>
                <li>
                  <strong>Dati di Navigazione e Log di Sicurezza:</strong> indirizzi IP, orari di accesso, user-agent del browser e log tecnici necessari a prevenire abusi, attacchi informatici e accessi non autorizzati.
                </li>
              </ul>
            </section>

            {/* 4. FINALITÀ E BASE GIURIDICA */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">4. Finalità e Base Giuridica del Trattamento</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Erogazione del servizio contrattuale (Art. 6, par. 1, lett. b GDPR):</strong> creazione e gestione degli spazi digitali GentiLuna, condivisione gallerie foto/video, gestione tavoli, pubblicazione vetrine professionisti e riscontro a richieste di preventivo o contatto.
                </li>
                <li>
                  <strong>Consenso esplicito dell&apos;Interessato (Art. 6, par. 1, lett. a e Art. 9, par. 2, lett. a GDPR):</strong> raccolta e visualizzazione delle informazioni su allergie/intolleranze alimentari nel modulo RSVP; pubblicazione volontaria di foto, video, dediche e recensioni da parte degli utenti.
                </li>
                <li>
                  <strong>Adempimento di obblighi di legge (Art. 6, par. 1, lett. c GDPR):</strong> adempimenti contabili, fiscali, amministrativi e risposta a richieste dell&apos;Autorità Giudiziaria.
                </li>
                <li>
                  <strong>Legittimo interesse del Titolare (Art. 6, par. 1, lett. f GDPR):</strong> sicurezza informatica della piattaforma, prevenzione frodi e tutela dei diritti del Titolare in sede giudiziaria o stragiudiziale.
                </li>
              </ul>
            </section>

            {/* 5. RESPONSABILITÀ SUI CONTENUTI CARICATI */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">5. Immagini, Foto, Video e Contenuti di Terzi</h2>
              <p>
                Qualsiasi utente (Sposo, Invitato o Professionista) che carichi fotografie, video, brani audio o testi su <strong>GentiLuna</strong> dichiara e garantisce di aver preventivamente informato le persone ritratte o menzionate e di averne ottenuto il consenso alla pubblicazione nello spazio dell&apos;evento (con particolare riguardo alla tutela dei minori), esonerando <strong>TopWebsite.it di Giuseppe Urgeghe</strong> da qualsiasi responsabilità per violazione della privacy o del diritto all&apos;immagine di terzi. Chiunque si riconosca in una fotografia o contenuto pubblicato senza il proprio consenso può richiederne l&apos;immediata rimozione scrivendo a <a href="mailto:web@topwebsite.it" className="text-rose-600 underline">web@topwebsite.it</a>.
              </p>
            </section>

            {/* 6. DESTINATARI E FORNITORI TERZI */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">6. Destinatari dei Dati e Fornitori Tecnologici</h2>
              <p>
                I dati non vengono mai ceduti o venduti a terzi per finalità di marketing esterno. Per il funzionamento tecnico della piattaforma, il Titolare si avvale di fornitori infrastrutturali primari nominati Responsabili del Trattamento (ex Art. 28 GDPR):
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Vercel Inc.:</strong> hosting dell&apos;applicazione web e distribuzione CDN sicura (HTTPS).</li>
                <li><strong>Supabase / PostgreSQL Cloud (Regione UE):</strong> archiviazione sicura del database e dei file multimediali.</li>
                <li><strong>Stripe Payments Europe Ltd.:</strong> gestione sicura dei pagamenti elettronici.</li>
                <li><strong>Provider SMTP / Email Transazionali (Mailtrap / Resend / Register.it):</strong> invio di notifiche tecniche e promemoria RSVP.</li>
              </ul>
              <p className="mt-3 text-sm text-stone-600">
                Qualora alcuni fornitori tecnologici trattino dati al di fuori dello Spazio Economico Europeo (SEE), il trasferimento avviene nel pieno rispetto del Capo V del GDPR (Data Privacy Framework UE-USA e/o Clausole Contrattuali Standard approvate dalla Commissione Europea).
              </p>
            </section>

            {/* 7. TEMPI DI CONSERVAZIONE */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">7. Periodo di Conservazione dei Dati</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>I dati relativi agli spazi evento, alle gallerie multimediali e agli invitati sono conservati per tutta la durata del piano attivo sottoscritto dagli Sposi o dal Professionista, o fino alla richiesta di cancellazione dell&apos;evento/account.</li>
                <li>I dati relativi a allergie e intolleranze alimentari degli invitati possono essere rimossi dagli Sposi in qualsiasi momento subito dopo la conclusione dell&apos;evento e vengono eliminati definitivamente alla chiusura del capitolo matrimonio.</li>
                <li>I dati fiscali e di fatturazione sono conservati per 10 anni ai sensi dell&apos;art. 2220 del Codice Civile.</li>
              </ul>
            </section>

            {/* 8. COOKIE POLICY */}
            <section id="cookie-policy">
              <h2 className="text-2xl font-serif text-stone-900 mb-3">8. Cookie Policy</h2>
              <p>
                La piattaforma <strong>GentiLuna</strong> utilizza cookie e tecnologie affini (localStorage) nel rispetto delle Linee Guida del Garante per la protezione dei dati personali:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Cookie Tecnici e Strettamente Necessari (Sempre attivi):</strong> indispensabili per l&apos;autenticazione degli utenti (sessione JWT cifrata), la sicurezza delle richieste, il salvataggio della scelta sul banner cookie (`cookie_consent`) e il corretto funzionamento delle pagine. Non richiedono consenso preventivo.
                </li>
                <li>
                  <strong>Cookie Funzionali e di Preferenza:</strong> permettono di ricordare le preferenze di visualizzazione e le opzioni selezionate dall&apos;utente durante l&apos;utilizzo della piattaforma.
                </li>
                <li>
                  <strong>Cookie Analitici / Statistici:</strong> utilizzati solo previo consenso esplicito tramite il banner cookie per raccogliere informazioni aggregate e anonime sull&apos;utilizzo del sito al fine di migliorarne le prestazioni.
                </li>
              </ul>
              <p className="mt-3">
                L&apos;utente può modificare o revocare in qualsiasi momento il proprio consenso ai cookie cliccando sulla voce <strong>&ldquo;Preferenze Cookie&rdquo;</strong> presente nel piè di pagina (Footer) del sito o tramite le impostazioni del proprio browser.
              </p>
            </section>

            {/* 9. DIRITTI DELL'INTERESSATO */}
            <section>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">9. Diritti dell&apos;Interessato (Artt. 15 - 22 GDPR)</h2>
              <p>
                In qualità di interessato, hai il diritto di chiedere in qualunque momento al Titolare del Trattamento:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 mt-2">
                <li>l&apos;<strong>accesso</strong> ai tuoi dati personali e alle informazioni sul relativo trattamento (Art. 15);</li>
                <li>la <strong>rettifica</strong> dei dati inesatti o l&apos;integrazione di quelli incompleti (Art. 16);</li>
                <li>la <strong>cancellazione (&ldquo;diritto all&apos;oblio&rdquo;)</strong> dei tuoi dati personali o di specifiche fotografie/contenuti che ti riguardano (Art. 17);</li>
                <li>la <strong>limitazione</strong> del trattamento (Art. 18) e la <strong>portabilità</strong> dei dati (Art. 20);</li>
                <li>l&apos;<strong>opposizione</strong> al trattamento (Art. 21) e la <strong>revoca del consenso</strong> in qualsiasi momento senza pregiudicare la liceità del trattamento basata sul consenso prestato prima della revoca.</li>
              </ul>
              <p className="mt-4">
                Per esercitare i tuoi diritti o richiedere la rimozione immediata di contenuti puoi inviare una comunicazione a: <a href="mailto:web@topwebsite.it" className="text-rose-600 font-semibold underline">web@topwebsite.it</a> oppure via PEC a <a href="mailto:giuseppe.topwebsite@pec.it" className="text-rose-600 font-semibold underline">giuseppe.topwebsite@pec.it</a>. Hai inoltre il diritto di proporre reclamo all&apos;Autorità Garante per la Protezione dei Dati Personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="underline">www.garanteprivacy.it</a>).
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-stone-500">
            <Link href="/" className="hover:text-stone-900 font-medium flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Torna alla Home di GentiLuna
            </Link>
            <Link href="/terms" className="text-rose-600 hover:underline font-semibold flex items-center gap-1">
              <FileText className="w-4 h-4" /> Consulta i Termini e Condizioni d&apos;Uso →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
