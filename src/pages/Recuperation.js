import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Recuperation() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Por favor, informe seu e-mail.');
      return;
    }

    setLoading(true);
    
    // Simular envio de email de recuperação
    setTimeout(() => {
      setLoading(false);
      setMessage('Um link de recuperação foi enviado para seu e-mail!');
      setEmail('');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-violet-400 mb-2 text-center">Recuperar Senha</h1>
        <p className="text-gray-600 mb-6 text-center">
          Informe seu e-mail para receber instruções de recuperação
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-violet-800 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2 border border-teal-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-400 hover:bg-teal-300 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>

          {message && <p className="text-green-500 text-center mt-2">{message}</p>}
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-teal-500 hover:underline">
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Recuperation;
