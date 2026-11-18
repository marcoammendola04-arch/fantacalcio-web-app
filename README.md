# Fantacalcio
 
Progetto universitario per l'esame di **Tecnologie Internet** — Università degli Studi di Parma.
 
Piattaforma web per la gestione di un fantacalcio: creazione leghe, asta semplificata, formazioni, voti e classifica.
 
## Stack tecnologico
 
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MySQL/MariaDB (sviluppato e testato con XAMPP)
- **Comunicazione**: API REST, `fetch`
## Struttura del repository
 
```
fantacalcio/
├── README.md
├── .gitignore
├── fantacalcio_db.sql   Dump SQL (struttura + dati di prova)
├── backend/             API REST (Express) e connessione al database
└── frontend/            Applicazione React (Vite)
```
 
## Prerequisiti
 
- Node.js (versione 18 o superiore)
- XAMPP (o un altro ambiente MySQL/MariaDB compatibile)
## Avvio del progetto
 
### 1. Database
 
1. Avvia MySQL da XAMPP (porta di default `3306`).
2. Crea un database chiamato `fantacalcio_db`.
3. Importa il file `fantacalcio_db.sql` (nella radice del repository), es. da phpMyAdmin, tab "Importa".
### 2. Backend
 
```bash
cd backend
npm install
node server.js
```
 
Il server resta in ascolto su `http://localhost:3001`.
 
La configurazione della connessione (host, utente, password, nome database) è in `server.js`; di default è pensata per un'installazione XAMPP locale senza password sull'utente `root`.
 
### 3. Frontend
 
```bash
cd frontend
npm install
npm run dev
```
 
L'applicazione è raggiungibile all'indirizzo mostrato da Vite in console (di norma `http://localhost:5173`).
 
> Backend e frontend vanno avviati entrambi, in due terminali separati, con il database già importato e in esecuzione.
 
## Funzionalità principali
 
- Registrazione e login (ruoli: amministratore, utente)
- Creazione di leghe e iscrizione dei partecipanti
- Asta semplificata, con assegnazione manuale dei giocatori da parte dell'amministratore e controllo di budget e limiti di rosa per ruolo
- Creazione progressiva delle giornate (stati: `da giocare` → `in corso` → `conclusa`)
- Creazione e modifica delle formazioni (moduli prestabiliti, 11 titolari, panchina ordinata)
- Inserimento e aggiornamento dei voti da parte dell'amministratore
- Calcolo automatico del punteggio e della classifica di lega
## Regole applicative principali
 
- L'amministratore che crea una lega ne è automaticamente anche partecipante.
- L'asta è manuale, non in tempo reale.
- Le formazioni sono modificabili solo finché la giornata è nello stato `da giocare`.
- Il punteggio di una formazione considera esclusivamente gli 11 titolari; la panchina è registrata e visualizzata, ma non concorre al risultato.
- Una giornata non può essere conclusa se manca il voto di uno dei titolari schierati in una formazione salvata per quella giornata.
- Il voto `0` è un voto valido e viene distinto dall'assenza di voto.
## Limiti noti e scelte di progetto dichiarate
 
Scelte consapevoli, coerenti con il livello e il perimetro del corso:
 
- **Autenticazione**: non è implementato un meccanismo di sessione/token. L'identità dell'utente viene passata esplicitamente nel corpo delle richieste (`utente_id` / `admin_id`) e verificata lato server. Le password sono salvate con hash SHA-256 senza salt.
- **Ruolo amministratore**: il controllo di accesso alle operazioni riservate verifica che l'utente abbia ruolo `admin`, non che sia specificamente il creatore della singola lega su cui opera.
- **Panchina**: i giocatori in panchina sono registrati con un ordine, ma non esiste una sostituzione automatica dei titolari assenti o senza voto; il calcolo del punteggio resta limitato ai soli titolari, come da specifica.
- **Stato di lega/asta**: i campi `lega.stato` e `asta.stato` vengono impostati alla creazione e non vengono aggiornati nelle transizioni successive (es. avvio/chiusura asta, conclusione lega).
## Autore
 
Progetto sviluppato individualmente per l'esame di Tecnologie Internet.
 