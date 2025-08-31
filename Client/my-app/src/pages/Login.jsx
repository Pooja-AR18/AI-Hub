import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: '40px auto' }}>
        <h2>Login</h2>
        <form onSubmit={onSubmit} className="row">
          <div className="col">
            <label>Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <label>Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="small" style={{ color: '#ff9b9b' }}>{error}</div>}
          <button className="btn" disabled={loading}>{loading ? 'Loading…' : 'Login'}</button>
        </form>
        <hr className="sep"/>
        <div className="small">
          No account? <Link className="link" to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
