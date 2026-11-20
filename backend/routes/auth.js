const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tresorerie-famille-secret-2026';

// Middleware d'authentification
const authentifier = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Token d\'authentification requis' });
  }

  try {
    const tokenSansBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(tokenSansBearer, JWT_SECRET);
    req.utilisateur = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// Inscription
router.post('/inscription', async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe } = req.body;

    if (!nom || !prenom || !email || !mot_de_passe) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier si l'email existe déjà
    User.findByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      if (user) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      // Hacher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const motDePasseHache = await bcrypt.hash(mot_de_passe, salt);

      // Créer l'utilisateur
      User.create(nom, prenom, email, motDePasseHache, (err, id) => {
        if (err) {
          return res.status(500).json({ message: 'Erreur lors de la création du compte' });
        }

        const token = jwt.sign({ id, email, nom, prenom }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
          message: 'Compte créé avec succès',
          token,
          utilisateur: { id, nom, prenom, email }
        });
      });
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Connexion
router.post('/connexion', (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    User.findByEmail(email, async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const motDePasseValide = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
      if (!motDePasseValide) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Connexion réussie',
        token,
        utilisateur: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email }
      });
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Profil utilisateur
router.get('/profil', authentifier, (req, res) => {
  User.findById(req.utilisateur.id, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json({ utilisateur: user });
  });
});

// Liste des membres de la famille
router.get('/membres', authentifier, (req, res) => {
  User.getAll((err, users) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.json({ membres: users });
  });
});

module.exports = router;