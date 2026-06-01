import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check if user is already logged in by cookie session
    const loadUser = async () => {
      try {
        const response = await api.get('/users/me');
        const u = response.data.user;
        setUser({ id: u.id || u._id, email: u.email, role: u.role });
      } catch (_error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (payload) => {
    const response = await api.post('/users/login', payload);
    const u = response.data.user;
    setUser({ id: u.id || u._id, email: u.email, role: u.role });
  };

  const register = async (payload) => {
    await api.post('/users/register', payload);
  };

  const logout = async () => {
    await api.post('/users/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return value;
};
