import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function Register() {
const { register } = useAuth();
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');


async function onSubmit(e) {
e.preventDefault();
setError(''); setLoading(true);
try { await register(name, email, password); } catch (e) { setError(e.message); } finally { setLoading(false); }
}


return (
<div className="container">
<div className="card" style={{ maxWidth: 520, margin: '40px auto' }}>
<h2>Register</h2>
<form onSubmit={onSubmit} className="row">
<div className="col"><label>Name</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} required/></div>
<div className="col"><label>Email</label><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/></div>
<div className="col"><label>Password</label><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/></div>
{error && <div className="small" style={{ color: '#ff9b9b' }}>{error}</div>}
<button className="btn" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
</form>
<hr className="sep"/>
<div className="small">Already have an account? <Link className="link" to="/login">Login</Link></div>
</div>
</div>
);
}