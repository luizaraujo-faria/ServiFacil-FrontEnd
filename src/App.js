import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import Privacy from "./pages/Privacy";
import Help from "./pages/Help";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import ProfessionalForm from "./pages/ProfessionalForm";
import Recuperation from "./pages/Recuperation";
import Terms from "./pages/Terms";
import "./styles/App.css";

function App() {
  // Detecta se estamos no GitHub Pages
  const isGitHubPages = window.location.hostname.includes("github.io");

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router
          basename={isGitHubPages ? "/servifacil---login-e-pagamento" : "/"}
        >
          <Routes>
            {/* ROTAS PÚBLICAS (SEM LAYOUT) */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<CreateAccount />} />
            <Route path="/cadastro-profissional" element={<ProfessionalForm />} />
            <Route path="/recuperacao" element={<Recuperation />} />
            <Route path="/termos" element={<Terms />} />

            {/* ROTAS PRIVADAS (COM LAYOUT E AUTENTICAÇÃO) */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <PrivateRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/editar-perfil"
              element={
                <PrivateRoute>
                  <Layout>
                    <EditProfile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/pagamentos"
              element={
                <PrivateRoute>
                  <Layout>
                    <Payments />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/notificacoes"
              element={
                <PrivateRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/privacidade"
              element={
                <PrivateRoute>
                  <Layout>
                    <Privacy />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/ajuda"
              element={
                <PrivateRoute>
                  <Layout>
                    <Help />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* REDIRECIONAMENTO PARA LOGIN SE ROTA NÃO ENCONTRADA */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
