let express = require('express');
let mysql = require('mysql');
let crypto = require('crypto');

let app = express();

app.use(express.json());

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fantacalcio_db'
});

connection.connect(function(err){
    if (err) throw err;
    console.log('Connesso al database MySQL!');
});

connection.on('close', function(err){
    if (err) {
        console.log('Connessione al database persa, riconnessione in corso...');
        connection = mysql.createConnection(connection.config);
        connection.connect(function(errReconnect){
            if (errReconnect) throw errReconnect;
            console.log('Riconnesso al database MySQL!');
        });
    } else {
        console.log('Connessione al database chiusa normalmente.');
    }
});

let moduliValidi = {
    '3-4-3': { difensori: 3, centrocampisti: 4, attaccanti: 3 },
    '3-5-2': { difensori: 3, centrocampisti: 5, attaccanti: 2 },
    '4-3-3': { difensori: 4, centrocampisti: 3, attaccanti: 3 },
    '4-4-2': { difensori: 4, centrocampisti: 4, attaccanti: 2 },
    '4-5-1': { difensori: 4, centrocampisti: 5, attaccanti: 1 },
    '5-3-2': { difensori: 5, centrocampisti: 3, attaccanti: 2 },
    '5-4-1': { difensori: 5, centrocampisti: 4, attaccanti: 1 }
};

let ordineStati = ['da giocare', 'in corso', 'conclusa'];

let maxGiornate = 38;

function soloAdmin(req, res, next){
    let adminId = req.body && req.body.admin_id;

    if (!adminId) {
        res.status(400).send('admin_id mancante');
        return;
    }

    let queryadmin = 'SELECT ruolo FROM utente WHERE id = ?';

    connection.query(queryadmin, [adminId], function(err, result){
        if (err) {
            res.status(500).send('Errore nel controllo dell\'admin');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Utente non trovato');
            return;
        }

        if (result[0].ruolo !== 'admin') {
            res.status(403).send('Operazione riservata agli admin');
            return;
        }

        next();
    });
};

function esisteRiga (tabella, id, callback){
    let query = 'SELECT id FROM ' + tabella + ' WHERE id = ?';

    connection.query(query, [id], function(err, result){
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, result.length > 0);
    });
};

app.get('/', function(req, res){
    res.send('Server Fantacalcio attivo!');
});
    
app.get('/squadre', function(req, res){
    connection.query('SELECT * FROM squadrareale', function(err, result){
        if (err){
            res.status(500).send('Errore del Server');
            return;
        }
        res.status(200).json(result);
    });
});

app.get('/giocatori', function(req, res){
    let query = 'SELECT giocatorereale.id, giocatorereale.nome, giocatorereale.cognome, ' +
                'giocatorereale.ruolo, giocatorereale.quotazione, squadrareale.nome AS squadra ' +
                'FROM giocatorereale JOIN squadrareale ON giocatorereale.squadra_reale_id = squadrareale.id';

    connection.query(query, function(err, result){
        if (err) {
            res.status(500).send('Errore nel recupero dei giocatori');
            return;
        }
        res.status(200).json(result);
    });
});
    
app.post('/register', function(req, res){
    let userData = req.body;

    let nome = typeof userData.nome === 'string' ? userData.nome.trim() : '';
    let cognome = typeof userData.cognome === 'string' ? userData.cognome.trim() : '';
    let email = typeof userData.email === 'string' ? userData.email.trim() : '';
    let password = typeof userData.password === 'string' ? userData.password : '';

    if (nome === '' || cognome === '' || email === '' || password === '') {
        res.status(400).send('Nome, cognome, email e password sono obbligatori');
        return;
    }

    if (nome.length > 50 || cognome.length > 50 || email.length > 100) {
        res.status(400).send('Nome, cognome o email troppo lunghi');
        return;
    }

    let formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email)) {
        res.status(400).send('Formato email non valido');
        return;
    }

    if (password.length < 6) {
        res.status(400).send('La password deve avere almeno 6 caratteri');
        return;
    }

    let queryEsistente = 'SELECT id FROM utente WHERE email = ?';

    connection.query(queryEsistente, [email], function(errEsistente, esistenti){
        if (errEsistente) {
            res.status(500).send('Errore nel controllo dell\'email');
            return;
        }

        if (esistenti.length > 0) {
            res.status(409).send('Email già registrata');
            return;
        }

        let passwordHash = crypto.createHash('sha256').update(userData.password).digest('hex');

        let insertQuery = 'INSERT INTO utente (nome, cognome, email, password, ruolo) VALUES (?, ?, ?, ?, ?)';
        let values = [nome, cognome, email, passwordHash, 'utente'];

        connection.query(insertQuery, values, function(err, result){
            if (err){
                res.status(500).send('Errore durante la registrazione');
                return;
            }
            res.status(201).send('Utente registrato con successo');
        });
    });
});

