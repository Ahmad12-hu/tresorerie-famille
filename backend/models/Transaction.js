const db = require('../database');

const Transaction = {
  create: (utilisateurId, type, montant, categorie, description, date, callback) => {
    const sql = `INSERT INTO transactions (utilisateur_id, type, montant, categorie, description, date) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [utilisateurId, type, montant, categorie, description, date], function(err) {
      callback(err, this.lastID);
    });
  },

  getAll: (utilisateurId, filtres, callback) => {
    let sql = `SELECT t.*, u.nom, u.prenom 
               FROM transactions t 
               JOIN users u ON t.utilisateur_id = u.id`;
    const params = [];

    if (utilisateurId) {
      sql += ' WHERE t.utilisateur_id = ?';
      params.push(utilisateurId);
    }

    if (filtres.type) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' t.type = ?';
      params.push(filtres.type);
    }

    if (filtres.categorie) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' t.categorie = ?';
      params.push(filtres.categorie);
    }

    if (filtres.debut) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' t.date >= ?';
      params.push(filtres.debut);
    }

    if (filtres.fin) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' t.date <= ?';
      params.push(filtres.fin);
    }

    sql += ' ORDER BY t.date DESC, t.date_creation DESC';

    db.all(sql, params, (err, rows) => {
      callback(err, rows);
    });
  },

  getById: (id, callback) => {
    const sql = `SELECT t.*, u.nom, u.prenom 
                 FROM transactions t 
                 JOIN users u ON t.utilisateur_id = u.id 
                 WHERE t.id = ?`;
    db.get(sql, [id], (err, row) => {
      callback(err, row);
    });
  },

  delete: (id, callback) => {
    const sql = 'DELETE FROM transactions WHERE id = ?';
    db.run(sql, [id], function(err) {
      callback(err, this.changes);
    });
  },

  getStats: (utilisateurId, callback) => {
    let sql = `SELECT type, SUM(montant) as total, COUNT(*) as nombre 
               FROM transactions`;
    const params = [];

    if (utilisateurId) {
      sql += ' WHERE utilisateur_id = ?';
      params.push(utilisateurId);
    }

    sql += ' GROUP BY type';

    db.all(sql, params, (err, rows) => {
      callback(err, rows);
    });
  }
};

module.exports = Transaction;