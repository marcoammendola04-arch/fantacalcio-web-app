import { useState, useEffect } from "react";
import VotiGiornata from "./VotiGiornata";
import Risultati from "./Risultati";

function GestioneLega(props) {
    const utente = props.utente;
    const lega = props.lega;

    const [asta, setAsta] = useState(null);
    const [partecipanti, setPartecipanti] = useState([]);
    const [giocatori, setGiocatori] = useState([]);
    const [assegnazioni, setAssegnazioni] = useState([]);
    const [utenteScelto, setUtenteScelto] = useState('');
    const [giocatoreScelto, setGiocatoreScelto] = useState('');
    const [prezzo, setPrezzo] = useState('');
    const [filtroRuolo, setFiltroRuolo] = useState('');
    const [errore, setErrore] = useState('');
    const [successo, setSuccesso] = useState('');
    const [giornate, setGiornate] = useState([]);
    const [vista, setVista] = useState(null);

    const ordineRuoli = ['portiere', 'difensore', 'centrocampista', 'attaccante'];
    const prossimoStato = { 'da giocare' : 'in corso', 'in corso' : 'conclusa' };

    const caricaTutto = async () => {
        try {
            const resAsta = await fetch('http://localhost:3001/leghe/' + lega.id + '/asta');
            if (resAsta.status === 200) {
                setAsta(await resAsta.json());
            } else if (resAsta.status === 404) {
                setAsta(null);
            } else {
                throw new Error('Errore nel recupero dell\'asta');
            }

            const resPartecipanti = await fetch('http://localhost:3001/leghe/' + lega.id + '/partecipanti');
            if (!resPartecipanti.ok) {
                throw new Error('Errore nel recupero dei partecipanti');
            }

            setPartecipanti(await resPartecipanti.json());

            const resGiocatori = await fetch('http://localhost:3001/giocatori');
            if (!resGiocatori.ok) {
                throw new Error('Errore nel recupero dei giocatori');
            }

            setGiocatori(await resGiocatori.json());

            const resAssegnazioni = await fetch('http://localhost:3001/leghe/' + lega.id + '/assegnazioni');
            if (!resAssegnazioni.ok) {
                throw new Error('Errore nel recupero delle assegnazioni');
            }

            setAssegnazioni(await resAssegnazioni.json());

            const resGiornate = await fetch('http://localhost:3001/leghe/' + lega.id + '/giornate');
            if (!resGiornate.ok) {
                throw new Error('Errore nel recupero delle giornate');
            }
                
            setGiornate(await resGiornate.json());
        } catch (err) {
            setErrore('Impossibile caricare i dati della lega');
        }
    };

    useEffect(() => {
        caricaTutto();
    }, [lega.id]);

    const avviaAsta = async () => {
        setErrore('');
        setSuccesso('');

        try {
            const res = await fetch('http://localhost:3001/leghe/' + lega.id + '/asta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_id: utente.id }),
            });

            if (res.status === 201) {
                setSuccesso('Asta avviata');
                caricaTutto();
            } else {
                setErrore(await res.text());
            }
        } catch(err) {
            setErrore('Impossibile contattare il server. Riprova più tardi.');
        }
    };

    const assegnaGiocatore = async () => {
        setErrore('');
        setSuccesso('');

        const prezzoNumerico = Number(prezzo);

        if (!utenteScelto || !giocatoreScelto || prezzo === '') {
            setErrore('Scegli un partecipante, un giocatore e inserisci il prezzo');
            return;
        }

        if (!Number.isInteger(prezzoNumerico) || prezzoNumerico <= 0) {
            setErrore('Il prezzo deve essere un numero positivo');
            return;
        }

        const giocatore = giocatori.find((g) => g.id === Number(giocatoreScelto));
        const nomeGiocatore = giocatore ? giocatore.cognome + ' ' + giocatore.nome : 'questo giocatore';

        if (!window.confirm('Assegnare ' + nomeGiocatore + ' per ' + prezzoNumerico + '? L\'operazione non è reversibile da qui.')) {
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/aste/' + asta.id + '/assegnazioni', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    admin_id: utente.id,
                    utente_id: Number(utenteScelto),
                    giocatore_reale_id: Number(giocatoreScelto),
                    prezzo_pagato: prezzoNumerico
                }),
            });

            if (res.status === 201) {
                setSuccesso('Giocatore assegnato');
                setGiocatoreScelto('');
                setPrezzo('');
                caricaTutto();
            } else {
                setErrore(await res.text());
            }
        } catch (err) {
            setErrore('Impossibile contattare il server. Riprova più tardi.');
        }
    };

    const giocatoriDisponibili = giocatori.filter((g) => {
        return !assegnazioni.some((a) => a.giocatore_id === g.id);
    });

    const giocatoriFiltrati = giocatoriDisponibili.filter((g) => {
        return !filtroRuolo || g.ruolo === filtroRuolo;
    });

    const cambiaFiltroRuolo = (ruolo) => {
        setFiltroRuolo(ruolo);
        setGiocatoreScelto('');
    };

    const prossimoNumero = giornate.length === 0 ? 1 : giornate[giornate.length - 1].numero + 1;
    const maxGiornate = 38;
    const limiteRaggiunto = prossimoNumero > maxGiornate;

    const creaGiornata = async () => {
        setErrore('');
        setSuccesso('');

        try {
            const res = await fetch('http://localhost:3001/leghe/' + lega.id + '/giornate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_id: utente.id, numero: prossimoNumero}), 
            });

            if (res.status === 201) {
                setSuccesso('Giornata ' + prossimoNumero + ' creata');
                await caricaTutto();
            } else {
                setErrore(await res.text());
            }
        } catch (err) {
            setErrore('Impossibile contattare il server. Riprova più tardi.');
        }
    };

    const avanzaStato = async (giornata) => {
        setErrore('');
        setSuccesso('');

        const nuovoStato = prossimoStato[giornata.stato];

        if (!window.confirm('Portare la giornata ' + giornata.numero + ' allo stato "' + nuovoStato + '"? L\'operazione non è reversibile.')) {
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/giornate/' + giornata.id + '/stato', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_id: utente.id, stato: nuovoStato }),
            });

            if (res.status === 200) {
                setSuccesso('Giornata ' + giornata.numero + ' ora è "' + nuovoStato + '"');
                await caricaTutto();
            } else {
                setErrore(await res.text());
            }
        } catch (err) {
            setErrore('Impossibile contattare il server. Riprova più tardi');
        }
    };

    if (vista === 'risultati') {
        return (
            <Risultati
                utente={utente}
                lega={lega}
                onIndietro={() => setVista(null)} 
            />
        );
    }

    if (vista) {
        return (
            <VotiGiornata 
                utente={utente}
                lega={lega}
                giornata={vista}
                onIndietro={() => setVista(null)}
            />
        );
    }

    return (
        <div className="pagina">
            <button type="button" className="secondario" onClick={props.onIndietro}>Indietro</button>
            <button type="button" onClick={() => setVista('risultati')}>Classifica</button>

            <h1>{lega.nome}</h1>
            <p>Budget iniziale: {lega.budget_iniziale} - ID lega: {lega.id}</p>

            {errore && <p className="errore">{errore}</p>}
            {successo && <p className="successo">{successo}</p>}

            <h2>Asta</h2>

            {!asta && (
                <button type="button" onClick={avviaAsta}>Avvia asta</button>
            )}

            {asta && (
                <>
                    <h3>Assegna un giocatore</h3>

                    <select value={utenteScelto} onChange={(e) => setUtenteScelto(e.target.value)}>
                        <option value="">Scegli il partecipante</option>
                        {partecipanti.map((p) => (
                            <option key={p.id} value={p.id}>{p.nome} {p.cognome}</option>
                        ))}
                    </select>

                    <select value={filtroRuolo} onChange={(e) => cambiaFiltroRuolo(e.target.value)}>
                        <option value="">Tutti i ruoli</option>
                        {ordineRuoli.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                        
                    <select value={giocatoreScelto} onChange={(e) => setGiocatoreScelto(e.target.value)}>
                        <option value="">Scegli il giocatore</option>
                        {giocatoriFiltrati.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.cognome} {g.nome} - ({g.ruolo}) - {g.squadra} (quotazione {g.quotazione})
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Prezzo pagato"
                        value={prezzo}
                        onChange={(e) => setPrezzo(e.target.value)}
                    />

                    <button type="button" onClick={assegnaGiocatore}>Assegna</button>

                    <h3>Assegnazioni effettuate</h3>
                    <ul>
                        {assegnazioni.map((a) => (
                            <li key={a.giocatore_id}>
                                {a.cognome} {a.nome} ({a.ruolo}) a {a.utente_cognome} per {a.prezzo_pagato}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <h2>Giornate</h2>

            {limiteRaggiunto
                ? <p>Limite di {maxGiornate} giornate raggiunto: non si possono creare altre giornate.</p>
                : <button type="button" onClick={creaGiornata}>Crea giornata {prossimoNumero}</button>}

            <ul>
                {giornate.map((g) => (
                    <li key={g.id}>
                        Giornata {g.numero} - stato: {g.stato}
                        {prossimoStato[g.stato] && (
                            <button type="button" onClick={() => avanzaStato(g)}>
                                Passa a "{prossimoStato[g.stato]}"
                            </button>
                        )}
                        {g.stato !== 'da giocare' && (
                            <button type="button" onClick={() => setVista(g)}>Inserisci voti</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GestioneLega;