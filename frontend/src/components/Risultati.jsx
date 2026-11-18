import { useEffect, useState } from "react";
import DettaglioGiornata from "./DettaglioGiornata";

function Risultati(props) {
    const utente = props.utente;
    const lega = props.lega;

    const [classifica, setClassifica] = useState([]);
    const [punteggi, setPunteggi] = useState([]);
    const [giornataDettaglio, setGiornataDettaglio] = useState(null);
    const [errore, setErrore] = useState('');

    useEffect(() => {
        const caricaDati = async () => {
            try {
                const resClassifica = await fetch('http://localhost:3001/leghe/' + lega.id + '/classifica');
                if (!resClassifica.ok) {
                    throw new Error('Errore nel caricamento della classifica');
                }

                setClassifica(await resClassifica.json());

                const resGiornate = await fetch('http://localhost:3001/leghe/' + lega.id + '/giornate');
                if (!resGiornate.ok) {
                    throw new Error('Errore nel caricamento delle giornate');
                }

                const tutte = await resGiornate.json();
                const iniziate = tutte.filter((g) => g.stato !== 'da giocare');
                const risultati = [];

                for (let i = 0; i < iniziate.length; i++) {
                    const resFormazione = await fetch('http://localhost:3001/formazioni/' + utente.id + '/' + iniziate[i].id);

                    if (resFormazione.status === 404) {
                        risultati.push({ id: iniziate[i].id, numero: iniziate[i].numero, stato: iniziate[i].stato, punteggio: null});
                    } else if (resFormazione.status === 200) {
                        const formazione = await resFormazione.json();
                        const resPunteggio = await fetch('http://localhost:3001/formazioni/' + formazione.id + '/punteggio');
                        if (!resPunteggio.ok) {
                            throw new Error('Errore nel caricamento del punteggio');
                        }

                        const dati = await resPunteggio.json();
                        risultati.push({ id: iniziate[i].id, numero: iniziate[i].numero, stato: iniziate[i].stato, punteggio: dati.punteggio });
                    } else {
                        throw new Error('Errore nel caricamento della formazione');
                    }
                }

                setPunteggi(risultati);
            } catch (err) {
                setErrore('Impossibile caricare i risultati.');
            }
        };

        caricaDati();
    }, [lega.id, utente.id]);

    if (giornataDettaglio) {
        return (
            <DettaglioGiornata 
                utente={utente}
                lega={lega}
                giornata={giornataDettaglio}
                onIndietro={() => setGiornataDettaglio(null)}
            />
        );
    }

    return (
        <div className="pagina">
            <button type="button" className="secondario" onClick={props.onIndietro}>Indietro</button>

            <h1>Classifica - {lega.nome}</h1>

            {errore && <p className="errore">{errore}</p>}

            {classifica.length === 0 && !errore && <p>Nessun punteggio ancora disponibile.</p>}

            <ol>
                {classifica.map((r) => (
                    <li key={r.utente_id}>
                        {r.nome} {r.cognome} - {Number(r.punti_totali).toFixed(1)} punti
                    </li>
                ))}
            </ol>
            
            <h2>I miei punteggi</h2>

            {punteggi.length === 0 && !errore && <p>Nessuna giornata ancora iniziata.</p>}

            <ul>
                {punteggi.map((p) => (
                    <li key={p.id}>
                        Giornata {p.numero} ({p.stato}):{' '}
                        {p.punteggio === null ? 'Nessuna formazione schierata' : Number(p.punteggio).toFixed(1) + ' punti'}
                        {p.punteggio !== null && (
                            <button type="button" onClick={() => setGiornataDettaglio(p)}>Dettaglio</button>
                        )}
                    </li>
                ))}
            </ul>  
        </div>
    );
}

export default Risultati;