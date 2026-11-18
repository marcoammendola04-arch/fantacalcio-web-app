import { useEffect, useState } from "react";

function Formazione(props) {
    const utente = props.utente;
    const lega = props.lega;
    const rosa = props.rosa;
    const giornata = props.giornata;

    const [moduli, setModuli] = useState({});
    const [modulo, setModulo] = useState('');
    const [titolari, setTitolari] = useState([]);
    const [panchina, setPanchina] = useState([]);
    const [errore, setErrore] = useState('');
    const [successo, setSuccesso] = useState('');

    useEffect(() => {
        const caricaDati = async () => {
            try {
                const resModuli = await fetch('http://localhost:3001/moduli');
                if (!resModuli.ok) {
                    throw new Error('Errore nel caricamento dei moduli');
                }

                setModuli(await resModuli.json());
            } catch (err) {
                setErrore('Impossibile caricare i dati');
            }
        };

        caricaDati();
    }, []);

    useEffect(() => {
        const caricaFormazione = async () => {
            setErrore('');
            setTitolari([]);
            setPanchina([]);
            setModulo('');
            setSuccesso('');

            try {
                const res = await fetch('http://localhost:3001/formazioni/' + utente.id + '/' + giornata.id);

                if (res.status === 200) {
                    const data = await res.json();
                    setModulo(data.modulo);
                    setTitolari(data.giocatori.filter((g) => g.titolare).map((g) => Number(g.giocatore_reale_id)));

                    const inPanchina = data.giocatori.filter((g) => !g.titolare);
                    inPanchina.sort((a, b) => a.ordine_panchina - b.ordine_panchina);
                    setPanchina(inPanchina.map((g) => Number(g.giocatore_reale_id)));
                } else if (res.status !== 404) {
                    throw new Error('Errore nel caricamento della formazione');
                }
            } catch (err){
                setErrore('Impossibile caricare la formazione');
            }
        };

        caricaFormazione();
    }, [giornata.id, utente.id]);

    const ruoloDi = (id) => {
        return rosa.find((g) => g.id === id)?.ruolo;
    };

    const conta = (ruolo) => {
        return titolari.filter((id) => ruoloDi(id) === ruolo).length;
    };

    const schiera = (id, dove) => {
        const nuoviTitolari = titolari.filter((x) => x !== id);
        const nuovaPanchina = panchina.filter((x) => x !== id);

        if (dove === 'titolare') {
            nuoviTitolari.push(id);
        }
        if (dove === 'panchina') {
            nuovaPanchina.push(id);
        }

        setTitolari(nuoviTitolari);
        setPanchina(nuovaPanchina);
    };

    const salvaFormazione = async () => {
        setErrore('');
        setSuccesso('');

        if (!modulo) {
            setErrore('Scegli il modulo');
            return;
        }

        const giocatori = titolari
            .map((id) => ({ giocatore_reale_id: id, titolare: true}))
            .concat(panchina.map((id, i) => ({ giocatore_reale_id: id, titolare: false, ordine_panchina: i + 1})));

        try {
            const res = await fetch('http://localhost:3001/formazioni', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    utente_id: utente.id,
                    giornata_id: giornata.id,
                    modulo: modulo,
                    giocatori: giocatori
                }),
            });

            if (res.status === 200 || res.status === 201) {
                setSuccesso('Formazione salvata');
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

            <h1>Formazione - {lega.nome}</h1>
            <h2>Giornata {giornata.numero}</h2>

            {errore && <p className="errore">{errore}</p>}
            {successo && <p className="successo">{successo}</p>}

            <select value={modulo} onChange={(e) => setModulo(e.target.value)}>
                <option value="">Scegli il modulo</option>
                {Object.keys(moduli).map((m) => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>

            <p>Titolari: {titolari.length}/11 - Panchina: {panchina.length}</p>

            {modulo && (
                <p>
                    Portiere {conta('portiere')}/1 -
                    Difensori {conta('difensore')}/{moduli[modulo].difensori} -
                    Centrocampisti {conta('centrocampista')}/{moduli[modulo].centrocampisti} -
                    Attaccanti {conta('attaccante')}/{moduli[modulo].attaccanti}
                </p>
            )}

            <ul>
                {rosa.map((g) => (
                    <li key={g.id}>
                        {g.cognome} {g.nome} ({g.ruolo}) -{' '}
                        {titolari.includes(g.id) && 'Titolare'}
                        {panchina.includes(g.id) && 'Panchina ' + (panchina.indexOf(g.id) + 1)}
                        {!titolari.includes(g.id) && !panchina.includes(g.id) && 'Fuori'}
                        {' '}
                        <button type="button" onClick={() => schiera(g.id, 'titolare')}>Titolare</button>
                        <button type="button" onClick={() => schiera(g.id, 'panchina')}>Panchina</button>
                        <button type="button" onClick={() => schiera(g.id, 'fuori')}>Fuori</button>
                    </li>
                ))}
            </ul>

            <button type="button" onClick={salvaFormazione}>Salva formazione</button>
        </div>
    );
}

export default Formazione;