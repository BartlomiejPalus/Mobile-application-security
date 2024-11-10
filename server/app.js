const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express()
const port = 3000

const CryptoJS = require('crypto-js');

app.use(express.json());
const db = new sqlite3.Database('./database/database.db');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).send('Podaj login i hasło');
    }

    const passwordHash = CryptoJS.SHA256(password).toString();

    const stmt = db.prepare('INSERT INTO user (login, password) VALUES (?, ?)');

    stmt.run(login, passwordHash, function(err) {
        if (err) {
          console.log("Podany login jest zajęty: ", err.message);
          return res.status(500).json({
            success: false,
            message: 'Podany login jest zajęty'});
        }
        
        console.log(`User ${login} added with ID: ${this.lastID}`);
        return res.status(201).json({
            success: true,
            message: 'Utworzono konto'});
      });
})

app.post('/login', (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({
            success: false,
            message: 'Podaj hasło i login'
        });
    }

    db.get('SELECT * FROM user WHERE login = ?', [login], (err, row) => {
        if (err) {
            console.log('Błąd podczas pobierania danych z bazy danych: ', err.message);
            return res.status(500).json({
                success: false,
                message: 'Błąd podczas pobierania danych z bazy danych'
            });
        }

        if (!row) {
            return res.status(404).json({
                success: false,
                message: 'Niepoprawne dane logowania'
            });
        }

        const passwordHash = CryptoJS.SHA256(password).toString();

        if (passwordHash === row.password) {
            return res.status(200).json({
                success: true,
                login: row.login,
                message: 'Zalogowano na konto ' + row.login,
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Błędne hasło'
            });
        }
    });
});

app.post('/notes/auth', (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({
            success: false,
            message: 'Podaj hasło i login'
        });
    }

    db.get('SELECT * FROM user WHERE login = ?', [login], (err, row) => {
        if (err) {
            console.log('Błąd podczas pobierania danych z bazy danych:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Błąd podczas pobierania danych z bazy danych'
            });
        }

        if (!row) {
            return res.status(404).json({
                success: false,
                message: 'Niepoprawne dane logowania'
            });
        }

        const passwordHash = CryptoJS.SHA256(password).toString();

        if (passwordHash === row.password) {
            return res.status(200).json({
                success: true
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Błędne hasło'
            });
        }
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})