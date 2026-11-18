import { useEffect, useState } from "react";

function DettaglioGiornata(props) {
    const utente = props.utente;
    const lega = props.lega;
    const giornata = props.giornata;

    const [formazione, setFormazione] = useState(null);
    const [rosa, setRosa] = useState([]);
    const [voti, setVoti] = useState([]);
    const [errore, setErrore] = useState('');

    useEffect(() => {
        const caricaDati = async () => {
            try {
                const resFormazione = await fetch('http://localhost:3001/formazioni/' + utente.id + '/' + giornata.id);
                if (!resFormazione.ok) {
                    throw new Error('Errore nel caricamento della formazione');
                }

                const datiFormazione = await resFormazione.json();

                const resRosa = await fetch('http://localhost:3001/leghe/' + lega.id + '/utenti/' + utente.id + '/rosa');
                if (!resRosa.ok) {
                    throw new Error('Errore nel caricamento della rosa');
                }

                const datiRosa = await resRosa.json();

                const resVoti = await fetch('http://localhost:3001/giornate/' + giornata.id + '/voti');
                if (!resVoti.ok) {
                    throw new Error('Errore nel caricamento dei voti');
                }

                const datiVoti = await resVoti.json();

                setRosa(datiRosa);
                setVoti(datiVoti);
                setFormazione(datiFormazione);
            } catch (err){
                setErrore('Impossibile caricare il dettaglio della giornata');
            }
        };

        caricaDati();
    }, [giornata.id, lega.id, utente.id]);

    const ordineRuoli = ['portiere', 'difensore', 'centrocampista', 'attaccante'];

    const righe = formazione === null ? [] : formazione.giocatori.map((f) => {
        const giocatore = rosa.find((g) => g.id === f.giocatore_reale_id);
        const votoSalvato = voti.find((v) => v.giocatore_reale_id === f.giocatore_reale_id);

        return {
            id: f.giocatore_reale_id,
            titolare: f.titolare,
            ordine: f.ordine_panchina,
            nome: giocatore ? giocatore.cognome + ' ' + giocatore.nome : 'Giocatore ' + f.giocatore_reale_id,
            ruolo: giocatore ? giocatore.ruolo : '',
            voto: votoSalvato ? Number(votoSalvato.valore).toFixed(1) : null
        };
    });

    const titolari = righe
        .filter((r) => r.titolare)
        .sort((a, b) => ordineRuoli.indexOf(a.ruolo) - ordineRuoli.indexOf(b.ruolo));

    const panchinari = righe
        .filter((r) => !r.titolare)
        .sort((a, b) => a.ordine - b.ordine);

    return (
        <div className="pagina">
            <button type="button" className="secondario" onClick={props.onIndietro}>Indietro</button>

            <h1>Giornata {giornata.numero} - {lega.nome}</h1>
            <p>Stato: {giornata.stato}</p>

            {errore && <p className="errore">{errore}</p>}

            {formazione && (
                <>
                    <p>Modulo: {formazione.modulo}</p>
                    <p>
                        Punteggio: {Number(giornata.punteggio).toFixed(1)}
                        {giornata.stato !== 'conclusa' && ' (provvisorio: la giornata non è conclusa)'}
                    </p>

                    <h2>Titolari</h2>
                    <ul>
                        {titolari.map((r) => (
                            <li key={r.id}>
                                {r.nome} ({r.ruolo}) - {r.voto === null ? 'nessun voto (conta 0)' : r.voto}
                            </li>
                        ))}
                    </ul>

                    <h2>Panchina (non conteggiata nel punteggio)</h2>

                    {panchinari.length === 0 && <p>Nessun giocatore in panchina.</p>}

                    <ul>
                        {panchinari.map((r) => (
                            <li key={r.id}>
                                {r.ordine}. {r.nome} ({r.ruolo}) - {r.voto === null ? 'Nessun voto' : r.voto}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default DettaglioGiornata;