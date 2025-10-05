import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isActive, onToggle }) => {
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <aside className={`sidebar ${isActive ? "open active" : ""}`}>
        <div
          className="logo"
          role="button"
          tabIndex={0}
          aria-label={isActive ? "Fechar menu" : "Abrir menu"}
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL || ""}/images/logo.png`}
            alt="Logo ServiFácil"
            className="logo-icon"
            onError={(e) => {
              e.currentTarget.src = `${process.env.PUBLIC_URL || ""}/images/logo.png`;
            }}
          />
          <span>ServiFácil</span>
        </div>
        <nav>
          <ul>
            <li className={isActiveRoute("/perfil") ? "active" : ""}>
              <Link to="/perfil">
                <i className="fas fa-user"></i> Perfil
              </Link>
            </li>
            <li className={isActiveRoute("/notificacoes") ? "active" : ""}>
              <Link to="/notificacoes">
                <i className="fas fa-bell"></i> Notificações
              </Link>
            </li>
            <li className={isActiveRoute("/privacidade") ? "active" : ""}>
              <Link to="/privacidade">
                <i className="fas fa-lock"></i> Privacidade
              </Link>
            </li>
            <li className={isActiveRoute("/ajuda") ? "active" : ""}>
              <Link to="/ajuda">
                <i className="fas fa-question-circle"></i> Ajuda & Suporte
              </Link>
            </li>
            <li className={isActiveRoute("/pagamentos") ? "active" : ""}>
              <Link to="/pagamentos">
                <i className="fas fa-credit-card"></i> Pagamentos
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
