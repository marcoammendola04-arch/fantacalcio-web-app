import { useState } from 'react';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import UserDashboard from './components/UserDashboard.jsx';

function App(){
  const [pagina, setPagina] = useState('login');
  const [utenteLoggato, setUtenteLoggato] = useState(() => {
    const salvato = localStorage.getItem('utente');
    return salvato ? JSON.parse(salvato) : null;
  });

  const effettuaLogout = () => {
    localStorage.removeItem('utente');
    setUtenteLoggato(null);
    setPagina('login');
  };

  if (utenteLoggato) {
    if (utenteLoggato.ruolo === 'admin') {
      return (<AdminDashboard 
                utente={utenteLoggato}
                onLogout={effettuaLogout} 
              />
            );
    } else {
      return (<UserDashboard 
                utente={utenteLoggato}
                onLogout={effettuaLogout} 
              />
            );
    }
  }

  return (
    <>
      {pagina === 'login' && (
        <Login
          onLoginSuccess={(utente) => setUtenteLoggato(utente)}
          onVaiARegistrazione={() => setPagina('registrazione')} 
        />
      )}

      {pagina === 'registrazione' && (
        <Register
          onVaiALogin={() => setPagina('login')}
        />
      )}
    </>
  );
}

export default App;