app.post('/login', function(req, res){
    let loginData = req.body;

    if (typeof loginData.email !== 'string' || !loginData.email.trim() || typeof loginData.password !== 'string' || loginData.password.length === 0) {
        res.status(400).send('Email e password sono obbligatori');
        return;
    }

    let passwordHash = crypto.createHash('sha256').update(loginData.password).digest('hex');

    let selectQuery = 'SELECT * FROM utente WHERE email = ?';

    connection.query(selectQuery, [loginData.email.trim()], function(err, result){
        if (err) {
            res.status(500).send('Errore del Server');
            return;
        }

        if (result.length === 0) {
            res.status(401).send('Email o password errati');
            return;
        }

        let utenteTrovato = result[0];

        if (utenteTrovato.password !== passwordHash){
            res.status(401).send('Email o password errati');
            return;
        }

        res.status(200).json({
            id: utenteTrovato.id,
            nome: utenteTrovato.nome,
            cognome: utenteTrovato.cognome,
            email: utenteTrovato.email,
            ruolo: utenteTrovato.ruolo
        });
    });
});

app.get('/utenti/:id/leghe', function(req, res){
    let utenteId = req.params.id;

    let query = 'SELECT lega.id, lega.nome, lega.budget_iniziale, lega.stato ' +
                'FROM partecipazionelega ' +
                'JOIN lega ON partecipazionelega.lega_id = lega.id ' +
                'WHERE partecipazionelega.utente_id = ?';

    connection.query(query, [utenteId], function(err, result){
        if (err) {
            res.status(500).send('Errore nel recupero delle leghe');
            return;
        }
        res.status(200).json(result);
    });
});

app.post('/leghe', soloAdmin, function(req, res) {

    let legaData = req.body;

    if (typeof legaData.nome !== 'string' || legaData.nome.trim() === '') {
        res.status(400).send('Nome della lega obbligatorio');
        return;
    }

    let budget = Number(legaData.budget_iniziale);

    if (!Number.isInteger(budget) || budget <= 0) {
        res.status(400).send('Budget iniziale non valido');
        return;
    }

    let insertQuery =
        'INSERT INTO lega (nome, id_creatore, budget_iniziale, stato) VALUES (?, ?, ?, ?)';

    let values = [
        legaData.nome.trim(),
        legaData.admin_id,
        budget,
        'in preparazione'
    ];

    connection.query(insertQuery, values, function(err, result) {

        if (err) {
            res.status(500).send('Errore durante la creazione della lega');
            return;
        }

        let nuovaLegaId = result.insertId;

        let insertPartecipazione =
            'INSERT INTO partecipazionelega (utente_id, lega_id) VALUES (?, ?)';

        connection.query(
            insertPartecipazione,
            [legaData.admin_id, nuovaLegaId],
            function(err2, result2) {

                if (err2) {
                    res.status(500).send('Errore durante l\'iscrizione del creatore alla lega');
                    return;
                }

                res.status(201).json({
                    id: nuovaLegaId,
                    nome: legaData.nome.trim()
                });
            }
        );
    });
});

app.get('/leghe/:id/partecipanti', function(req, res){
    let legaId = req.params.id;

    let query = 'SELECT utente.id, utente.nome, utente.cognome ' +
                'FROM partecipazionelega ' +
                'JOIN utente ON partecipazionelega.utente_id = utente.id ' +
                'WHERE partecipazionelega.lega_id = ?';

    connection.query(query, [legaId], function(err, result){
        if (err) {
            res.status(500).send('Errore nel recupero dei partecipanti');
            return;
        }
        res.status(200).json(result);
    });
});

app.get('/leghe/:id/asta', function(req, res){
    let legaId = req.params.id;

    let query = 'SELECT id, stato FROM asta WHERE lega_id = ?';

    connection.query(query, [legaId], function(err, result){
        if (err) {
            res.status(500).send('Errore nel recupero dell\'asta');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Nessuna asta per questa lega');
            return;
        }

        res.status(200).json(result[0]);
    });
});

app.get('/leghe/:id/assegnazioni', function(req, res){
    let legaId = req.params.id;

    let query = 'SELECT assegnazioneasta.utente_id, utente.nome AS utente_nome, utente.cognome AS utente_cognome, ' +
                'giocatorereale.id AS giocatore_id, giocatorereale.nome, giocatorereale.cognome, ' +
                'giocatorereale.ruolo, assegnazioneasta.prezzo_pagato ' +
                'FROM assegnazioneasta ' +
                'JOIN asta ON assegnazioneasta.asta_id = asta.id ' +
                'JOIN utente ON assegnazioneasta.utente_id = utente.id ' +
                'JOIN giocatorereale ON assegnazioneasta.giocatore_reale_id = giocatorereale.id ' +
                'WHERE asta.lega_id = ?';

    connection.query(query, [legaId], function(err, result){
        if (err) {
            res.status(500).send('Errore nel recupero delle assegnazioni');
            return;
        }
        res.status(200).json(result);
    });
});

