import React, { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext();


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};


export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  
  const login = async (email, password) => {
    try {
      
      const mockUser = {
        id: 1,
        nome: "Usuário Teste",
        email: email,
      };
      const mockToken = "mock-jwt-token-" + Date.now();

      
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUser(mockUser);
      setToken(mockToken);

      
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", mockToken);

      return { success: true, user: mockUser, token: mockToken };
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, error: error.message };
    }
  };

  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  
  const fetchUsers = async () => {
    try {
      
      await new Promise((resolve) => setTimeout(resolve, 300));

      
      let users = [];
      try {
        const saved = localStorage.getItem("mock_users");
        users = saved ? JSON.parse(saved) : [];
      } catch (_) {
        users = [];
      }

      
      if (!users || users.length === 0) {
        users = [
          { id: 1, nome: "Usuário Teste", email: "teste@example.com" },
          { id: 2, nome: "Maria Silva", email: "maria@example.com" },
          { id: 3, nome: "João Souza", email: "joao@example.com" },
        ];
      }

      return { success: true, users };
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return { success: false, error: error.message };
    }
  };

  
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error("Erro ao recuperar dados do localStorage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  
  const value = {
    user,
    token,
    login,
    logout,
    fetchUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export { AuthContext };
