import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-stone-200 prose prose-stone">
        <h1>Privacy Policy</h1>
        <p><strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString("it-IT")}</p>
        
        <h2>1. Titolare del Trattamento</h2>
        <p>Il Titolare del trattamento dei dati è "Top Website". Per qualsiasi richiesta, puoi contattarci all'indirizzo email predisposto sulla piattaforma.</p>
        
        <h2>2. Quali dati raccogliamo</h2>
        <p>Raccogliamo e trattiamo i seguenti dati personali:</p>
        <ul>
          <li><strong>Dati di Account:</strong> Nome, email, password per gli Sposi e Professionisti.</li>
          <li><strong>Dati di Evento:</strong> Date, location, e dettagli condivisi volontariamente per l'organizzazione.</li>
          <li><strong>Dati Sensibili (Guest):</strong> Eventuali note e intolleranze alimentari dichiarate per la gestione dei tavoli.</li>
          <li><strong>Media:</strong> Foto e video caricati sulla piattaforma, che rimangono visibili unicamente agli invitati e proprietari autorizzati.</li>
        </ul>

        <h2>3. Finalità del Trattamento</h2>
        <p>I dati sono utilizzati esclusivamente per erogare il servizio di gestione dell'evento (matrimonio), consentire la comunicazione tra professionisti e sposi, organizzare i tavoli, e per finalità strettamente connesse al funzionamento della piattaforma. Nessun dato viene venduto a terzi.</p>

        <h2>4. Conservazione dei Dati</h2>
        <p>I dati dell'evento sono conservati fino a richiesta di cancellazione da parte del proprietario dell'account (gli sposi) o della chiusura dell'account stesso.</p>

        <h2>5. I tuoi diritti</h2>
        <p>Ai sensi del GDPR, hai il diritto di accedere, rettificare o cancellare i tuoi dati, nonché opporti al loro trattamento. Puoi esercitare questi diritti dal pannello utente o contattandoci.</p>

        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl mt-8">
          <h4 className="font-bold text-rose-800 mb-2">Integrazione Iubenda (Consiglio per il Lancio)</h4>
          <p className="text-rose-600 text-sm">
            Per essere al 100% a norma GDPR ed evitare sanzioni, consigliamo di sostituire questa pagina inserendo il codice di integrazione automatica fornito da <strong>Iubenda</strong>, che manterrà i testi aggiornati secondo le ultime normative.
          </p>
        </div>

        <div className="mt-12 text-sm text-stone-500 border-t border-stone-200 pt-6">
          <Link href="/" className="hover:underline">← Torna alla Home</Link>
        </div>
      </div>
    </div>
  );
}
