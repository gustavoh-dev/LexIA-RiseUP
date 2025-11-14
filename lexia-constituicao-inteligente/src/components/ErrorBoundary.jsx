import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen pt-24 pb-8 flex justify-center bg-gray-50">
          <div className="w-full max-w-4xl px-6 text-center">
            <div className="bg-white p-8 rounded-lg shadow-xl border border-red-200">
              <h2 className="text-3xl font-bold text-red-600 mb-4">
                Ops! Algo deu errado
              </h2>
              <p className="text-gray-700 mb-6">
                Ocorreu um erro inesperado. Por favor, tente recarregar a página.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left bg-gray-100 p-4 rounded">
                  <summary className="cursor-pointer font-semibold text-gray-800">
                    Detalhes do erro (modo desenvolvimento)
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  Tentar Novamente
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Recarregar Página
                </button>
              </div>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

