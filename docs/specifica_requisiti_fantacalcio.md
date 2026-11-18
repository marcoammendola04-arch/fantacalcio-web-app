# Specifica dei requisiti — Applicazione Web Fantacalcio

## 1. Descrizione generale

Il sistema è un'applicazione web che permette a gruppi di utenti di gestire un campionato di Fantacalcio, dalla creazione della lega fino al calcolo dei punteggi giornata dopo giornata. Un admin crea le leghe e ne gestisce gli aspetti amministrativi (asta, giornate, voti); gli utenti partecipano alle leghe, ottengono giocatori tramite un'asta gestita dall'admin, e schierano una formazione ad ogni giornata.

## 2. Attori del sistema

| Attore | Descrizione |
|---|---|
| **Utente** | Si registra, effettua il login, partecipa a leghe esistenti e gestisce la propria formazione |
| **Admin** | Un utente con permessi aggiuntivi: crea leghe, avvia e gestisce l'asta, crea le giornate, ne avanza lo stato, inserisce i voti dei giocatori |

## 3. Requisiti funzionali

### 3.1 Gestione utenti
- RF1. Un utente può registrarsi al sistema fornendo nome, cognome, email e password. Email e password sono validate nel formato (email sintatticamente corretta, password di almeno 6 caratteri) e l'email deve essere univoca nel sistema
- RF2. Un utente registrato può autenticarsi (login) tramite email e password
- RF3. Il sistema distingue utenti con ruolo "admin" da utenti con ruolo "utente" standard; solo un admin può eseguire le operazioni amministrative descritte più sotto
- RF4. Le password non sono mai memorizzate in chiaro, ma sottoposte a hash prima del salvataggio

### 3.2 Gestione leghe
- RF5. Un admin può creare una nuova lega, definendo nome e budget iniziale a disposizione di ogni partecipante; l'admin creatore diventa automaticamente anche il primo partecipante
- RF6. Un utente può iscriversi a una lega esistente; non può iscriversi due volte alla stessa lega
- RF7. Un utente può partecipare a più leghe contemporaneamente

### 3.3 Gestione anagrafica calcistica
- RF8. Il sistema mantiene un elenco di squadre reali (club)
- RF9. Il sistema mantiene un elenco di giocatori reali, ciascuno associato a una squadra reale, un ruolo calcistico (portiere, difensore, centrocampista, attaccante) e una quotazione di base
- RF10. Il sistema permette di consultare l'elenco completo dei giocatori reali con i relativi dati (nome, ruolo, squadra, quotazione), utile per la costruzione dell'interfaccia di asta e formazione

### 3.4 Asta
- RF11. Un admin può avviare l'asta per una lega; ogni lega può avere una sola asta
- RF12. L'admin registra l'esito dell'asta assegnando ciascun giocatore reale a un utente partecipante alla lega, a un prezzo che può differire dalla quotazione base
- RF13. Il sistema impedisce che un utente superi il proprio budget disponibile nella lega, sommando quanto già speso nell'asta
- RF14. Ogni giocatore può essere assegnato a un solo utente per asta
- RF15. Il sistema permette di consultare la rosa di un utente all'interno di una specifica lega, cioè l'elenco dei giocatori a lui assegnati in asta

### 3.5 Giornate
- RF16. Un admin può creare una nuova giornata per una lega; le giornate devono essere numerate in sequenza progressiva a partire da 1, senza salti né duplicati
- RF17. Ogni giornata ha uno stato che avanza in sequenza: "da giocare" → "in corso" → "conclusa"; solo un admin può far avanzare lo stato, e solo di una posizione alla volta

