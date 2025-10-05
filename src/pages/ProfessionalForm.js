import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfessionalForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    repetirSenha: '',
    descricao: '',
    tipoServico: '',
    habilidades: [],
    servicos: [],
    instagram: '',
    linkedin: '',
    tiktok: '',
    termosAceitos: false,
  });

  const [habilidadeInput, setHabilidadeInput] = useState('');
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
  };

  const addHabilidade = () => {
    if (habilidadeInput.trim() && !formData.habilidades.includes(habilidadeInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        habilidades: [...prev.habilidades, habilidadeInput.trim()],
      }));
      setHabilidadeInput('');
    }
  };

  const removeHabilidade = (idx) => {
    setFormData((prev) => ({
      ...prev,
      habilidades: prev.habilidades.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.senha) newErrors.senha = 'Senha é obrigatória';
    if (formData.senha !== formData.repetirSenha) newErrors.repetirSenha = 'As senhas não coincidem';
    if (!formData.descricao) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.tipoServico) newErrors.tipoServico = 'Selecione um tipo de serviço';
    if (!formData.termosAceitos) newErrors.termosAceitos = 'Você deve aceitar os termos';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setServerMessage('Cadastro profissional criado com sucesso!');
      setTimeout(() => navigate('/login'), 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Cadastro de Profissional</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Informações Básicas</h3>
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
            </div>
          </section>

          {/* Descrição */}
          <section>
            <label className="block text-sm font-medium mb-1">Descrição / Bio *</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Fale sobre você, experiência, estilo de trabalho"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none h-32"
            />
            {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
          </section>

          {/* Tipo de serviço */}
          <section>
            <label className="block text-sm font-medium mb-1">Tipo de serviço *</label>
            <select
              name="tipoServico"
              value={formData.tipoServico}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Selecione</option>
              <option value="baba">Babá</option>
              <option value="encanador">Encanador</option>
              <option value="pintor">Pintor</option>
              <option value="petSitter">Pet Sitter</option>
              <option value="faxineiro">Faxineiro</option>
              <option value="outro">Outro</option>
            </select>
            {errors.tipoServico && <p className="text-red-500 text-sm mt-1">{errors.tipoServico}</p>}
          </section>

          {/* Habilidades */}
          <section>
            <label className="block text-sm font-medium mb-1">Habilidades / Especializações</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={habilidadeInput}
                onChange={(e) => setHabilidadeInput(e.target.value)}
                placeholder="Digite uma habilidade e pressione Enter"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHabilidade())}
              />
              <button
                type="button"
                onClick={addHabilidade}
                className="bg-teal-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-500 transition"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.habilidades.map((hab, idx) => (
                <span key={idx} className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full flex items-center gap-1">
                  {hab}
                  <button type="button" onClick={() => removeHabilidade(idx)} className="text-red-500 font-bold ml-1">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Redes Sociais */}
          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Redes Sociais (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="@seu_instagram"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="linkedin.com/in/seu-perfil"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">TikTok</label>
                <input
                  type="text"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="@seu_tiktok"
                />
              </div>
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
            className="w-full bg-teal-400 hover:bg-teal-500 text-white py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-100 disabled:cursor-not-allowed"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar como Profissional'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfessionalForm;
