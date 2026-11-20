import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Goals from './pages/Goals';
import Family from './pages/Family';

function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/add" element={<AddTransaction />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/famille" element={<Family />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        <ProtectedRoute>
          <AppRouter />
        </ProtectedRoute>
      </main>
    </AuthProvider>
  );
}