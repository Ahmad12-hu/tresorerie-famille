const db = require('../database');

const Goal = {
  create: (utilisateurId, nom, montantCible, dateLimite, callback) => {
    const sql = `INSERT INTO objectifs (utilisateur_id, nom, montant_cible, montant_actuel, date_limite) 
                 VALUES (?, ?, ?, 0, ?)`;
    db.run(sql, [utilisateurId, nom, montantCible, dateLimite], function(err) {
      callback(err, this.lastID);
    });
  },

  getAll: (utilisateurId, callback) => {
    const sql = `SELECT * FROM objectifs WHERE utilisateur_id = ? ORDER BY date_creation DESC`;
    db.all(sql, [utilisateurId], (err, rows) => {
      callback(err, rows);
    });
  },

  getById: (id, callback) => {
    const sql = 'SELECT * FROM objectifs WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      callback(err, row);
    });
  },

  updateMontant: (id, montantActuel, callback) => {
    const sql = 'UPDATE objectifs SET montant_actuel = ? WHERE id = ?';
    db.run(sql, [montantActuel, id], function(err) {
      callback(err, this.changes);
    });
  },

  delete: (id, callback) => {
    const sql = 'DELETE FROM objectifs WHERE id = ?';
    db.run(sql, [id], function(err) {
      callback(err, this.changes);
    });
  }
};

module.exports = Goal;