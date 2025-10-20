import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [formData, setFormData] = useState({ email: '', password: '', salvarAcesso: false });
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

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
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/'); // redireciona para Home após login bem-sucedido
    } else {
      setLoginError(result.error || 'Erro ao fazer login'); // exibe erro abaixo do formulário
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Imagem lateral esquerda */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 items-center justify-center">
        <img 
          src={`${process.env.PUBLIC_URL}/images/image.png`}
          alt="Profissionais ServiFácil" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-1 items-center justify-center bg-white p-6 md:p-8 md:w-1/2">
        <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-violet-400 mb-2 text-center">ServiFacil</h1>
          <p className="text-gray-600 mb-6 text-center">Conecte-se com os melhores profissionais</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-purple-600 font-semibold mb-2 text-sm">
                Email
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="emailexemplo@gmail.com" 
                value={formData.email} 
                onChange={handleChange} 
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 ${
                  errors.email ? 'border-red-500' : 'border-teal-400'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-purple-600 font-semibold mb-2 text-sm">
                Senha
              </label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="*************" 
                value={formData.password} 
                onChange={handleChange} 
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 ${
                  errors.password ? 'border-red-500' : 'border-teal-400'
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" name="salvarAcesso" checked={formData.salvarAcesso} onChange={handleChange} className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-yellow-500 rounded cursor-pointer flex-shrink-0 translate-y-1.5" />
                <span>Salvar acesso</span>
              </label>
              <Link to="/recuperacao" className="text-teal-500 hover:text-teal-600 text-sm font-medium">
                Esqueci minha senha
              </Link>
            </div>

            {/* Botão Entrar */}
            <button 
              type="submit" 
              className="w-full bg-teal-400 hover:bg-teal-500 text-white py-3 rounded-lg font-bold text-base transition-colors mt-6 shadow-md"
            >
              Entrar
            </button>

            {/* Mensagem de erro do login */}
            {loginError && <p className="text-red-500 text-center mt-2 text-sm">{loginError}</p>}
          </form>

          {/* Links para cadastro */}
          <p className="mt-8 text-center text-gray-600 text-sm">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-teal-500 hover:text-teal-600 font-semibold">
              Criar Conta
            </Link>
          </p>
          <p className="mt-2 text-center text-gray-600 text-sm">
            É um profissional?{' '}
            <Link to="/cadastro-profissional" className="text-teal-500 hover:text-teal-600 font-semibold">
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