### 3.6 Formazioni
- RF18. Per ogni giornata, un utente può salvare una formazione scegliendo un modulo tattico tra un insieme di moduli ammessi (es. 4-3-3, 3-5-2, ecc.)
- RF19. Una formazione è composta da 11 titolari e un numero variabile di giocatori in panchina, scelti esclusivamente tra i giocatori aggiudicati dall'utente in asta per quella lega; uno stesso giocatore non può comparire più volte nella stessa formazione
- RF20. I titolari devono rispettare, per numero e ruolo, la composizione richiesta dal modulo scelto (1 portiere più i giocatori di movimento indicati dal modulo)
- RF21. I giocatori in panchina hanno un ordine di sostituzione, che deve essere un numero univoco, positivo e progressivo a partire da 1, senza salti
- RF22. Una formazione può essere modificata (sostituendo l'intero contenuto) finché la giornata a cui si riferisce è nello stato "da giocare"; un utente ha al più una formazione per ogni giornata

### 3.7 Voti e punteggi
- RF23. Un admin inserisce, per ogni giornata già avviata o conclusa, il voto di ciascun giocatore reale; non è possibile inserire voti per una giornata non ancora iniziata
- RF24. Se un voto per una combinazione giocatore/giornata esiste già, un nuovo inserimento lo aggiorna invece di duplicarlo. Il voto `0` è un voto valido e viene distinto dall'assenza di voto
- RF25. Il sistema calcola il punteggio di una formazione sommando i voti dei soli titolari schierati
- RF26. Il sistema fornisce una classifica di lega, calcolata sommando i punteggi di tutte le formazioni salvate dagli utenti su tutte le giornate della lega. Un utente compare in classifica solo a partire dal momento in cui ha almeno un voto conteggiato su una sua formazione; finché non ha ancora una formazione valutata, non compare (non viene mostrato con un punteggio pari a 0)

## 4. Requisiti non funzionali

- RNF1. L'interfaccia web deve essere fruibile da browser desktop (requisito minimo; supporto mobile è un'estensione facoltativa)
- RNF2. Le password degli utenti sono memorizzate come hash (SHA-256), mai in chiaro
- RNF3. Il sistema valida lato server ogni operazione critica (rispetto del budget in asta, appartenenza dei giocatori alla rosa dell'utente, coerenza del modulo tattico, unicità di email/iscrizioni/assegnazioni), non affidandosi solo a eventuali controlli lato client
- RNF4. La comunicazione tra frontend e backend avviene tramite API RESTful in formato JSON per le risposte di successo; le risposte di errore restituiscono un messaggio testuale semplice accompagnato dal codice di stato HTTP appropriato, senza incapsularlo in un oggetto JSON
- RNF5. Le operazioni riservate all'admin sono protette da un controllo esplicito sul ruolo dell'utente richiedente

## 5. Limiti noti e scelte di scope

- Il controllo delle operazioni admin si basa su un identificativo utente trasmesso dal client nel corpo della richiesta, non su un meccanismo di sessione o token: è una scelta di semplicità coerente con l'ambito del corso, non una soluzione di livello produttivo
- Il controllo del ruolo admin verifica che l'utente abbia ruolo "admin" nel sistema, non che sia specificatamente il creatore della lega su cui sta operando: un admin può quindi, tecnicamente, operare come utente su leghe create da un altro admin
- L'hashing delle password usa SHA-256 senza salt, più debole di algoritmi pensati specificamente per le password (bcrypt, argon2), ma coerente con gli strumenti trattati a lezione
- Non è prevista una verifica automatica che la rosa di un utente sia numericamente completa (per ruolo) al termine dell'asta, per limiti nei dati di prova disponibili in questa fase
- I campi di stato di lega e asta (`lega.stato`, `asta.stato`) vengono impostati al momento della creazione della risorsa e non vengono aggiornati automaticamente nelle transizioni successive (es. avvio o chiusura dell'asta, evoluzione dello stato della lega nel tempo)
- Non sono previste operazioni di cancellazione (DELETE) sulle risorse principali, non essendo richieste dal funzionamento del gioco così come definito

## 6. Fuori perimetro

Le seguenti funzionalità, tipiche del Fantacalcio reale, sono state deliberatamente escluse per mantenere il progetto realizzabile nei tempi previsti:
- Asta competitiva in tempo reale con rilanci tra utenti (richiederebbe tecnologie di comunicazione bidirezionale non trattate nel corso); l'asta è invece gestita e registrata dall'admin
- Sostituzione automatica dei titolari assenti dal voto con un giocatore di panchina dello stesso ruolo, secondo l'ordine stabilito: la panchina viene registrata e mostrata, ma resta una funzionalità informativa, senza effetto sul calcolo del punteggio
- Assegnazione di bonus o malus al voto base, il punteggio si basa unicamente sul voto inserito dall'admin
- Mercato di riparazione a stagione in corso
- Scambi/svincoli tra utenti dopo l'asta iniziale
- Chat o sistema di notifiche tra utenti
