const express = require('express');
const Transaction = require('../models/Transaction');
const { authentifier } = require('./auth');

const router = express.Router();

// Middleware d'authentification appliqué à toutes les routes
router.use(authentifier);

// Ajouter une transaction
router.post('/', (req, res) => {
  const { type, montant, categorie, description, date } = req.body;

  if (!type || !montant || !categorie || !date) {
    return res.status(400).json({ message: 'Tous les champs obligatoires sont requis' });
  }

  Transaction.create(
    req.utilisateur.id,
    type,
    montant,
    categorie,
    description || '',
    date,
    (err, id) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de l\'ajout de la transaction' });
      }
      res.status(201).json({ message: 'Transaction ajoutée', id });
    }
  );
});

// Lister toutes les transactions
router.get('/', (req, res) => {
  const filtres = {
    type: req.query.type,
    categorie: req.query.categorie,
    debut: req.query.debut,
    fin: req.query.fin
  };

  // Si l'utilisateur demande les transactions d'un autre membre (pour la vue famille)
  const utilisateurId = req.query.membre_id ? req.query.membre_id : req.utilisateur.id;

  Transaction.getAll(utilisateurId, filtres, (err, transactions) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la récupération des transactions' });
    }
    res.json({ transactions });
  });
});

// Statistiques
router.get('/stats', (req, res) => {
  const utilisateurId = req.query.membre_id ? req.query.membre_id : req.utilisateur.id;

  Transaction.getStats(utilisateurId, (err, stats) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
    }

    const resultat = {
      depense: 0,
      revenu: 0,
      epargne: 0
    };

    stats.forEach(s => {
      resultat[s.type] = s.total || 0;
    });

    res.json(resultat);
  });
});

// Supprimer une transaction
router.delete('/:id', (req, res) => {
  Transaction.delete(req.params.id, (err, changes) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
    if (changes === 0) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }
    res.json({ message: 'Transaction supprimée' });
  });
});

module.exports = router;