import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary capturou um erro:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Algo deu errado</h2>
          <p className="text-gray-600 mb-8">Ocorreu um erro inesperado. Nossa equipe foi notificada.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Recarregar página
          </button>

          {import.meta.env.DEV && (
            <details className="mt-8 text-left max-w-2xl">
              <summary className="cursor-pointer text-gray-600 mb-2">Detalhes do erro (desenvolvimento)</summary>
              <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-xs">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


