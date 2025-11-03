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
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import Privacy from "./pages/Privacy";
import Help from "./pages/Help";
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
            {/* REDIRECIONAMENTO LOCAL */}
            {!isGitHubPages && (
              <Route path="*" element={<Navigate to="/" replace />} />
            )}

            {/* ROTAS PRINCIPAIS */}
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/perfil"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route
              path="/editar-perfil"
              element={
                <Layout>
                  <EditProfile />
                </Layout>
              }
            />
            <Route
              path="/pagamentos"
              element={
                <Layout>
                  <Payments />
                </Layout>
              }
            />
            <Route
              path="/notificacoes"
              element={
                <Layout>
                  <Notifications />
                </Layout>
              }
            />
            <Route
              path="/privacidade"
              element={
                <Layout>
                  <Privacy />
                </Layout>
              }
            />
            <Route
              path="/ajuda"
              element={
                <Layout>
                  <Help />
                </Layout>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
