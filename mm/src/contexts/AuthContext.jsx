import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('user_id');
    const profile = localStorage.getItem('user_profile');
    if (id) {
      setUserId(id);
      if (profile) setUser(JSON.parse(profile));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ userId, user, loading, setUserId, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};