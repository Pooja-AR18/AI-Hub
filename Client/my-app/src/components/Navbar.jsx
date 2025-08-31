import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


// Navbar component with navigation links and user actions
export default function Navbar() {
  const { user, logout, loading } = useAuth();
  if (loading) return null;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <nav className="card" style={{ marginBottom: 16 }}>
      <div className="header">
        {/* Left links */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link className="link" to="/">AI Knowledge Hub</Link>
          <Link className="link" to="/search">Search</Link>
          <Link className="link" to="/qa">Team Q&A</Link>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <>
              <span className="small">Hi, {user.name}</span>
              <Link className="btn" to="/new">+ New Doc</Link>
              <button className="btn secondary" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn" to="/login">Login</Link>
              <Link className="btn secondary" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

