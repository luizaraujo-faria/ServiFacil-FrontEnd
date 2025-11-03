import React, { createContext, useContext, useState, useEffect } from "react";

// Criação do contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Componente provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  // Estados de autenticação
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Função de login
  const login = async (email, password) => {
    try {
      // Mock de login - em produção, fazer POST para http://localhost:8080/api/login
      const mockUser = {
        id: 1,
        nome: "Usuário Teste",
        email: email,
      };
      const mockToken = "mock-jwt-token-" + Date.now();

      // Simular delay de requisição
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUser(mockUser);
      setToken(mockToken);

      // Salvar no localStorage para persistência
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", mockToken);

      return { success: true, user: mockUser, token: mockToken };
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, error: error.message };
    }
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Função para buscar usuários
  const fetchUsers = async () => {
    try {
      // Mock: simula um pequeno atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Primeiro tenta carregar uma lista salva (se houver)
      let users = [];
      try {
        const saved = localStorage.getItem("mock_users");
        users = saved ? JSON.parse(saved) : [];
      } catch (_) {
        users = [];
      }

      // Se não houver lista salva, usa uma lista padrão mockada
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

  // Verificar se há dados salvos no localStorage ao inicializar
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

  // Valor do contexto
  const value = {
    user,
    token,
    login,
    logout,
    fetchUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Exportação do contexto para uso direto (se necessário)
export { AuthContext };
