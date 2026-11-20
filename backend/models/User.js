const db = require('../database');

const User = {
  create: (nom, prenom, email, motDePasse, callback) => {
    const sql = 'INSERT INTO users (nom, prenom, email, mot_de_passe) VALUES (?, ?, ?, ?)';
    db.run(sql, [nom, prenom, email, motDePasse], function(err) {
      callback(err, this.lastID);
    });
  },

  findByEmail: (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      callback(err, row);
    });
  },

  findById: (id, callback) => {
    const sql = 'SELECT id, nom, prenom, email, role, date_creation FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      callback(err, row);
    });
  },

  getAll: (callback) => {
    const sql = 'SELECT id, nom, prenom, email, role, date_creation FROM users ORDER BY nom';
    db.all(sql, [], (err, rows) => {
      callback(err, rows);
    });
  }
};

module.exports = User;