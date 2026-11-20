const API_URL = 'http://localhost:3000/api';
const TOKEN_KEY = 'tresorerie_token';

// Vérifier l'authentification au chargement
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token && window.location.pathname.includes('login.html')) {
    window.location.href = 'dashboard.html';
    return;
  }

  if (!token && window.location.pathname.includes('dashboard.html')) {
    window.location.href = 'login.html';
    return;
  }

  if (window.location.pathname.includes('dashboard.html')) {
    initDashboard();
  }
});

// Initialiser le dashboard
function initDashboard() {
  const token = localStorage.getItem(TOKEN_KEY);

  const payload = JSON.parse(atob(token.split('.')[1]));
  document.getElementById('nav-user').textContent = 'Bonjour ' + payload.prenom + ' ' + payload.nom;

  document.getElementById('btn-deconnexion').addEventListener('click', () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = 'login.html';
  });

  chargerStats();
  chargerTransactions();
  chargerObjectifs();
  chargerMembres();

  document.getElementById('form-transaction').addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('tx-type').value;
    const montant = parseFloat(document.getElementById('tx-montant').value);
    const categorie = document.getElementById('tx-categorie').value;
    const description = document.getElementById('tx-description').value;
    const date = document.getElementById('tx-date').value || new Date().toISOString().split('T')[0];

    try {
      const response = await fetch(API_URL + '/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ type, montant, categorie, description, date })
      });

      if (response.ok) {
        document.getElementById('form-transaction').reset();
        document.getElementById('tx-date').value = new Date().toISOString().split('T')[0];
        chargerStats();
        chargerTransactions();
        showAlert('Transaction ajoutée avec succès !', 'success');
      } else {
        const data = await response.json();
        showAlert(data.message || 'Erreur', 'error');
      }
    } catch (err) {
      showAlert('Erreur de connexion', 'error');
    }
  });

  document.getElementById('tx-date').value = new Date().toISOString().split('T')[0];
}

// Charger les statistiques
async function chargerStats(membreId = null) {
  const token = localStorage.getItem(TOKEN_KEY);
  const url = membreId ? API_URL + '/transactions/stats?membre_id=' + membreId : API_URL + '/transactions/stats';

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();

    document.getElementById('stat-depense').textContent = (data.depense || 0).toFixed(2) + ' €';
    document.getElementById('stat-revenu').textContent = (data.revenu || 0).toFixed(2) + ' €';
    document.getElementById('stat-epargne').textContent = (data.epargne || 0).toFixed(2) + ' €';
    document.getElementById('stat-solde').textContent = ((data.revenu || 0) - (data.depense || 0)).toFixed(2) + ' €';
  } catch (err) {
    console.error('Erreur stats:', err);
  }
}

