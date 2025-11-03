import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import passwordResetService from '../services/passwordResetService';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validatingToken, setValidatingToken] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        validateToken();
    }, [token]);

    const validateToken = async () => {
        try {
            const result = await passwordResetService.validateToken(token);

            if (result.valid) {
                setTokenValid(true);
                setUserName(result.userName);
            } else {
                setTokenValid(false);
                setError(result.message);
            }
        } catch (error) {
            setTokenValid(false);
            setError('Token inválido ou expirado');
        } finally {
            setValidatingToken(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.newPassword) {
            setError('Digite a nova senha');
            return false;
        }

        if (formData.newPassword.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const result = await passwordResetService.resetPassword(token, formData.newPassword);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError(error.message || 'Erro ao redefinir senha');
        } finally {
            setLoading(false);
        }
    };

    if (validatingToken) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-blue-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
                    <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Validando token...</p>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-blue-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Token Inválido
                        </h2>

                        <p className="text-gray-600 mb-6">
                            {error || 'O link de recuperação é inválido ou expirou.'}
                        </p>

                        <div className="space-y-3">
                            <Link
                                to="/Recuperation"
                                className="block w-full bg-violet-600 text-white py-3 px-4 rounded-lg hover:bg-violet-700 transition-colors font-medium"
                            >
                                Solicitar Novo Link
                            </Link>

                            <Link
                                to="/"
                                className="block text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Voltar ao Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-blue-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Senha Redefinida!
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Sua senha foi alterada com sucesso. Você será redirecionado para o login em alguns segundos.
                        </p>

                        <Link
                            to="/"
                            className="inline-block bg-violet-600 text-white py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors font-medium"
                        >
                            Ir para Login
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
                        <Lock className="w-8 h-8 text-violet-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Redefinir Senha
                    </h2>

                    <p className="text-gray-600">
                        Olá, <strong>{userName}</strong>! Digite sua nova senha abaixo.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nova Senha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nova Senha
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Digite sua nova senha"
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                    </div>

                    {/* Confirmar Senha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar Nova Senha
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirme sua nova senha"
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
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
                                Redefinindo...
                            </div>
                        ) : (
                            'Redefinir Senha'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
                    >
                        Voltar ao login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
