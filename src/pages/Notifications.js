import React, { useEffect, useMemo, useState } from "react";

const initialState = {
  proposals: true,
  messages: true,
  projects: false,
  promos: true,
  frequency: "daily",
  channels: ["email", "push"],
};

const Notifications = () => {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("notif_settings");
      return stored ? JSON.parse(stored) : initialState;
    } catch (_) {
      return initialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("notif_settings", JSON.stringify(settings));
    } catch (_) {}
  }, [settings]);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFrequency = (e) => {
    setSettings((prev) => ({ ...prev, frequency: e.target.value }));
  };

  const handleChannel = (channel) => {
    setSettings((prev) => {
      const exists = prev.channels.includes(channel);
      return {
        ...prev,
        channels: exists
          ? prev.channels.filter((c) => c !== channel)
          : [...prev.channels, channel],
      };
    });
  };

  const preview = useMemo(() => {
    return {
      title: "Nova mensagem de cliente",
      lines: [
        "Você recebeu uma nova mensagem.",
        "Abra o app para responder rapidamente.",
      ],
    };
  }, []);

  return (
    <div className="editar-perfil" style={{ width: "100%", maxWidth: 900 }}>
      <div className="header-editar" style={{ width: "100%", gap: 12 }}>
        <h1>Notificações</h1>
        <div className="security-info">
          <i className="fas fa-bell"></i>
          <span>Escolha como e quando receber alertas.</span>
        </div>

        <div className="section-card">
          <h2>Categorias</h2>
          <div
            className="info-block"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <span>Novas propostas</span>
            <label className="switch">
              <input
                type="checkbox"
                aria-label="Ativar notificações de novas propostas"
                checked={settings.proposals}
                onChange={() => handleToggle("proposals")}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div
            className="info-block"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <span>Mensagens de clientes</span>
            <label className="switch">
              <input
                type="checkbox"
                aria-label="Ativar notificações de mensagens"
                checked={settings.messages}
                onChange={() => handleToggle("messages")}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div
            className="info-block"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <span>Atualizações de projeto</span>
            <label className="switch">
              <input
                type="checkbox"
                aria-label="Ativar notificações de atualizações de projeto"
                checked={settings.projects}
                onChange={() => handleToggle("projects")}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div
            className="info-block"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <span>Promoções e novidades</span>
            <label className="switch">
              <input
                type="checkbox"
                aria-label="Ativar notificações de promoções"
                checked={settings.promos}
                onChange={() => handleToggle("promos")}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="section-card privacy-section">
          <h2>Frequência</h2>
          <div
            className="frequency-group"
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label>
              <input
                type="radio"
                name="frequency"
                value="immediate"
                checked={settings.frequency === "immediate"}
                onChange={handleFrequency}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontWeight: "600" }}>Imediato</span>
                <small style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                  Receba notificações instantaneamente
                </small>
              </div>
            </label>
            <label>
              <input
                type="radio"
                name="frequency"
                value="daily"
                checked={settings.frequency === "daily"}
                onChange={handleFrequency}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontWeight: "600" }}>Diário</span>
                <small style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                  Resumo diário às 9h
                </small>
              </div>
            </label>
            <label>
              <input
                type="radio"
                name="frequency"
                value="weekly"
                checked={settings.frequency === "weekly"}
                onChange={handleFrequency}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontWeight: "600" }}>Semanal</span>
                <small style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                  Resumo semanal às segundas
                </small>
              </div>
            </label>
          </div>
        </div>

        <div className="section-card notification-section">
          <h2>Canais</h2>
          <div
            className="channels-group"
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label>
              <input
                type="checkbox"
                aria-label="Receber por e-mail"
                checked={settings.channels.includes("email")}
                onChange={() => handleChannel("email")}
              />
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <i className="fas fa-envelope" style={{ color: "#10b981" }}></i>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>E-mail</span>
                  <small style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                    Notificações por e-mail
                  </small>
                </div>
              </div>
            </label>
            <label>
              <input
                type="checkbox"
                aria-label="Receber via push"
                checked={settings.channels.includes("push")}
                onChange={() => handleChannel("push")}
              />
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <i
                  className="fas fa-mobile-alt"
                  style={{ color: "#10b981" }}
                ></i>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>
                    Push (navegador/app)
                  </span>
                  <small style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                    Notificações no dispositivo
                  </small>
                </div>
              </div>
            </label>
            <label>
              <input
                type="checkbox"
                aria-label="Receber por SMS"
                checked={settings.channels.includes("sms")}
                onChange={() => handleChannel("sms")}
              />
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <i className="fas fa-sms" style={{ color: "#10b981" }}></i>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>SMS</span>
                  <small style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                    Mensagens de texto
                  </small>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="section-card">
          <h2>Preview</h2>
          <div className="card" style={{ textAlign: "left", maxWidth: 600 }}>
            <strong style={{ display: "block", marginBottom: 8 }}>
              {preview.title}
            </strong>
            <div style={{ color: "#374151" }}>{preview.lines[0]}</div>
            <div style={{ color: "#6b7280" }}>{preview.lines[1]}</div>
          </div>
          <div className="warning" style={{ textAlign: "left" }}>
            Ativar notificações de mensagens permite responder clientes
            rapidamente.
          </div>
        </div>

        <div className="button-group" style={{ marginTop: "1rem", justifyContent: "center" }}>
          <button
            className="save-btn"
            onClick={() => setSettings(initialState)}
            aria-label="Restaurar preferências padrão"
          >
            Restaurar padrão
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
