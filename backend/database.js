const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur connexion base de données:', err.message);
  } else {
    console.log('✅ Connecté à la base de données SQLite');
  }
});

db.serialize(() => {
  // Table des utilisateurs
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    role TEXT DEFAULT 'membre',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Table des transactions (dépenses et revenus)
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utilisateur_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('depense', 'revenu', 'epargne')),
    montant REAL NOT NULL,
    categorie TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES users(id)
  )`);

  // Table des objectifs d'épargne
  db.run(`CREATE TABLE IF NOT EXISTS objectifs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utilisateur_id INTEGER NOT NULL,
    nom TEXT NOT NULL,
    montant_cible REAL NOT NULL,
    montant_actuel REAL DEFAULT 0,
    date_limite TEXT,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES users(id)
  )`);

  console.log('✅ Tables de base de données initialisées');
});

module.exports = db;