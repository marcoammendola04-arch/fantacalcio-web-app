import { useState } from "react";

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errore, setErrore] = useState('');

    const effettuaLogin = async () => {
        if (!email.trim() || !password) {
            setErrore("Inserisci email e password");
            return;
        }

        setErrore('');

        try {
            const res = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password: password }),
            });
        
            if (res.status === 200) {
                const utente = await res.json();
                localStorage.setItem('utente', JSON.stringify(utente));
                props.onLoginSuccess(utente);
            } else {
                const messaggio = await res.text();
                setErrore(messaggio);
            }
        } catch (err) {
            setErrore('Impossibile contattare il server. Riprova più tardi.');
        }
    };

    return (
        <div className="pagina">
            <h1>Login</h1>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}

            />

            <button type="button" onClick={effettuaLogin}>Accedi</button>

            {errore && <p className="errore">{errore}</p>}

            <p>Non hai un account? <button type="button" className="secondario" onClick={props.onVaiARegistrazione}>Registrati</button></p>
        </div>
    );
}

export default Login;