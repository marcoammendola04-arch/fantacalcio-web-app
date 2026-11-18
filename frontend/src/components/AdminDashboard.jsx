import { useState, useEffect } from "react";
import GestioneLega from "./GestioneLega";
import RosaUtente from "./RosaUtente";

function AdminDashboard(props) {
    const utente = props.utente;

    const [leghe, setLeghe] = useState([]);
    const [nomeLega, setNomeLega] = useState('');
    const [budget, setBudget] = useState('');
    const [legaSelezionata, setLegaSelezionata] = useState(null);
    const [vistaLega, setVistaLega] = useState(null);
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

    const creaLega = async () => {
        setErrore('');
        setSuccesso('');

        if (!nomeLega.trim() || !budget.trim()) {
            setErrore('Inserisci nome e budget della lega');
            return;
        }

        const budgetNumerico = Number(budget);

        if (!Number.isInteger(budgetNumerico) || budgetNumerico <= 0) {
            setErrore('Il budget deve essere un numero intero positivo');
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/leghe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: nomeLega.trim(), budget_iniziale: budgetNumerico, admin_id: utente.id }),
            });

            if (res.status === 201) {
                setSuccesso('Lega creata con successo');
                setNomeLega('');
                setBudget('');
                await caricaLeghe();
            } else {
                const messaggio = await res.text();
                setErrore(messaggio);
            }
        } catch (err) {
            setErrore('Impossibile contattare il server. Riprova più tardi.');
        }
    };

    if (legaSelezionata && vistaLega === 'rosa') {
        return (
            <RosaUtente
                utente={utente}
                lega={legaSelezionata}
                onIndietro={() => setVistaLega(null)}
            />
        );
    }

    if (legaSelezionata && vistaLega === 'gestione') {
        return (
            <GestioneLega
                utente={utente}
                lega={legaSelezionata}
                onIndietro={() => setVistaLega(null)}
            />
        );
    }

    return (
        <div className="pagina">
            <h1>Dashboard Admin</h1>
            <p>Benvenuto, {utente.nome}</p>

            <button type="button" className="secondario" onClick={props.onLogout}>Esci</button>

            <h2>Crea una nuova lega</h2>
            <input
                type="text"
                placeholder="Nome lega"
                value={nomeLega}
                onChange={(e) => setNomeLega(e.target.value)}
            />
            <input
                type="number"
                min="1"
                step="1"
                placeholder="Budget iniziale"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
            />
            <button type="button" onClick={creaLega}>Crea lega</button>

            {errore && <p className="errore">{errore}</p>}
            {successo && <p className="successo">{successo}</p>}

            <h2>Le mie leghe</h2>
            <ul>
                {leghe.map((lega) => (
                    <li key={lega.id}>
                        {lega.nome} - budget {lega.budget_iniziale} 
                        <button type="button" onClick={() => { setLegaSelezionata(lega); setVistaLega('gestione'); }}>
                            Gestisci
                        </button>
                        <button type="button" onClick={() => { setLegaSelezionata(lega); setVistaLega('rosa'); }}>
                            La mia rosa e formazione
                        </button>
                    </li>
                ))}
            </ul>          
        </div>
    );
}

export default AdminDashboard;