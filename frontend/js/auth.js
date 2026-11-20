const API_URL = 'http://localhost:3000/api/auth';
const JWT_SECRET_KEY = 'tresorerie_token';

// Gestion des onglets connexion/inscription
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

  event.target.classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');
}

// Afficher un message
function showMessage(elementId, text, type) {
  const el = document.getElementById(elementId);
  el.textContent = text;
  el.className = 'message ' + type;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

// Connexion
document.getElementById('form-connexion').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email-connexion').value;
  const mot_de_passe = document.getElementById('mot-de-passe-connexion').value;

  try {
    const response = await fetch(API_URL + '/connexion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, mot_de_passe })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem(JWT_SECRET_KEY, data.token);
      window.location.href = 'dashboard.html';
    } else {
      showMessage('message', data.message || 'Erreur de connexion', 'error');
    }
  } catch (err) {
    showMessage('message', 'Erreur de connexion au serveur', 'error');
  }
});

// Inscription
document.getElementById('form-inscription').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nom = document.getElementById('nom').value;
  const prenom = document.getElementById('prenom').value;
  const email = document.getElementById('email-inscription').value;
  const mot_de_passe = document.getElementById('mot-de-passe-inscription').value;

  try {
    const response = await fetch(API_URL + '/inscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, prenom, email, mot_de_passe })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem(JWT_SECRET_KEY, data.token);
      window.location.href = 'dashboard.html';
    } else {
      showMessage('message', data.message || 'Erreur lors de l\'inscription', 'error');
    }
  } catch (err) {
    showMessage('message', 'Erreur de connexion au serveur', 'error');
  }
});