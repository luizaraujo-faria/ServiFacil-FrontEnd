import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import passwordResetService from '../services/passwordResetService';

function Recuperation() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('Por favor, digite seu email');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await passwordResetService.requestPasswordReset(email);

            if (result.success) {
                setSuccess(true);
                setToken(result.token); // Para desenvolvimento - mostrar o token
            } else {
                setError(result.message || 'Email não encontrado');
            }
        } catch (error) {
            setError(error.message || 'Erro ao enviar solicitação');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-blue-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Email Enviado!
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Enviamos um link de recuperação para <strong>{email}</strong>
                        </p>

                        {/* Para desenvolvimento - mostrar o link diretamente */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-yellow-800 mb-2">
                                <strong>Para desenvolvimento:</strong>
                            </p>
                            <Link
                                to={`/reset-password/${token}`}
                                className="text-blue-600 hover:text-blue-700 underline text-sm break-all"
                            >
                                Clique aqui para redefinir sua senha
                            </Link>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-gray-500">
                                Não recebeu o email? Verifique sua caixa de spam.
                            </p>

                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    setEmail('');
                                    setToken('');
                                }}
                                className="text-violet-600 hover:text-violet-700 text-sm font-medium"
                            >
                                Tentar novamente
                            </button>
                        </div>

                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mt-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Voltar ao login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-blue-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-violet-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Esqueceu sua senha?
                    </h2>

                    <p className="text-gray-600">
                        Digite seu email e enviaremos um link para redefinir sua senha
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-violet-600 text-white py-3 px-4 rounded-lg hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Enviando...
                            </div>
                        ) : (
                            'Enviar Link de Recuperação'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Recuperation;
