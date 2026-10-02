import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-stone-200 prose prose-stone">
        <h1>Regolamento e Condizioni di Servizio</h1>
        <p><strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString("it-IT")}</p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>[DA COMPLETARE PRIMA DELLA PUBBLICAZIONE]</strong> Inserire denominazione societaria, sede legale, Partita IVA del titolare della piattaforma e foro di competenza. I seguenti termini rappresentano una bozza strutturale basata sulle funzionalità attuali dell'applicativo.
        </div>

        <h2>1. Descrizione del Servizio</h2>
        <p>Questa piattaforma fornisce un'infrastruttura tecnologica che permette a coppie e famiglie di raccontare la propria storia (eventi, matrimoni, nascite, ecc.), e a professionisti del settore eventi di offrire e mostrare i propri servizi.</p>

        <h2>2. Utilizzo da parte delle Coppie (e Famiglie)</h2>
        <ul>
          <li><strong>Spazio Personale:</strong> Le coppie possono creare capitoli, gestire inviti, tavoli e liste regalo (con indicazione autonoma del proprio IBAN).</li>
          <li><strong>Limiti del Piano Base:</strong> Il piano Base consente un massimo di 1 capitolo, 3 GB e 20 media caricati. e limiti sul numero di invitati e media caricati. L'upgrade (Piani Premium e Diamond) sblocca funzionalità avanzate come indicato nella sezione Prezzi.</li>
        </ul>

        <h2>3. Utilizzo da parte dei Professionisti</h2>
        <ul>
          <li><strong>Profili e Vetrina:</strong> I professionisti possono pubblicare una vetrina, listare i propri servizi, caricare un portfolio (massimo 15 immagini) e collegare video da piattaforme esterne.</li>
          <li><strong>Relazioni tra Utenti:</strong> La piattaforma agisce esclusivamente come fornitore tecnologico e non interviene nei contratti, pagamenti o accordi diretti stipulati privatamente tra coppie e professionisti.</li>
        </ul>

        <h2>4. Contenuti e Diritto d'Autore (Copyright)</h2>
        <ul>
          <li><strong>Proprietà dei Contenuti:</strong> Gli utenti (Sposi, Invitati, Professionisti) mantengono la piena titolarità dei contenuti caricati (foto, video, musica).</li>
          <li><strong>Responsabilità per il Caricamento:</strong> Caricando qualsiasi materiale (incluse immagini, file MP3 o video), dichiari e garantisci di possederne tutti i diritti necessari o di disporre delle esplicite licenze e autorizzazioni da parte dei legittimi titolari del copyright.</li>
          <li><strong>Liberatorie:</strong> L'utente si assume l'esclusiva responsabilità in merito al consenso per l'uso dell'immagine delle persone ritratte.</li>
        </ul>

        <h2>5. Contenuti Vietati e Rimozione</h2>
        <p>È severamente vietato caricare materiale illegale, offensivo, diffamatorio, o che violi i diritti d'autore di terzi. Il titolare si riserva il diritto di sospendere l'account e rimuovere qualsiasi contenuto senza preavviso, in presenza di motivi legittimi o di segnalazioni di violazione.</p>
        
        <h2>6. Segnalazioni e Contatti</h2>
        <p>Eventuali segnalazioni relative a contenuti illeciti o violazioni del copyright possono essere inviate al nostro supporto.</p>
        <p><strong>Contatto Supporto:</strong> [INSERIRE INDIRIZZO EMAIL DI SUPPORTO, es. legal@tuodominio.it]</p>

        <div className="mt-12 text-sm text-stone-500 border-t border-stone-200 pt-6">
          <Link href="/" className="hover:underline">← Torna alla Home</Link>
        </div>
      </div>
    </div>
  );
}

