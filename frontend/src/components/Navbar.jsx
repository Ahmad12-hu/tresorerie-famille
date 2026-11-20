import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-brand">
          💰 Trésorière Familiale
        </Link>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user">Bonjour {user.prenom}</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}