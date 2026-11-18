import { useEffect, useState } from "react";

function VotiGiornata(props) {
    const utente = props.utente;
    const lega = props.lega;
    const giornata = props.giornata;

    const [giocatori, setGiocatori] = useState([]);
    const [valori, setValori] = useState({});
    const [errore, setErrore] = useState('');
    const [successo, setSuccesso] = useState('');

    useEffect(() => {
        const caricaDati = async () => {
            try {
                const resGiocatori = await fetch('http://localhost:3001/leghe/' + lega.id + '/assegnazioni');
                if (!resGiocatori.ok) {
                    throw new Error('Errore nel caricamento dei giocatori');
                }

                setGiocatori(await resGiocatori.json());

                const resVoti = await fetch('http://localhost:3001/giornate/' + giornata.id + '/voti');
                if (!resVoti.ok) {
                    throw new Error('Errore nel caricamento dei voti');
                }

                const votiSalvati = await resVoti.json();
                const mappa = {};

                for (let i in votiSalvati) {
                    mappa[votiSalvati[i].giocatore_reale_id] = String(votiSalvati[i].valore);
                }

                setValori(mappa);
            } catch (err) {
                setErrore('Impossibile caricare i dati');
            }
        };

        caricaDati();
    }, [lega.id, giornata.id]);

    const aggiornaValore = (id, testo) => {
        setValori((precedente) => {
            return { ...precedente, [id]: testo };
        });
    };

    const salvaVoto = async (giocatore) => {
        setErrore('');
        setSuccesso('');

        const testo = valori[giocatore.giocatore_id];

        if (testo === undefined || testo === '') {
            setErrore('Inserisci un voto per ' + giocatore.cognome);
            return;
        }

        const votoNumerico = Number(testo);

        if (!Number.isFinite(votoNumerico) || votoNumerico < 0) {
            setErrore('Il voto deve essere un numero positivo');
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/voti', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    admin_id: utente.id,
                    giocatore_reale_id: giocatore.giocatore_id,
                    giornata_id: giornata.id,
                    valore: votoNumerico,
                }),
            });

            if (res.status === 200 || res.status === 201) {
                setSuccesso('Voto salvato per ' + giocatore.cognome + ' ' + giocatore.nome);
            } else {
                setErrore(await res.text());
            }
        } catch (err) {
            setErrore('Impossibile contattare il server. Riprova più tardi.');
        }
    };

    return (
        <div className="pagina">
            <button type="button" className="secondario" onClick={props.onIndietro}>Indietro</button>

            <h1>Voti - Giornata {giornata.numero}</h1>
            <p>{lega.nome} - stato giornata: {giornata.stato}</p>

            {errore && <p className="errore">{errore}</p>}
            {successo && <p className="successo">{successo}</p>}

            {giocatori.length === 0 && !errore && <p>Nessun giocatore assegnato in questa lega.</p>}

            <ul>
                {giocatori.map((g) => (
                    <li key={g.giocatore_id}>
                        {g.cognome} {g.nome} ({g.ruolo}) - di {g.utente_nome} {g.utente_cognome}{' '}
                        <input 
                            type="number"
                            step="0.5"
                            min="0"
                            placeholder="Voto"
                            value={valori[g.giocatore_id] || ''}
                            onChange={(e) => aggiornaValore(g.giocatore_id, e.target.value)}
                        />
                        <button type="button" onClick={() => salvaVoto(g)}>Salva</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VotiGiornata;