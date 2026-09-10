import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-stone-200 prose prose-stone">
        <h1>Termini e Condizioni di Servizio</h1>
        <p><strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString("it-IT")}</p>

        <h2>1. Accettazione dei Termini</h2>
        <p>Creando un account su questa piattaforma, accetti di essere vincolato dai presenti Termini di Servizio forniti da "Top Website".</p>

        <h2>2. Ruoli e Responsabilità</h2>
        <ul>
          <li><strong>Gli Sposi (Couple):</strong> Utilizzano la piattaforma gratuitamente per gestire il proprio evento, invitati e interazioni con i professionisti.</li>
          <li><strong>I Professionisti:</strong> Possono offrire i loro servizi e interagire con le coppie, previo abbonamento (ove applicabile).</li>
          <li><strong>Gli Invitati (Guest):</strong> Accedono in sola lettura o interazione limitata (foto, risposte RSVP) tramite link privato.</li>
        </ul>
        <p>Top Website fornisce esclusivamente l'infrastruttura tecnologica e non è parte di alcun contratto diretto stipulato tra sposi e professionisti.</p>

        <h2>3. Pagamenti e Commissioni</h2>
        <p>Gli sposi e gli invitati non pagano alcuna tariffa d'uso. La piattaforma non preleva commissioni sulle transazioni esterne stipulate tra Sposi e Professionisti. L'unico flusso di pagamento (se attivo) riguarda le tariffe di iscrizione/visibilità riservate ai professionisti del settore.</p>

        <h2>4. Contenuti e Diritto d'Autore</h2>
        <p>Sei l'esclusivo proprietario dei contenuti (foto, video, testi) che carichi. Concedi alla piattaforma una licenza temporanea limitata al fine di poter erogare il servizio (hosting e visualizzazione sulla tua timeline).</p>

        <div className="mt-12 text-sm text-stone-500 border-t border-stone-200 pt-6">
          <Link href="/" className="hover:underline">← Torna alla Home</Link>
        </div>
      </div>
    </div>
  );
}