// Charger les transactions
async function chargerTransactions(membreId = null) {
  const token = localStorage.getItem(TOKEN_KEY);
  const url = membreId ? API_URL + '/transactions?membre_id=' + membreId : API_URL + '/transactions';

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    const tbody = document.getElementById('tbody-transactions');
    tbody.innerHTML = '';

    (data.transactions || []).forEach(tx => {
      const tr = document.createElement('tr');
      const signe = tx.type === 'depense' ? '-' : '+';n      tr.innerHTML = `
        <td>${tx.date}</td>
        <td><span class="badge badge-${tx.type}">${tx.type}</span></td>
        <td>${tx.categorie}</td>
        <td>${tx.description}</td>
        <td>${signe} ${tx.montant.toFixed(2)} €</td>
        <td><button class="btn btn-danger btn-sm" onclick="supprimerTransaction(${tx.id})">Supprimer</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Erreur transactions:', err);
  }
}

// Filtrer les transactions
function filterTransactions() {
  const type = document.getElementById('filtre-type').value;
  const categorie = document.getElementById('filtre-categorie').value;
  const token = localStorage.getItem(TOKEN_KEY);
  let url = API_URL + '/transactions?';
  if (type) url += 'type=' + type + '&';
  if (categorie) url += 'categorie=' + categorie + '&';

  fetch(url, {
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(r => r.json())
    .then(data => {
      const tbody = document.getElementById('tbody-transactions');
      tbody.innerHTML = '';
      (data.transactions || []).forEach(tx => {
        const tr = document.createElement('tr');
        const signe = tx.type === 'depense' ? '-' : '+';
        tr.innerHTML = `
          <td>${tx.date}</td>
          <td><span class="badge badge-${tx.type}">${tx.type}</span></td>
          <td>${tx.categorie}</td>
          <td>${tx.description}</td>
          <td>${signe} ${tx.montant.toFixed(2)} €</td>
          <td><button class="btn btn-danger btn-sm" onclick="supprimerTransaction(${tx.id})">Supprimer</button></td>
        `;
        tbody.appendChild(tr);
      });
    });
}

// Supprimer une transaction
async function supprimerTransaction(id) {
  if (!confirm('Voulez-vous vraiment supprimer cette transaction ?')) return;
  const token = localStorage.getItem(TOKEN_KEY);

  try {
    const response = await fetch(API_URL + '/transactions/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (response.ok) {
      chargerStats();
      chargerTransactions();
      showAlert('Transaction supprimée', 'success');
    }
  } catch (err) {
    showAlert('Erreur', 'error');
  }
}

// Charger les objectifs
async function chargerObjectifs() {
  const token = localStorage.getItem(TOKEN_KEY);

  try {
    const response = await fetch(API_URL + '/goals', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    const container = document.getElementById('objectifs-liste');
    container.innerHTML = '';

    (data.objectifs || []).forEach(obj => {
      const pourcentage = Math.min((obj.montant_actuel / obj.montant_cible) * 100, 100);
      const carte = document.createElement('div');
      carte.className = 'goal-card';
      carte.innerHTML = `
        <h4>${obj.nom}</h4>
        <p>${obj.montant_actuel.toFixed(2)} € / ${obj.montant_cible.toFixed(2)} €</p>
        <div class="goal-progress">
          <div class="goal-progress-bar" style="width: ${pourcentage}%"></div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${pourcentage.toFixed(0)}% accompli</p>
      `;
      container.appendChild(carte);
    });
  } catch (err) {
    console.error('Erreur objectifs:', err);
  }
}

// Charger les membres de la famille
async function chargerMembres() {
  const token = localStorage.getItem(TOKEN_KEY);

  try {
    const response = await fetch(API_URL + '/auth/membres', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    const container = document.getElementById('famille-liste');
    container.innerHTML = '';

    (data.membres || []).forEach(membre => {
      const carte = document.createElement('div');
      carte.className = 'membre-card';
      carte.innerHTML = `
        <h4>${membre.prenom} ${membre.nom}</h4>
        <p>${membre.email}</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${membre.role}</p>
      `;
      container.appendChild(carte);
    });
  } catch (err) {
    console.error('Erreur membres:', err);
  }
}

// Navigation entre sections
function showSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
  document.getElementById('section-' + sectionId).classList.add('active');
  event.target.classList.add('active');

  if (sectionId === 'overview') {
    chargerStats();
    chargerTransactions();
  }
}

// Formulaire objectif
function showAddGoalForm() {
  document.getElementById('form-objectif').classList.remove('hidden');
}

function hideAddGoalForm() {
  document.getElementById('form-objectif').classList.add('hidden');
}

// Soumettre le formulaire d'objectif
document.getElementById('form-ajouter-objectif').addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem(TOKEN_KEY);
  const nom = document.getElementById('goal-nom').value;
  const montant_cible = parseFloat(document.getElementById('goal-montant').value);
  const date_limite = document.getElementById('goal-date').value;

  try {
    const response = await fetch(API_URL + '/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ nom, montant_cible, date_limite })
    });

    if (response.ok) {
      document.getElementById('form-ajouter-objectif').reset();
      hideAddGoalForm();
      chargerObjectifs();
      showAlert('Objectif créé !', 'success');
    } else {
      const data = await response.json();
      showAlert(data.message || 'Erreur', 'error');
    }
  } catch (err) {
    showAlert('Erreur de connexion', 'error');
  }
});

// Alerte
function showAlert(text, type) {
  const alert = document.createElement('div');
  alert.className = 'alert alert-' + type;
  alert.textContent = text;
  alert.style.position = 'fixed';
  alert.style.top = '20px';
  alert.style.right = '20px';
  alert.style.zIndex = '1000';
  alert.style.padding = '1rem 1.5rem';
  alert.style.borderRadius = '8px';
  alert.style.color = 'white';
  alert.style.background = type === 'success' ? '#10b981' : '#ef4444';
  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 3000);
}