import { useState, useEffect } from "react";
import RosaUtente from "./RosaUtente";

function UserDashboard(props) {
    const utente = props.utente;

    const [leghe, setLeghe] = useState([]);
    const [idLegaDaRaggiungere, setIdLegaDaRaggiungere] = useState('');
    const [legaSelezionata, setLegaSelezionata] = useState(null);
    const [errore, setErrore] = useState('');
    const [successo, setSuccesso] = useState('');

    const caricaLeghe = async () => {
        try {
            const res = await fetch('http://localhost:3001/utenti/' + utente.id + '/leghe');
            if (!res.ok) {
                throw new Error('Errore nel caricamento delle leghe');
            }

            setLeghe(await res.json());
        } catch (err) {
            setErrore('Impossibile caricare le leghe');
        }
    };

    useEffect(() => {
        caricaLeghe();
    }, [utente.id]);

    const iscrivitiALega = async () => {
        setErrore('');
        setSuccesso('');

        if (!idLegaDaRaggiungere || !Number.isInteger(Number(idLegaDaRaggiungere)) || Number(idLegaDaRaggiungere) <= 0) {
            setErrore('Inserisci un Id di lega valido');
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/leghe/' + idLegaDaRaggiungere + '/partecipanti', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ utente_id: utente.id}),
            });

            if (res.status === 201) {
                setSuccesso('Iscrizione avvenuta con successo');
                setIdLegaDaRaggiungere('');
                await caricaLeghe();
            } else {
                const messaggio = await res.text();
                setErrore(messaggio);
            }
        } catch (err) {
            setErrore('Impossibile contattare il server. Riprova più tardi.');
        }
    };

    if (legaSelezionata) {
        return (
            <RosaUtente
                utente={utente}
                lega={legaSelezionata}
                onIndietro={() => setLegaSelezionata(null)}
            />
        );
    }

    return (
        <div className="pagina">
            <h1>Dashboard Utente</h1>
            <p>Benvenuto, {utente.nome}</p>

            <button type="button" className="secondario" onClick={props.onLogout}>Esci</button>

            <h2>Iscriviti a una lega</h2>
            <input
                type="number"
                placeholder="ID lega"
                value={idLegaDaRaggiungere}
                onChange={(e) => setIdLegaDaRaggiungere(e.target.value)}
            />

            <button type="button" onClick={iscrivitiALega}>Iscriviti</button>

            {errore && <p className="errore">{errore}</p>}
            {successo && <p className="successo">{successo}</p>}

            <h2>Le mie leghe</h2>
            <ul>
                {leghe.map((lega) => (
                    <li key={lega.id}>
                        {lega.nome} 
                        <button type="button" onClick={() => setLegaSelezionata(lega)}>La mia rosa e formazione</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserDashboard;