const API_BASE = 'http://localhost:3000/api';

export const api = {
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/connexion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, mot_de_passe: password }),
    });
    return res;
  },

  async register(nom, prenom, email, password) {
    const res = await fetch(`${API_BASE}/auth/inscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, prenom, email, mot_de_passe: password }),
    });
    return res;
  },

  async getMembers(token) {
    const res = await fetch(`${API_BASE}/auth/membres`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  },

  async getTransactions(token, params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/transactions?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  },

  async createTransaction(token, data) {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res;
  },

  async deleteTransaction(token, id) {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  },

  async getStats(token, params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/transactions/stats?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  },

  async getGoals(token) {
    const res = await fetch(`${API_BASE}/goals`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  },

  async createGoal(token, data) {
    const res = await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res;
  },

  async deleteGoal(token, id) {
    const res = await fetch(`${API_BASE}/goals/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  };
};