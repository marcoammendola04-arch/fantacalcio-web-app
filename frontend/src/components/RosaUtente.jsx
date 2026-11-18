import { useEffect, useState } from "react";
import Formazione from "./Formazione";
import Risultati from "./Risultati";

function RosaUtente(props) {
    const utente = props.utente;
    const lega = props.lega;

    const [rosa, setRosa] = useState([]);
    const [giornate, setGiornate] = useState([]);
    const [vista, setVista] = useState(null);
    const [errore, setErrore] = useState('');

    useEffect(() => {
        setErrore('');

        const caricaRosa = async () => {
            try {
                const resRosa = await fetch('http://localhost:3001/leghe/' + lega.id + '/utenti/' + utente.id + '/rosa');

                if (!resRosa.ok) {
                    throw new Error('Errore nel caricamento della rosa');
                }

                setRosa(await resRosa.json());

                const resGiornate = await fetch('http://localhost:3001/leghe/' + lega.id + '/giornate');

                if (!resGiornate.ok) {
                    throw new Error('Errore nel caricamento delle giornate');
                }

                setGiornate(await resGiornate.json());
            } catch (err) {
                setErrore('Impossibile caricare la rosa e le giornate');
            }
        };

        caricaRosa();
    }, [lega.id, utente.id]);

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
            <Formazione 
                utente={utente}
                lega={lega}
                rosa={rosa}
                giornata={vista}
                onIndietro={() => setVista(null)}
            />
        );
    }

    return (
        <div className="pagina">
            <button type="button" className="secondario" onClick={props.onIndietro}>Indietro</button>

            <h1>La mia rosa - {lega.nome}</h1>

            <button type="button" onClick={() => setVista('risultati')}>Classifica e punteggi</button>

            {errore && <p className="errore">{errore}</p>}

            {rosa.length === 0 && !errore && <p>Non hai ancora nessun giocatore in questa lega.</p>}

            <ul>
                {rosa.map((g) => (
                    <li key={g.id}>
                        {g.cognome} {g.nome} - ({g.ruolo}) - pagato {g.prezzo_pagato}
                    </li>
                ))}
            </ul>

            <h2>Giornate</h2>

            {giornate.length === 0 && !errore && <p>Nessuna giornata ancora creata.</p>}

            <ul>
                {giornate.map((g) => (
                    <li key={g.id}>
                        Giornata {g.numero} - {g.stato}{' '}
                        {g.stato === 'da giocare' && (
                            <button type="button" onClick={() => setVista(g)}>Formazione</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RosaUtente;