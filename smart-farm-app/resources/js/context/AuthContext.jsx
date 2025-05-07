import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    const token = res.data.token;
    localStorage.setItem('token', token);
    await getUser();
  };

  const register = async (name, email, password, password_confirmation) => {
    await api.post('/register', {
      name,
      email,
      password,
      password_confirmation,
    });
  };

  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  const getUser = async () => {
    try {
      const res = await api.get('/user'); // You'll need to expose this route
      setUser(res.data);
    } catch (err) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
