import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook personalizado para gerenciar autenticação
 * @returns {Object} Dados e funções de autenticação
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    const userEmail = localStorage.getItem('userEmail');

    if (token && userId && userType) {
      setUser({
        id: userId,
        type: userType,
        email: userEmail,
      });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  const isProfessional = () => {
    return user?.type === 'Profissional';
  };

  const isClient = () => {
    return user?.type === 'Cliente';
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isProfessional,
    isClient,
    logout,
    checkAuth,
  };
};
