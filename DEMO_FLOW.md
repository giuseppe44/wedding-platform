# 🎤 Guida alla Validazione Reale (Demo Flow)

Questo documento serve come traccia per la tua prima presentazione del prodotto a un Fotografo o Videomaker reale. 
L'obiettivo NON è fargli un tutorial tecnico, ma **fargli percepire il valore commerciale**.

---

## 🚀 IL FLUSSO DIMOSTRATIVO (Step-by-Step)

Prima di iniziare:
Assicurati di aver lanciato `npm run prisma:seed` e di avere il server attivo (`npm run dev`).

**STEP 1: Mostrare la Landing Page**
- Apri `http://localhost:3000`
- **Cosa dire:** *"Guarda, questo non è un banale gestionale. È una Digital Wedding Experience. Immagina di proporre ai tuoi sposi uno spazio elegante dove il tuo lavoro professionale si unisce ai ricordi spontanei degli invitati."*

**STEP 2: Esplora Demo**
- Clicca sul pulsante "Esplora Demo". 
- Mostragli la pagina del matrimonio di Chiara e Matteo come se foste dal cellulare (se puoi, usa gli strumenti per sviluppatori del browser per simulare uno smartphone, o fagli aprire il link dal suo telefono).

**STEP 3: L'Esperienza Invitati**
- **Cosa dire:** *"Il giorno del matrimonio, ogni invitato trova un elegante QR code sui tavoli. Lo scansiona e si apre questo. Nessuna app da scaricare, nessuna registrazione. Solo 1 click."*

**STEP 4: Simulazione Upload**
- Clicca sul tasto centrale di Upload.
- Fagli vedere come la schermata sia immediata ( Drag & Drop o Selezione multipla dal rullino del telefono).

**STEP 5 & 6: Esplorazione Spazio Pubblico**
- Mostragli le 4 Tab:
  1. **Galleria**: Le foto condivise.
  2. **Dediche**: Il guestbook digitale.
  3. **Programma**: La timeline (es. Taglio torta alle 23:30).
  4. **Location**: Le indicazioni Mappe.

**STEP 7: Dietro le Quinte (Dashboard)**
- Apri `http://localhost:3000/login` in una nuova scheda.
- Entra come **Sposi (Dashboard Moderazione)**.
- **Cosa dire:** *"Gli sposi hanno il totale controllo. Niente finisce online senza il loro consenso."*

**STEP 8: La Moderazione**
- Mostragli come basta un click sulla spunta verde (Check) per approvare una foto o una dedica, e un click sulla "X" per cestinarla.

**STEP 9: Il Materiale Professionale**
- Esci e rientra come **Fotografo (Area Pro)**.
- Mostragli che tu (fotografo) hai una panoramica di tutti i tuoi eventi, quanto spazio occupano, e puoi generare un nuovo "Spazio Matrimonio" in 20 secondi inserendo solo Nome e Data.

**STEP 10: La Consegna (ZIP)**
- Torna nella dashboard sposi o fotografo e clicca su "Scarica Tutte (ZIP)".
- **Cosa dire:** *"Finito il matrimonio, tutto il materiale moderato diventa un unico archivio compresso, già pronto. Gli sposi hanno tutto in un click."*

---

## 📝 COSA ASCOLTARE (Le domande per la Validazione)

Durante la demo, **PARLA POCO E ASCOLTA MOLTO**. Non difendere le feature tecniche. 
Fagli le seguenti domande:

1. **"Lo proporresti ai tuoi sposi?"**
2. **"Lo venderesti come servizio Extra o lo includeresti nei tuoi pacchetti Premium?"**
3. **"Quanto valore pensi che aggiunga al tuo lavoro?"**
4. **"Secondo te, quanto sarebbe disposto a pagare uno sposo per questo spazio?"**
5. **"Quale funzione utilizzeresti di più?"**
6. **"Cosa manca secondo te? C'è qualcosa che elimineresti perché inutile?"**
7. **"Cosa ti aspetteresti da un prodotto del genere se lo comprassi per il tuo studio?"**
8. **"Lo proporresti brandizzato col tuo nome o come piattaforma terza neutra?"**

### Obiettivo Finale
Non scrivere nuovo codice fino a quando non hai risposto a queste 3 domande chiave:
1. Il fotografo lo vuole?
2. Gli sposi lo vogliono?
3. Qualcuno è disposto a pagarlo?
