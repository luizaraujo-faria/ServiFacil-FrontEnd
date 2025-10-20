import React, { useEffect, useMemo, useState } from "react";

const defaultState = {
  visibility: "public", // public | clients | private
  onlineStatus: "online", // online | busy | offline
  online: true,
  blockedSearch: "",
  blocked: ["maria.silva", "joao.souza"],
};

const Privacy = () => {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem("privacy_settings");
      return stored ? JSON.parse(stored) : defaultState;
    } catch (_) {
      return defaultState;
    }
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmName, setConfirmName] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("privacy_settings", JSON.stringify(state));
    } catch (_) {}
  }, [state]);

  const filteredBlocked = useMemo(() => {
    const q = state.blockedSearch.trim().toLowerCase();
    if (!q) return state.blocked;
    return state.blocked.filter((u) => u.toLowerCase().includes(q));
  }, [state.blocked, state.blockedSearch]);

  const handleUnblock = (user) => {
    setState((prev) => ({
      ...prev,
      blocked: prev.blocked.filter((u) => u !== user),
    }));
  };

  const handleDownloadData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meus-dados.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const canConfirmDelete = confirmName.trim().length > 0;

  return (
    <div className="editar-perfil" style={{ width: "100%", maxWidth: 900 }}>
      <div className="header-editar" style={{ width: "100%", gap: 12 }}>
        <h1>Privacidade</h1>
        <div className="security-info">
          <i className="fas fa-shield-alt"></i>
          <span>Seus dados estão protegidos e criptografados. Controle quem vê seu perfil e como seus dados são usados.</span>
        </div>
      </div>

      <div className="section-card privacy-section">
        <h2>Visibilidade do Perfil</h2>
        <div
          className="visibility-group"
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <label title="Público: qualquer pessoa pode ver seu portfólio e avaliações.">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={state.visibility === "public"}
              onChange={(e) =>
                setState((p) => ({ ...p, visibility: e.target.value }))
              }
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontWeight: "600" }}>Público</span>
              <small style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                Qualquer pessoa pode ver seu perfil
              </small>
            </div>
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="clients"
              checked={state.visibility === "clients"}
              onChange={(e) =>
                setState((p) => ({ ...p, visibility: e.target.value }))
              }
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontWeight: "600" }}>Somente clientes</span>
              <small style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                Apenas clientes ativos podem ver
              </small>
            </div>
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={state.visibility === "private"}
              onChange={(e) =>
                setState((p) => ({ ...p, visibility: e.target.value }))
              }
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontWeight: "600" }}>Privado</span>
              <small style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                Perfil completamente privado
              </small>
            </div>
          </label>
        </div>
        <div
          className="warning"
          style={{
            textAlign: "left",
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            background: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "8px",
            color: "#92400e",
          }}
        >
          <i
            className="fas fa-info-circle"
            style={{ marginRight: "0.5rem" }}
          ></i>
          <strong>Dica:</strong> Perfis públicos recebem mais propostas de
          trabalho.
        </div>
      </div>

      <div className="section-card privacy-section">
        <h2>Status Online</h2>
        <div
          className="visibility-group"
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <label title="Online: aparece como disponível para novos projetos.">
            <input
              type="radio"
              name="onlineStatus"
              value="online"
              checked={state.onlineStatus === "online"}
              onChange={(e) =>
                setState((p) => ({ ...p, onlineStatus: e.target.value }))
              }
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontWeight: "600" }}>Online</span>
              <small style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                Disponível para novos projetos
              </small>
            </div>
          </label>
          <label>
            <input
              type="radio"
              name="onlineStatus"
              value="busy"
              checked={state.onlineStatus === "busy"}
              onChange={(e) =>
                setState((p) => ({ ...p, onlineStatus: e.target.value }))
              }
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontWeight: "600" }}>Ocupado</span>
              <small style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                Trabalhando em projetos atuais
              </small>
            </div>
          </label>
          <label>
            <input
              type="radio"
              name="onlineStatus"
              value="offline"
              checked={state.onlineStatus === "offline"}
              onChange={(e) =>
                setState((p) => ({ ...p, onlineStatus: e.target.value }))
              }
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontWeight: "600" }}>Offline</span>
              <small style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                Não disponível para novos projetos
              </small>
            </div>
          </label>
        </div>
        <div
          className="warning"
          style={{
            textAlign: "left",
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            background: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "8px",
            color: "#92400e",
          }}
        >
          <i
            className="fas fa-info-circle"
            style={{ marginRight: "0.5rem" }}
          ></i>
          <strong>Dica:</strong> Status online ajuda clientes a saber quando você está disponível.
        </div>
      </div>

      <div className="section-card privacy-section">
        <h2>Usuários Bloqueados</h2>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Buscar usuário bloqueado..."
            value={state.blockedSearch}
            onChange={(e) =>
              setState((p) => ({ ...p, blockedSearch: e.target.value }))
            }
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "0.9rem",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {filteredBlocked.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#6b7280",
                padding: "2rem",
                fontStyle: "italic",
              }}
            >
              {state.blockedSearch.trim()
                ? "Nenhum usuário encontrado"
                : "Nenhum usuário bloqueado"}
            </div>
          ) : (
            filteredBlocked.map((username) => (
              <div
                key={username}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <span style={{ fontWeight: "500" }}>@{username}</span>
                <button
                  onClick={() => handleUnblock(username)}
                  style={{
                    padding: "0.25rem 0.75rem",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Desbloquear
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="section-card privacy-section">
        <h2>Exportar Dados</h2>
        <p style={{ marginBottom: "1rem", color: "#6b7280" }}>
          Baixe uma cópia de todas as suas configurações de privacidade.
        </p>
        <button
          onClick={handleDownloadData}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          <i className="fas fa-download" style={{ marginRight: "0.5rem" }}></i>
          Exportar dados
        </button>
      </div>

      <div className="section-card privacy-section">
        <h2 style={{ color: "#dc2626" }}>Zona de Perigo</h2>
        <p style={{ marginBottom: "1rem", color: "#6b7280" }}>
          Ações irreversíveis que afetam permanentemente sua conta.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          <i className="fas fa-trash" style={{ marginRight: "0.5rem" }}></i>
          Excluir conta
        </button>
      </div>

      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "12px",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#dc2626" }}>
              Confirmar exclusão
            </h3>
            <p style={{ marginBottom: "1rem", color: "#6b7280" }}>
              Esta ação não pode ser desfeita. Digite "CONFIRMAR" para
              prosseguir:
            </p>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder="Digite CONFIRMAR"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmName("");
                }}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => alert("Funcionalidade em desenvolvimento")}
                disabled={!canConfirmDelete}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: canConfirmDelete ? "#dc2626" : "#d1d5db",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: canConfirmDelete ? "pointer" : "not-allowed",
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Privacy;
