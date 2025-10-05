import React from "react";

// Componente de loading simples
export const Loading = ({ size = "medium", text = "Carregando..." }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-green-500 rounded-full animate-spin`}
        style={{
          width:
            size === "small" ? "16px" : size === "medium" ? "32px" : "48px",
          height:
            size === "small" ? "16px" : size === "medium" ? "32px" : "48px",
          border: "4px solid #e5e7eb",
          borderTop: "4px solid #10b981",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      {text && (
        <p
          style={{
            marginTop: "1rem",
            color: "#6b7280",
            fontSize: "0.9rem",
          }}
        >
          {text}
        </p>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

// Componente de loading para botões
export const ButtonLoading = ({ loading, children, ...props }) => {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            minHeight: "48px",
          }}
        >
          <div
            style={{
              width: "18px",
              height: "18px",
              border: "2px solid transparent",
              borderTop: "2px solid currentColor",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: "1rem", fontWeight: "600" }}>
            Carregando...
          </span>
        </div>
      ) : (
        children
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  );
};

// Componente de loading para páginas inteiras
export const PageLoading = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        padding: "2rem",
      }}
    >
      <Loading size="large" text="Carregando página..." />
    </div>
  );
};

export default Loading;

