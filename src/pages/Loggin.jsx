import { Link, useNavigate } from 'react-router-dom';
import profissionaisImg from '../assets/image.png';
import { useState } from 'react';
import { login } from '../services/auth';

function Loggin() {
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [formData, setFormData] = useState({ email: '', password: '', salvarAcesso: false });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
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

  // Decodifica o token de forma segura
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação local
    let newErrors = {};
    if (!formData.email) newErrors.email = 'Informe seu e-mail.';
    if (!formData.password) newErrors.password = 'Informe sua senha.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setLoginError('Por favor, preencha todos os campos corretamente.');
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        const payload = parseJwt(result.token);
        if (payload) {
          localStorage.setItem('userId', payload.userId);
          localStorage.setItem('userType', payload.userType);
          localStorage.setItem('userEmail', payload.sub || formData.email);

          navigate(payload.userType === 'Profissional' ? '/dashboard' : '/home');
        } else {
          console.error('Erro ao decodificar token:', result.token);
          navigate('/home');
        }
      } else {
        // Mensagem genérica segura troquei por questao de seguranca
        setLoginError('Falha ao entrar. Verifique suas credenciais e tente novamente.');
        setFormData((prev) => ({ ...prev, password: '' }));
      }
    } catch (error) {
      console.error('Erro inesperado no login (detalhe para devs):', error);
      setLoginError('Ocorreu um erro ao tentar entrar. Tente novamente mais tarde.');
    }

    setLoading(false);
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
                <input type="checkbox" name="salvarAcesso" checked={formData.salvarAcesso} onChange={handleChange} className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-yellow-500 rounded cursor-pointer" />
                <span>Salvar acesso</span>
              </label>
              <Link to="/Recuperation" className="text-yellow-500 hover:underline">
                Esqueci minha senha
              </Link>
            </div>

            {/* Botão Entrar */}
            <button type="submit" disabled={loading} className="w-full bg-yellow-400 hover:bg-yellow-300 text-white py-2 rounded-lg font-semibold transition-colors transform skew-x-6 disabled:opacity-50 cursor-pointer">
              <span className="transform -skew-x-6 inline-block">{loading ? 'Entrando...' : 'Entrar'}</span>
            </button>

            {/* Mensagem de erro genérica */}
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
