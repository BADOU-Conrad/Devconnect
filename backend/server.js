require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');


const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());


// DB
const db = new sqlite3.Database(path.join(__dirname, 'app.sqlite'));
db.serialize(() => {
db.run(`CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);
});


const SECRET = process.env.JWT_SECRET || 'dev-secret';
const sign = (u) => jwt.sign({ id: u.id, username: u.username }, SECRET, { expiresIn: '1d' });


// Health
app.get('/api/health', (_,res)=> res.json({ok:true}));

// route GET sur la racine
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Inscription (pseudo + mdp)
app.post('/api/auth/register', async (req, res) => {
const { username, password } = req.body || {};
if (!username || !password) return res.status(400).json({ error: 'username & password required' });
const hash = await bcrypt.hash(password, 10);
db.run(`INSERT INTO users(username, password_hash) VALUES(?,?)`, [username, hash], function (err) {
if (err) return res.status(400).json({ error: 'username exists?' });
const user = { id: this.lastID, username };
return res.status(201).json({ user, token: sign(user) });
});
});


// Connexion
app.post('/api/auth/login', (req, res) => {
const { username, password } = req.body || {};
if (!username || !password) return res.status(400).json({ error: 'username & password required' });
db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, u) => {
if (!u) return res.status(400).json({ error: 'Invalid credentials' });
const ok = await bcrypt.compare(password, u.password_hash);
if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
return res.json({ user: { id: u.id, username: u.username }, token: sign(u) });
});
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('API on http://localhost:' + PORT));