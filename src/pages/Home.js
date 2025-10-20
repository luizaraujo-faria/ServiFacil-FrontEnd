import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Bem-vindo ao ServiFácil, {user?.nome || "Usuário"}!</h1>
      <p style={{ color: "#666", marginTop: "0.5rem" }}>
        Conecte-se com os melhores profissionais
      </p>
      
      <nav style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#333" }}>
          Acesso Rápido
        </h2>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <li>
            <Link
              to="/perfil"
              style={{
                textDecoration: "none",
                color: "#10b981",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                border: "2px solid #10b981",
                borderRadius: "6px",
                display: "inline-block",
              }}
            >
              Perfil
            </Link>
          </li>
          <li>
            <Link
              to="/editar-perfil"
              style={{
                textDecoration: "none",
                color: "#10b981",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                border: "2px solid #10b981",
                borderRadius: "6px",
                display: "inline-block",
              }}
            >
              Editar Perfil
            </Link>
          </li>
          <li>
            <Link
              to="/pagamentos"
              style={{
                textDecoration: "none",
                color: "#10b981",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                border: "2px solid #10b981",
                borderRadius: "6px",
                display: "inline-block",
              }}
            >
              Pagamentos
            </Link>
          </li>
          <li>
            <Link
              to="/notificacoes"
              style={{
                textDecoration: "none",
                color: "#10b981",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                border: "2px solid #10b981",
                borderRadius: "6px",
                display: "inline-block",
              }}
            >
              Notificações
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
