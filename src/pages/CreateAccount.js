import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    senha: '',
    repetirSenha: '',
    cep: '',
    rua: '',
    bairro: '',
    municipio: '',
    estado: '',
    contaProfissional: '',
    termosAceitos: false,
    foto: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica
    let newErrors = {};
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.senha) newErrors.senha = 'Senha é obrigatória';
    if (formData.senha !== formData.repetirSenha) newErrors.repetirSenha = 'As senhas não coincidem';
    if (!formData.termosAceitos) newErrors.termosAceitos = 'Você deve aceitar os termos';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    
    // Simular criação de conta
    setTimeout(() => {
      setLoading(false);
      setServerMessage('Conta criada com sucesso!');
      setTimeout(() => navigate('/login'), 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Criar Conta</h2>
          <p className="text-gray-500 text-sm">Preencha os dados para criar sua conta</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações pessoais */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Seu nome completo"
                />
                {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="seu@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
          </section>

          {/* Senha */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Senha *</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Digite sua senha"
              />
              {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Repetir Senha *</label>
              <input
                type="password"
                name="repetirSenha"
                value={formData.repetirSenha}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Confirme sua senha"
              />
              {errors.repetirSenha && <p className="text-red-500 text-sm mt-1">{errors.repetirSenha}</p>}
            </div>
          </section>

          {/* Termos */}
          <section>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="termosAceitos"
                checked={formData.termosAceitos}
                onChange={handleChange}
                className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded translate-y-1.5"
              />
              <span className="text-sm">
                Aceito os{' '}
                <a href="/termos" className="text-teal-500 hover:underline">
                  termos e condições
                </a>
              </span>
            </label>
            {errors.termosAceitos && <p className="text-red-500 text-sm mt-1">{errors.termosAceitos}</p>}
          </section>

          {/* Mensagem */}
          {serverMessage && (
            <p className={`text-center ${serverMessage.includes('sucesso') ? 'text-green-500' : 'text-red-500'}`}>
              {serverMessage}
            </p>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={!formData.termosAceitos || loading}
            className="w-full bg-teal-400 hover:bg-teal-500 text-white py-3 rounded-lg font-bold text-base transition-colors mt-6 shadow-md"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;
