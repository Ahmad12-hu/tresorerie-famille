const express = require('express');
const Goal = require('../models/Goal');
const { authentifier } = require('./auth');

const router = express.Router();

// Middleware d'authentification appliqué à toutes les routes
router.use(authentifier);

// Ajouter un objectif
router.post('/', (req, res) => {
  const { nom, montant_cible, date_limite } = req.body;

  if (!nom || !montant_cible) {
    return res.status(400).json({ message: 'Nom et montant cible requis' });
  }

  Goal.create(
    req.utilisateur.id,
    nom,
    montant_cible,
    date_limite || null,
    (err, id) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de la création de l\'objectif' });
      }
      res.status(201).json({ message: 'Objectif créé', id });
    }
  );
});

// Lister les objectifs
router.get('/', (req, res) => {
  Goal.getAll(req.utilisateur.id, (err, objectifs) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la récupération des objectifs' });
    }
    res.json({ objectifs });
  });
});

// Mettre à jour le montant d'un objectif
router.put('/:id/montant', (req, res) => {
  const { montant_actuel } = req.body;

  if (montant_actuel === undefined) {
    return res.status(400).json({ message: 'Montant actuel requis' });
  }

  Goal.updateMontant(req.params.id, montant_actuel, (err, changes) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
    if (changes === 0) {
      return res.status(404).json({ message: 'Objectif non trouvé' });
    }
    res.json({ message: 'Objectif mis à jour' });
  });
});

// Supprimer un objectif
router.delete('/:id', (req, res) => {
  Goal.delete(req.params.id, (err, changes) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
    if (changes === 0) {
      return res.status(404).json({ message: 'Objectif non trouvé' });
    }
    res.json({ message: 'Objectif supprimé' });
  });
});

module.exports = router;