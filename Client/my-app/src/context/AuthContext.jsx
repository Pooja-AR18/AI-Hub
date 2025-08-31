import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawUser = localStorage.getItem('akh_user');
    const savedToken = localStorage.getItem('akh_token');
    if (rawUser && savedToken) {
      setUser(JSON.parse(rawUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('akh_user', JSON.stringify(user));
      localStorage.setItem('akh_token', token);
    } else {
      localStorage.removeItem('akh_user');
      localStorage.removeItem('akh_token');
    }
  }, [user, token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    setUser(res.user);
    setToken(res.token);
    navigate('/');
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    setUser(res.user);
    setToken(res.token);
    navigate('/');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
