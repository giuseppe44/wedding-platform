import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-stone-200 prose prose-stone">
        <h1>Informativa sulla Privacy (Bozza Strutturale)</h1>
        <p><strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString("it-IT")}</p>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>[DA COMPLETARE PRIMA DELLA PUBBLICAZIONE]</strong> Questa pagina costituisce una mappatura dei trattamenti tecnici attuali, ma <strong>NON costituisce una policy GDPR completa</strong>. Occorre inserire i dati del Titolare, la base giuridica specifica per ogni trattamento, i tempi di conservazione esatti e le modalità legali per l'esercizio dei diritti prima della messa online ufficiale.
        </div>

        <h2>1. Titolare del Trattamento</h2>
        <p><strong>[INSERIRE DATI DEL TITOLARE]</strong>: Denominazione, Sede Legale, P.IVA, Email di contatto privacy.</p>
        
        <h2>2. Tipologie di Dati Raccolti</h2>
        <p>Il funzionamento della piattaforma comporta la raccolta e l'archiviazione tecnica dei seguenti dati:</p>
        <ul>
          <li><strong>Dati di Autenticazione:</strong> Nome, Cognome, Indirizzo Email e Password per le Coppie e i Professionisti.</li>
          <li><strong>Dati degli Eventi e Capitoli:</strong> Date, luoghi, storie e descrizioni degli eventi, visibili in base alle autorizzazioni scelte.</li>
          <li><strong>Dati degli Invitati e Dati Sensibili:</strong> Nome, cognome e recapiti degli invitati. Eventuali preferenze e intolleranze alimentari gestite tramite il sistema dei Tavoli (dati considerati particolari ex art. 9 GDPR).</li>
          <li><strong>Media e Contenuti (UGC):</strong> Fotografie, video, MP3 e avatar caricati dagli Sposi, Invitati e Professionisti.</li>
          <li><strong>Dati Finanziari:</strong> IBAN opzionale inserito per le liste regalo. (I pagamenti di abbonamento per i Professionisti sono invece gestiti esternamente via Stripe).</li>
        </ul>

        <h2>3. Fornitori di Servizi (Terze Parti)</h2>
        <p>Per l'erogazione del servizio, la piattaforma utilizza le seguenti infrastrutture terze:</p>
        <ul>
          <li><strong>Database e Autenticazione:</strong> Hosting dati su PostgreSQL. (Verificare se si utilizza Supabase Cloud o un server locale).</li>
          <li><strong>Storage File:</strong> I file multimediali sono ospitati su un bucket (es. Supabase Storage o file system locale).</li>
          <li><strong>Pagamenti:</strong> L'infrastruttura di pagamento per gli abbonamenti Pro si appoggia a <strong>Stripe</strong>. Nessun dato di carta di credito viene memorizzato sui nostri server.</li>
        </ul>

        <h2>4. Finalità del Trattamento</h2>
        <p>I dati vengono trattati esclusivamente per:</p>
        <ul>
          <li>Permettere la creazione e condivisione dei capitoli privati.</li>
          <li>Organizzare la gestione logistica (RSVP, Tavoli) e raccogliere file multimediali per l'evento.</li>
          <li>Fornire la vetrina ai professionisti.</li>
        </ul>

        <h2>5. Esercizio dei Diritti dell'Interessato</h2>
        <p>In base al GDPR, l'utente può richiedere in ogni momento l'accesso, la rettifica o la cancellazione dei dati. La cancellazione di un evento o di un account dal pannello rimuove i relativi record dal database.</p>
        <p><strong>[DA COMPLETARE]</strong>: Inserire qui l'indirizzo email a cui inviare formale richiesta (es. privacy@tuodominio.it).</p>

        <div className="mt-12 text-sm text-stone-500 border-t border-stone-200 pt-6">
          <Link href="/" className="hover:underline">← Torna alla Home</Link>
        </div>
      </div>
    </div>
  );
}
