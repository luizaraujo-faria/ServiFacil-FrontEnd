import { Link, useNavigate } from 'react-router-dom';
import profissionaisImg from '../assets/image.png';
import { useState } from 'react';
import { login } from '../services/auth';

function Loggin() {
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [formData, setFormData] = useState({ email: '', password: '', salvarAcesso: false });
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const inputStyle = 'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400';

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
        setLoginError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação local
        let newErrors = {};
        if (!formData.email) newErrors.email = 'Informe seu e-mail.';
        if (!formData.password) newErrors.password = 'Informe sua senha.';
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        // Chamada ao serviço de login
        const result = await login(formData);
        console.log('Resultado do login:', result);

        if (result.success) {
            // Decodificar o token JWT para pegar o userId e userType
            try {
                const tokenParts = result.token.split('.');
                const payload = JSON.parse(atob(tokenParts[1]));

                console.log('Payload do token:', payload);

                const userId = payload.userId;
                const userType = payload.userType;

                // Salvar no localStorage
                localStorage.setItem('userId', userId);
                localStorage.setItem('userType', userType);
                localStorage.setItem('userEmail', payload.sub || formData.email);

                console.log('Login bem-sucedido! Tipo de usuário:', userType);
                console.log('Redirecionando para:', userType === 'Profissional' ? '/dashboard' : '/home');

                // Redirecionar baseado no tipo de usuário
                if (userType === 'Profissional') {
                    console.log('Navegando para /dashboard...');
                    navigate('/dashboard');
                } else {
                    console.log('Navegando para /home...');
                    navigate('/home');
                }
            } catch (error) {
                console.error('Erro ao decodificar token:', error);
                console.log('Token recebido:', result.token);
                // Se falhar ao decodificar, redireciona para home por padrão
                navigate('/home');
            }
        } else {
            console.error('Login falhou:', result.message);
            setLoginError(result.message); // exibe erro abaixo do formulário
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
            {/* Imagem lateral */}
            <div className="hidden md:flex md:w-1/2">
                <img src={profissionaisImg} alt="Profissionais" className="w-full h-full object-cover rounded-r-2xl" />
            </div>

            {/* Formulário */}
            <div className="flex flex-1 items-center justify-center bg-neutral-100 p-6 md:p-8 md:w-1/2">
                <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold text-violet-400 mb-2 text-center">ServiFacil</h1>
                    <p className="text-gray-600 mb-6 text-center">Conecte-se com os melhores profissionais</p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-violet-800 font-medium mb-1">
                                Email
                            </label>
                            <input type="email" id="email" name="email" placeholder="emailexemplo@gmail.com" value={formData.email} onChange={handleChange} className={`${inputStyle} ${errors.email ? 'border-red-500' : 'border-yellow-500'}`} />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Senha */}
                        <div>
                            <label htmlFor="password" className="block text-violet-800 font-medium mb-1">
                                Senha
                            </label>
                            <input type="password" id="password" name="password" placeholder="*************" value={formData.password} onChange={handleChange} className={`${inputStyle} ${errors.password ? 'border-red-500' : 'border-yellow-500'}`} />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Opções */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" name="salvarAcesso" checked={formData.salvarAcesso} onChange={handleChange} className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-yellow-500 rounded" />
                                <span>Salvar acesso</span>
                            </label>
                            <Link to="/Recuperation" className="text-yellow-500 hover:underline">
                                Esqueci minha senha
                            </Link>
                        </div>

                        {/* Botão Entrar */}
                        <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-300 text-white py-2 rounded-lg font-semibold transition-colors">
                            Entrar
                        </button>

                        {/* Mensagem de erro do login */}
                        {loginError && <p className="text-red-500 text-center mt-2">{loginError}</p>}
                    </form>

                    {/* Links para cadastro */}
                    <p className="mt-6 text-center text-gray-600">
                        Não tem uma conta?{' '}
                        <Link to="/cadastro" className="text-yellow-500 hover:underline">
                            Criar Conta
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Loggin;
