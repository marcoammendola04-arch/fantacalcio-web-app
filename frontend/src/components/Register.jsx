import { useState } from "react";

function Register(props) {
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errore, setErrore] = useState('');
    const [successo, setSuccesso] = useState('');

    const effettuaRegistrazione = async () => {
        setErrore('');
        setSuccesso('');

        if (
            !nome.trim() ||
            !cognome.trim() ||
            !email.trim() ||
            !password
        ) {
            setErrore('Compila tutti i campi');
            return;
        }

        try {

            const res = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: nome.trim(), cognome: cognome.trim(), email: email.trim(), password: password }),
            });

            if (res.status === 201) {
                setErrore('');
                setSuccesso('Registrazione avvenuta con successo! Ora puoi effettuare il login.');
                setNome('');
                setCognome('');
                setEmail('');
                setPassword('');
            } else {
                const messaggio = await res.text();
                setSuccesso('');
                setErrore(messaggio);
            }
        } catch (err) {
            setErrore('Impossibile contattare il server. Riprova più tardi.');
        }
    };

    return (
        <div className="pagina">
            <h1>Registrazione</h1>

            <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            <input type="text" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <button type="button" onClick={effettuaRegistrazione}>Registrati</button>

            {errore && <p className="errore">{errore}</p>}
            {successo && <p className="successo">{successo}</p>}

            <p>Hai già un account? <button type="button" className="secondario" onClick={props.onVaiALogin}>Accedi</button></p>
        </div>
    );
}

export default Register