app.post('/leghe/:id/partecipanti', function(req, res){

    let legaId = req.params.id;
    let utenteId = req.body.utente_id;

    esisteRiga('lega', legaId, function(errLega, esisteLega){
        if (errLega){
            res.status(500).send('Errore nel controllo della lega');
            return;
        }
        if (!esisteLega) {
            res.status(404).send('Lega non trovata');
            return;
        }

        esisteRiga('utente', utenteId, function(errUtente, esisteUtente){
            if (errUtente) {
                res.status(500).send('Errore nel controllo dell\'utente');
                return;
            }
            if (!esisteUtente) {
                res.status(404).send('Utente non trovato');
                return;
            }

            let queryEsistente = 'SELECT id FROM partecipazionelega WHERE utente_id = ? AND lega_id = ?';

            connection.query(queryEsistente, [utenteId, legaId], function(errEsistente, esistenti){
                if (errEsistente) {
                    res.status(500).send('Errore nel controllo dell\'iscrizione');
                    return;
                }
                if (esistenti.length > 0) {
                    res.status(409).send('Utente già iscritto a questa lega');
                    return;
                }

                let insertQuery = 'INSERT INTO partecipazionelega (utente_id, lega_id) VALUES (?, ?)';

                connection.query(insertQuery, [utenteId, legaId], function(err, result){
                    if (err) {
                        res.status(500).send('Errore durante l\'iscrizione alla lega');
                        return;
                    }
                    res.status(201).send('Iscrizione avvenuta con successo');
                });
            });
        });
    });
});

app.post('/leghe/:id/asta', soloAdmin, function(req, res) {
    let legaId = req.params.id;

    esisteRiga('lega', legaId, function(errLega, esisteLega){
        if (errLega) {
            res.status(500).send('Errore nel controllo della lega');
            return;
        }
        if (!esisteLega) {
            res.status(404).send('Lega non trovata');
            return;
        }

        let queryEsistente = 'SELECT id FROM asta WHERE lega_id = ?';

        connection.query(queryEsistente, [legaId], function(errEsistente, esistenti){
            if (errEsistente) {
                res.status(500).send('Errore nel controllo dell\'asta esistente');
                return;
            }
            if (esistenti.length > 0) {
                res.status(409).send('Questa lega ha già un\'asta associata');
                return;
            }

            let insertQuery = 'INSERT INTO asta (lega_id, stato) VALUES (?, ?)';

            connection.query(insertQuery, [legaId, 'in corso'], function(err, result) {
                if (err) {
                    res.status(500).send('Errore durante la creazione dell\'asta');
                    return;
                }

                res.status(201).json({ id: result.insertId, lega_id: legaId, stato: 'in corso' });
            });
        });
    });
});

