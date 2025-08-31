import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// A component to protect routes that require authentication
export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
