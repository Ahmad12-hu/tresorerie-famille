# 💰 Trésorière Familiale

Une application simple et conviviale pour gérer les dépenses, les revenus et les économies de toute la famille.

## 🎯 Fonctionnalités

- **Gestion des utilisateurs** : chaque membre de la famille a son propre compte
- **Dépenses** : enregistrement des dépenses avec catégorie, date, description et qui a payé
- **Revenus** : suivi des rentrées d'argent
- **Économies** : suivi des versements sur compte épargne
- **Objectifs d'épargne** : définissez des cibles (vacances, voiture, études...) et suivez la progression
- **Tableau de bord** : solde total, dépenses du mois, répartition par catégorie
- **Historique** : liste complète des transactions filtrables par mois, membre ou catégorie

## 🛠 Stack technique

- **Backend** : Node.js + Express + SQLite
- **Frontend** : HTML/CSS/JavaScript pur (sans framework)
- **Base de données** : SQLite (fichier unique, facile à sauvegarder)

## 📦 Installation

### Prérequis
- [Node.js](https://nodejs.org/) (version 14 ou supérieure)

### Démarrage rapide

```bash
# Cloner le repository
git clone https://github.com/Ahmad12-hu/tresorerie-famille.git
cd tresorerie-famille

# Installer les dépendances backend
cd backend
npm install

# Lancer le serveur
npm start
```

Le serveur démarre sur `http://localhost:3000`.

## 📁 Structure du projet

```
tresorerie-famille/
├── backend/           # API Node.js + Express
│   ├── server.js      # Point d'entrée du serveur
│   ├── database.js    # Configuration SQLite
│   ├── models/        # Modèles de données
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Goal.js
│   └── routes/        # Routes API
│       ├── auth.js
│       ├── transactions.js
│       └── goals.js
├── frontend/          # Interface utilisateur
│   ├── index.html     # Page d'accueil
│   ├── login.html     # Connexion/Inscription
│   ├── dashboard.html # Tableau de bord
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       └── auth.js
└── .gitignore
```

## 👨‍👩‍👧‍👦 Utilisation familiale

1. Chaque membre de la famille crée son propre compte
2. Connectez-vous et commencez à ajouter vos dépenses
3. Suivez vos économies et vos objectifs d'épargne ensemble
4. Consultez le tableau de bord pour voir la situation financière globale

## 📄 Licence

MIT - Libre d'utilisation pour votre famille.

## 🤝 Contribuer

Ce projet est fait pour votre famille. N'hésitez pas à l'adapter selon vos besoins !

---

*Fait par Amadou ka pour la famille*