app.post('/aste/:id/assegnazioni', soloAdmin, function(req, res){
    let astaId = req.params.id;
    let dati = req.body;

    let prezzoRichiesto = Number(dati.prezzo_pagato);

    if (!Number.isInteger(prezzoRichiesto) || prezzoRichiesto <= 0) {
        res.status(400).send('Il prezzo deve essere un numero positivo');
        return;
    }

    let queryBudget = 'SELECT lega.id AS lega_id, lega.budget_iniziale ' +
                      'FROM asta ' +
                      'JOIN lega ON asta.lega_id = lega.id ' +
                      'WHERE asta.id = ?';

    connection.query(queryBudget, [astaId], function(err, budgetResult){
        if (err) {
            res.status(500).send('Errore nel recupero del budget');
            return;
        }

        if (budgetResult.length === 0){
            res.status(404).send('Asta non trovata');
            return;
        }

        let legaId = budgetResult[0].lega_id;
        let budgetIniziale = budgetResult[0].budget_iniziale;

        esisteRiga('utente', dati.utente_id, function(errUtente, esisteUtente){
            if (errUtente) {
                res.status(500).send('Errore nel controllo dell\'utente');
                return;
            }

            if (!esisteUtente) {
                res.status(404).send('Utente non trovato');
                return;
            }

            let queryGiocatore = 'SELECT id, ruolo FROM giocatorereale WHERE id = ?';

            connection.query(queryGiocatore, [dati.giocatore_reale_id], function(errGiocatore, giocatoreResult){
                if (errGiocatore) {
                    res.status(500).send('Errore nel controllo del giocatore');
                    return;
                }

                if (giocatoreResult.length === 0) {
                    res.status(404).send('Giocatore non trovato');
                    return;
                }

                let queryPartecipazione = 'SELECT id FROM partecipazionelega ' +
                                          'WHERE utente_id = ? AND lega_id = ?';

                connection.query(queryPartecipazione, [dati.utente_id, legaId], function(errPartecipazione, partecipazioneResult){
                    if (errPartecipazione) {
                        res.status(500).send('Errore nel controllo della partecipazione alla lega');
                        return;
                    }

                    if (partecipazioneResult.length === 0) {
                        res.status(409).send('L\'utente non partecipa a questa lega');
                        return;
                    }

                    let queryAssegnazione = 'SELECT id FROM assegnazioneasta ' +
                                            'WHERE asta_id = ? AND giocatore_reale_id = ?';

                    connection.query(queryAssegnazione, [astaId, dati.giocatore_reale_id], function(errAssegnazione, assegnazioneResult){
                        if (errAssegnazione) {
                            res.status(500).send('Errore nel controllo dell\'assegnazione');
                            return;
                        }

                        if (assegnazioneResult.length > 0) {
                            res.status(409).send('Giocatore già assegnato in questa asta');
                            return;
                        }

                        let querySpeso = 'SELECT SUM(prezzo_pagato) AS totale_speso ' +
                                         'FROM assegnazioneasta ' +
                                         'WHERE asta_id = ? AND utente_id = ?';

                        connection.query(querySpeso, [astaId, dati.utente_id], function(errSpeso, spesoResult){
                            if (errSpeso) {
                                res.status(500).send('Errore nel calcolo della spesa');
                                return;
                            }

                            let totaleSpeso = Number(spesoResult[0].totale_speso) || 0;

                            if (totaleSpeso + prezzoRichiesto > budgetIniziale) {
                                res.status(400).send('Budget insufficiente per questa assegnazione');
                                return;
                            }

                            let limitiRuolo = {
                                'portiere': 3,
                                'difensore': 8,
                                'centrocampista': 8,
                                'attaccante': 6
                            };

                            let ruoloGiocatore = giocatoreResult[0].ruolo;
                            let limite = limitiRuolo[ruoloGiocatore];

                            let queryConteggio = 'SELECT COUNT(*) AS totale ' +
                                                 'FROM assegnazioneasta aa ' +
                                                 'JOIN asta a ON aa.asta_id = a.id ' +
                                                 'JOIN giocatorereale g ON aa.giocatore_reale_id = g.id ' +
                                                 'WHERE a.lega_id = ? AND aa.utente_id = ? AND g.ruolo = ?';

                            connection.query(queryConteggio, [legaId, dati.utente_id, ruoloGiocatore], function(errConteggio, conteggioResult){
                                if (errConteggio) {
                                    res.status(500).send('Errore nel controllo del numero dei giocatori per ruolo');
                                    return;
                                }

                                let totaleRuolo = Number(conteggioResult[0].totale);

                                if (totaleRuolo >= limite) {
                                    res.status(409).send('Limite massimo raggiunto per il ruolo: ' + ruoloGiocatore);
                                    return;
                                }

                                let insertQuery = 'INSERT INTO assegnazioneasta ' +
                                              '(asta_id, giocatore_reale_id, utente_id, prezzo_pagato) ' +
                                              'VALUES (?, ?, ?, ?)';

                                let values = [
                                    astaId,
                                    dati.giocatore_reale_id,
                                    dati.utente_id,
                                    prezzoRichiesto
                                ];

                                connection.query(insertQuery, values, function(err, result){
                                    if (err) {
                                        res.status(500).send('Errore durante l\'assegnazione');
                                        return;
                                    }

                                    res.status(201).json({
                                        id: result.insertId,
                                        messaggio: 'Giocatore assegnato con successo'
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

app.get('/leghe/:legaId/utenti/:utenteId/rosa', function(req, res){
    let legaId = req.params.legaId;
    let utenteId = req.params.utenteId;

    let query = 'SELECT giocatorereale.id, giocatorereale.nome, giocatorereale.cognome, ' +
                'giocatorereale.ruolo, assegnazioneasta.prezzo_pagato ' +
                'FROM assegnazioneasta ' +
                'JOIN asta ON assegnazioneasta.asta_id = asta.id ' +
                'JOIN giocatorereale ON assegnazioneasta.giocatore_reale_id = giocatorereale.id ' +
                'WHERE asta.lega_id = ? AND assegnazioneasta.utente_id = ?';

    connection.query(query, [legaId, utenteId], function(err, result){
        if (err) {
            res.status(500).send('Errore nel recupero della rosa');
            return;
        }
        res.status(200).json(result);
    });
});

app.post('/leghe/:id/giornate', soloAdmin, function(req, res){
    let legaId = req.params.id;
    let dati = req.body;

    let numeroGiornata = Number(dati.numero);

    if (isNaN(numeroGiornata) || !Number.isInteger(numeroGiornata) || numeroGiornata <= 0) {
        res.status(400).send('Il numero della giornata deve essere un intero positivo');
        return;
    }

    esisteRiga('lega', legaId, function(errLega, esisteLega){
        if (errLega) {
            res.status(500).send('Errore nel controllo della lega');
            return;
        }
        if (!esisteLega) {
            res.status(404).send('Lega non trovata');
            return;
        }

        let queryMassimo = 'SELECT MAX(numero) AS ultimo_numero FROM giornata WHERE lega_id = ?';

        connection.query(queryMassimo, [legaId], function(errMax, maxResult){
            if (errMax) {
                res.status(500).send('Errore nel controllo del numero della giornata');
                return;
            }
            
            let ultimoNumero = maxResult[0].ultimo_numero;
            let numeroAtteso = ultimoNumero ? ultimoNumero + 1 : 1;

            if (numeroAtteso > maxGiornate) {
                res.status(409).send('Limite massimo di ' + maxGiornate + ' giornate raggiunto per questa lega');
                return;
            }

            if (numeroGiornata !== numeroAtteso) {
                res.status(400).send('La prossima giornata da creare deve essere la numero ' + numeroAtteso);
                return;
            }

            let insertQuery = 'INSERT INTO giornata (lega_id, numero, stato) VALUES (?, ?, ?)';
            let values = [legaId, numeroGiornata, 'da giocare'];

            connection.query(insertQuery, values, function(err, result){
                if (err){
                    res.status(500).send('Errore durante la creazione della giornata');
                    return;
                }
                res.status(201).json({ id: result.insertId, lega_id: legaId, numero: numeroGiornata, stato: 'da giocare' });
            });
        });
    });
});

app.post('/formazioni', function(req, res){
    let dati = req.body;
    let giocatori = dati.giocatori;

    if (!moduliValidi[dati.modulo]) {
        res.status(400).send('Modulo non valido');
        return;
    }

    if (!Array.isArray(giocatori)) { 
        res.status(400).send('Elenco giocatori mancante o non valido');
        return;
    }

    let idVisti = []; 
    for (let i in giocatori) {
        let id = giocatori[i].giocatore_reale_id;
        if (idVisti.indexOf(id) !== -1) {
            res.status(400).send('Un giocatore non può comparire più volte nella formazione');
            return;
        }
        idVisti.push(id);
    }

    esisteRiga('utente', dati.utente_id, function(errUtente, esisteUtente){
        if (errUtente){
            res.status(500).send('Errore nel controllo dell\'utente');
            return;
        }

        if (!esisteUtente){
            res.status(404).send('Utente non trovato');
            return;
        }

        let queryGiornata = 'SELECT id, stato FROM giornata WHERE id = ?';

        connection.query(queryGiornata, [dati.giornata_id], function(errGiornata, giornataResult){
            if (errGiornata){
                res.status(500).send('Errore nel controllo della giornata');
                return;
            }

            if (giornataResult.length === 0){
                res.status(404).send('Giornata non trovata');
                return;
            }

            if (giornataResult[0].stato !== 'da giocare') {
                res.status(409).send('Non è più possibile modificare la formazione per questa giornata');
                return;
            }

            let queryRosa = 'SELECT assegnazioneasta.giocatore_reale_id FROM assegnazioneasta ' +
                            'JOIN asta ON assegnazioneasta.asta_id = asta.id ' +
                            'JOIN giornata ON giornata.lega_id = asta.lega_id ' +
                            'WHERE giornata.id = ? AND assegnazioneasta.utente_id = ?';

            connection.query(queryRosa, [dati.giornata_id, dati.utente_id], function(errRosa, rosaResult){
                if (errRosa){
                    res.status(500).send('Errore nel controllo della rosa');
                    return;
                }

                let idGiocatoriPosseduti = [];
                for (let i in rosaResult){
                    idGiocatoriPosseduti.push(rosaResult[i].giocatore_reale_id);
                }

                let tuttiValidi = true;
                for (let i in giocatori){
                    if (idGiocatoriPosseduti.indexOf(giocatori[i].giocatore_reale_id) === -1){
                        tuttiValidi = false;
                    }
                }

                if (!tuttiValidi){
                    res.status(400).send('Uno o più giocatori schierati non appartengono alla tua rosa');
                    return;
                }

                let idTitolari = [];
                for (let i in giocatori) {
                    if (giocatori[i].titolare){
                        idTitolari.push(giocatori[i].giocatore_reale_id);
                    }
                }

                if (idTitolari.length !== 11) {
                    res.status(400).send('La formazione deve avere esattamente 11 titolari');
                    return;
                }

                let queryRuoli = 'SELECT id, ruolo FROM giocatorereale WHERE id IN (?)';

                connection.query(queryRuoli, [idTitolari], function(errRuoli, ruoliResult){
                    if (errRuoli){
                        res.status(500).send('Errore nel controllo dei ruoli');
                        return;
                    }

                    let conteggio = { portiere: 0, difensore: 0, centrocampista: 0, attaccante: 0 };

                    for (let i in ruoliResult) {
                        conteggio[ruoliResult[i].ruolo]++;
                    }

                    let richiesto = moduliValidi[dati.modulo];

                    if (conteggio.portiere !== 1 ||
                        conteggio.difensore !== richiesto.difensori ||
                        conteggio.centrocampista !== richiesto.centrocampisti ||
                        conteggio.attaccante !== richiesto.attaccanti) {

                        res.status(400).send('I titolari schierati non rispettano il modulo ' + dati.modulo);
                        return;
                    }

                    let panchinari = [];

                    for (let i in giocatori) {
                        if (!giocatori[i].titolare) {
                            panchinari.push(giocatori[i]);
                        } else if (giocatori[i].ordine_panchina) {
                            res.status(400).send('Un titolare non può avere un ordine di panchina');
                            return;
                        }
                    }

                    let ordiniUsati = [];
                    let ordiniValidi = true;

                    for (let i in panchinari) {
                        let ordine = panchinari[i].ordine_panchina;

                        if (!ordine || ordine < 1) {
                            ordiniValidi = false;
                        } else if (ordiniUsati.indexOf(ordine) !== -1) {
                            ordiniValidi = false;
                        } else {
                            ordiniUsati.push(ordine);
                        }
                    }

                    if (!ordiniValidi) {
                        res.status(400).send('Gli ordini di panchina devono essere numeri positivi e univoci');
                        return;
                    }

                    ordiniUsati.sort(function(a, b) { return a - b; });

                    for (let i = 0; i < ordiniUsati.length; i++) {
                        if (ordiniUsati[i] !== i + 1) {
                            res.status(400).send('Gli ordini di panchina devono essere consecutivi a partire da 1, senza salti');
                            return;
                        }
                    }

                    let queryEsistente = 'SELECT id FROM formazione WHERE utente_id = ? AND giornata_id = ?';

                    connection.query(queryEsistente, [dati.utente_id, dati.giornata_id], function(errEsistente, esistenti){
                        if (errEsistente){
                            res.status(500).send('Errore nel controllo della formazione esistente');
                            return;
                        }

                        if (esistenti.length > 0){
                            let formazioneId = esistenti[0].id;

                            let deleteGiocatori = 'DELETE FROM formazionegiocatore WHERE formazione_id = ?';

                            connection.query(deleteGiocatori, [formazioneId], function(errDelete){
                                if (errDelete){
                                    res.status(500).send('Errore durante l\'aggiornamento della formazione');
                                    return;
                                }

                                let updateModulo = 'UPDATE formazione SET modulo = ? WHERE id = ?';

                                connection.query(updateModulo, [dati.modulo, formazioneId], function(errUpdate){
                                    if (errUpdate){
                                        res.status(500).send('Errore durante l\'aggiornamento del modulo');
                                        return;
                                    }

                                    inserisciGiocatori(formazioneId, giocatori, res, true);
                                });
                            });
                        } else {
                            let insertFormazione = 'INSERT INTO formazione (utente_id, giornata_id, modulo) VALUES (?, ?, ?)';

                            let valuesFormazione = [
                                dati.utente_id,
                                dati.giornata_id,
                                dati.modulo
                            ];

                            connection.query(insertFormazione, valuesFormazione, function(errInsert, result){
                                if (errInsert){
                                    res.status(500).send('Errore durante la creazione della formazione');
                                    return;
                                }

                                inserisciGiocatori(result.insertId, giocatori, res, false);
                            });
                        }
                    });
                });
            });
        });
    });
});

function inserisciGiocatori(formazioneId, giocatori, res, isUpdate){
    let valori = [];

    for (let i in giocatori) {
        let g = giocatori[i];
        valori.push([formazioneId, g.giocatore_reale_id, g.titolare, g.ordine_panchina || null]);
    }

    let insertQuery = 'INSERT INTO formazionegiocatore ' +
                      '(formazione_id, giocatore_reale_id, titolare, ordine_panchina) ' +
                      'VALUES ?';

    connection.query(insertQuery, [valori], function(err){
        if (err) {
            res.status(500).send('Errore durante il salvataggio dei giocatori');
            return;
        }

        res.status(isUpdate ? 200 : 201).json({
            id: formazioneId,
            messaggio: 'Formazione salvata con successo'
        });
    });
}

app.put('/giornate/:id/stato', soloAdmin, function(req, res){
    let giornataId = req.params.id;
    let dati = req.body;

    if (ordineStati.indexOf(dati.stato) === -1) {
        res.status(400).send('Stato non valido');
        return;
    }

    let queryGiornata = 'SELECT id, stato FROM giornata WHERE id = ?';

    connection.query(queryGiornata, [giornataId], function(errGiornata, giornataResult){
        if (errGiornata) {
            res.status(500).send('Errore nel controllo della giornata');
            return;
        }

        if (giornataResult.length === 0) {
            res.status(404).send('Giornata non trovata');
            return;
        }

        let statoAttuale = giornataResult[0].stato;
        let posizioneAttuale = ordineStati.indexOf(statoAttuale);
        let posizioneNuova = ordineStati.indexOf(dati.stato);

        if (posizioneNuova !== posizioneAttuale + 1) {
            res.status(409).send('Transizione non consentita: da "' + statoAttuale + '" non si può passare a "' + dati.stato + '"');
            return;
        }

        function aggiornaStato() {
            let updateQuery = 'UPDATE giornata SET stato = ? WHERE id = ?';

            connection.query(updateQuery, [dati.stato, giornataId], function(errUpdate){
                if (errUpdate) {
                    res.status(500).send('Errore durante l\'aggiornamento dello stato');
                    return;
                }

                res.status(200).json({
                    id: giornataId,
                    stato: dati.stato
                });
            });
        }

        if (dati.stato !== 'conclusa') {
            aggiornaStato();
            return;
        }

        let queryMancanti = 'SELECT DISTINCT giocatorereale.cognome, giocatorereale.nome ' +
                            'FROM formazionegiocatore ' +
                            'JOIN formazione ON formazionegiocatore.formazione_id = formazione.id ' +
                            'JOIN giocatorereale ON formazionegiocatore.giocatore_reale_id = giocatorereale.id ' +
                            'LEFT JOIN voto ON voto.giocatore_reale_id = formazionegiocatore.giocatore_reale_id ' +
                            'AND voto.giornata_id = formazione.giornata_id ' +
                            'WHERE formazione.giornata_id = ? AND formazionegiocatore.titolare = 1 AND voto.id IS NULL';

        connection.query(queryMancanti, [giornataId], function(errMancanti, mancantiResult){
            if (errMancanti) {
                res.status(500).send('Errore nel controllo dei voti mancanti');
                return;
            }

            if (mancantiResult.length > 0) {
                let nomi = [];
                for (let i in mancantiResult) {
                    nomi.push(mancantiResult[i].cognome + ' ' + mancantiResult[i].nome);
                }

                res.status(409).send('Impossibile concludere la giornata: mancano i voti di ' + nomi.join(', '));
                return;
            }

            aggiornaStato();
        });
    });
});

app.get('/giornate/:id/voti', function(req, res){
    let giornataId = req.params.id;

    let query = 'SELECT giocatore_reale_id, valore FROM voto WHERE giornata_id = ?';

    connection.query(query, [giornataId], function(err, result){
        if (err) {
            res.status(500).send('Errore nel recupero dei voti');
            return;
        }
        res.status(200).json(result);
    });
});

app.get('/formazioni/:formazioneId/punteggio', function(req, res){
    let formazioneId = req.params.formazioneId;

    let queryFormazione = 'SELECT id FROM formazione WHERE id = ?';

    connection.query(queryFormazione, [formazioneId], function(errFormazione, formazioneResult){
        if (errFormazione) {
            res.status(500).send('Errore nel controllo della formazione');
            return;
        }

        if (formazioneResult.length === 0) {
            res.status(404).send('Formazione non trovata');
            return;
        }

        let query = 'SELECT SUM(voto.valore) AS punteggio_totale ' +
                    'FROM formazionegiocatore ' +
                    'JOIN formazione ON formazionegiocatore.formazione_id = formazione.id ' +
                    'JOIN voto ON voto.giocatore_reale_id = formazionegiocatore.giocatore_reale_id AND voto.giornata_id = formazione.giornata_id ' +
                    'WHERE formazionegiocatore.formazione_id = ? AND formazionegiocatore.titolare = 1';

        connection.query(query, [formazioneId], function(err, result){
            if (err) {
                res.status(500).send('Errore nel calcolo del punteggio');
                return;
            }

            let punteggio = Number(result[0].punteggio_totale) || 0;

            res.status(200).json({
                formazione_id: formazioneId,
                punteggio: punteggio
            });
        });
    });
});

app.get('/formazioni/:utenteId/:giornataId', function(req, res){
    let utenteId = req.params.utenteId;
    let giornataId = req.params.giornataId;

    let queryFormazione = 'SELECT * FROM formazione WHERE utente_id = ? AND giornata_id = ?';

    connection.query(queryFormazione, [utenteId, giornataId], function(err, formazioni){
        if (err){
            res.status(500).send('Errore nel recupero della formazione');
            return;
        }

        if (formazioni.length === 0){
            res.status(404).send('Nessuna formazione trovata');
            return;
        }

        let formazione = formazioni[0];

        let queryGiocatori = 'SELECT * FROM formazionegiocatore WHERE formazione_id = ?';

        connection.query(queryGiocatori, [formazione.id], function(err2, giocatori){
            if (err2){
                res.status(500).send('Errore nel recupero dei giocatori della formazione');
                return;
            }

            res.status(200).json({ id: formazione.id, modulo: formazione.modulo, giocatori: giocatori});
        });
    });
});

app.post('/voti', soloAdmin, function(req, res){
    let dati = req.body;

    let valoreNumerico = Number(dati.valore);

    if (isNaN(valoreNumerico)) {
        res.status(400).send('Il voto deve essere un numero');
        return;
    }

    if (valoreNumerico < 0) {
        res.status(400).send('Il voto non può essere negativo');
        return;
    }

    let queryGiocatore = 'SELECT id FROM giocatorereale WHERE id = ?';

    connection.query(queryGiocatore, [dati.giocatore_reale_id], function(errG, giocatoreResult){
        if (errG) {
            res.status(500).send('Errore nel controllo del giocatore');
            return;
        }

        if (giocatoreResult.length === 0) {
            res.status(404).send('Giocatore non trovato');
            return;
        }

        let queryGiornata = 'SELECT id, stato FROM giornata WHERE id = ?';

        connection.query(queryGiornata, [dati.giornata_id], function(errGi, giornataResult){
            if (errGi){
                res.status(500).send('Errore nel controllo della giornata');
                return;
            }
            if (giornataResult.length === 0) {
                res.status(404).send('Giornata non trovata');
                return;
            }

            if (giornataResult[0].stato === 'da giocare') {
                res.status(409).send('Non si possono inserire voti per una giornata non ancora iniziata');
                return;
            }

            let queryEsistente = 'SELECT id FROM voto WHERE giocatore_reale_id = ? AND giornata_id = ?';

            connection.query(queryEsistente, [dati.giocatore_reale_id, dati.giornata_id], function(err, esistenti){
                if (err) {
                    res.status(500).send('Errore nel controllo del voto esistente');
                    return;
                }

                if (esistenti.length > 0) {
                    let updateQuery = 'UPDATE voto SET valore = ? WHERE id = ?';

                    connection.query(updateQuery, [valoreNumerico, esistenti[0].id], function(errUpdate){
                        if (errUpdate) {
                            res.status(500).send('Errore durante l\'aggiornamento');
                            return;
                        }

                        res.status(200).json({ messaggio: 'Voto aggiornato' });
                    });
                } else {
                    let insertQuery = 'INSERT INTO voto (giocatore_reale_id, giornata_id, valore) VALUES (?, ?, ?)';

                    connection.query(insertQuery, [dati.giocatore_reale_id, dati.giornata_id, valoreNumerico], function(errInsert, result){
                        if (errInsert) {
                            res.status(500).send('Errore durante l\'inserimento del voto');
                            return;
                        }

                        res.status(201).json({ id: result.insertId, messaggio: 'Voto inserito' });
                    });
                }
            });
        });
    });
});

app.get('/leghe/:id/classifica', function(req, res){
    let legaId = req.params.id;

    let query = 'SELECT utente.id AS utente_id, utente.nome, utente.cognome, SUM(voto.valore) AS punti_totali ' +
                'FROM formazionegiocatore ' +
                'JOIN formazione ON formazionegiocatore.formazione_id = formazione.id ' +
                'JOIN utente ON formazione.utente_id = utente.id ' +
                'JOIN giornata ON formazione.giornata_id = giornata.id ' +
                'JOIN voto ON voto.giocatore_reale_id = formazionegiocatore.giocatore_reale_id AND voto.giornata_id = formazione.giornata_id ' +
                'WHERE giornata.lega_id = ? AND formazionegiocatore.titolare = 1 ' +
                'GROUP BY utente.id, utente.nome, utente.cognome ' +
                'ORDER BY punti_totali DESC';

    connection.query(query, [legaId], function(err, result){
        if (err) {
            res.status(500).send('Errore nel calcolo della classifica');
            return;
        }

        res.status(200).json(result);
    });
});

app.get('/leghe/:id/giornate', function(req, res){
    let legaId = req.params.id;

    let query = 'SELECT id, numero, stato FROM giornata WHERE lega_id = ? ORDER BY numero';

    connection.query(query, [legaId], function(err, result){
        if (err) {
            res.status(500).send('Errore nel recupero delle giornate');
            return;
        }
        res.status(200).json(result);
    });
});

app.get('/moduli', function(req, res){
    res.status(200).json(moduliValidi);
});

let PORT = 3001;
app.listen(PORT, function(){
    console.log('Server in ascolto su http://localhost:' + PORT);
});