import React, { useState } from 'react';
import InputField from '../components/CreateAccount/InputField';
import DisponibilidadeForm from '../components/CreateAccount/DisponibilidadeForm';

function ProfessionalForm({ formData, onChange, errors }) {
  const [servicos, setServicos] = useState(formData.servicos || []);
  const [habilidades, setHabilidades] = useState(formData.habilidades || []);
  const [habilidadeInput, setHabilidadeInput] = useState('');
  const [portfolioFiles, setPortfolioFiles] = useState([]);

  // Serviços dinâmicos
  const addServico = () => setServicos([...servicos, { nome: '', precoMin: '', precoMedio: '', precoMax: '' }]);
  const removeServico = (idx) => setServicos(servicos.filter((_, i) => i !== idx));
  const updateServico = (idx, field, value) => {
    const updated = [...servicos];
    updated[idx][field] = value;
    setServicos(updated);
    onChange({ target: { name: 'servicos', value: updated } });
  };

  // Habilidades como tags
  const addHabilidade = () => {
    if (habilidadeInput.trim() && !habilidades.includes(habilidadeInput.trim())) {
      const updated = [...habilidades, habilidadeInput.trim()];
      setHabilidades(updated);
      setHabilidadeInput('');
      onChange({ target: { name: 'habilidades', value: updated } });
    }
  };
  const removeHabilidade = (idx) => {
    const updated = habilidades.filter((_, i) => i !== idx);
    setHabilidades(updated);
    onChange({ target: { name: 'habilidades', value: updated } });
  };

  // Upload de portfólio
  const handlePortfolioUpload = (e) => {
    const files = Array.from(e.target.files);
    const updatedFiles = [...portfolioFiles, ...files];
    setPortfolioFiles(updatedFiles);
    onChange({ target: { name: 'portfolio', value: updatedFiles } });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Cadastro de Profissional</h2>

      {/* Descrição / Bio */}
      <section className="space-y-2">
        <label className="font-semibold text-lg">Descrição / Bio *</label>
        <textarea name="descricao" value={formData.descricao} onChange={onChange} placeholder="Fale sobre você, experiência, estilo de trabalho" className="border rounded-xl px-4 py-3 w-full h-36 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
        {errors?.descricao && <span className="text-red-500 text-sm">{errors.descricao}</span>}
      </section>

      {/* Tipo de serviço */}
      <section className="space-y-2">
        <label className="font-semibold text-lg">Tipo de serviço *</label>
        <select name="tipoServico" value={formData.tipoServico} onChange={onChange} className="border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer">
          <option value="">Selecione</option>
          <option value="baba">Babá</option>
          <option value="encanador">Encanador</option>
          <option value="pintor">Pintor</option>
          <option value="petSitter">Pet Sitter</option>
          <option value="faxineiro">Faxineiro</option>
          <option value="outro">Outro</option>
        </select>
      </section>

      {/* Habilidades / Especializações */}
      <section className="space-y-2">
        <label className="font-semibold text-lg">Habilidades / Especializações *</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={habilidadeInput}
            onChange={(e) => setHabilidadeInput(e.target.value)}
            placeholder="Digite uma habilidade e pressione Enter"
            className="border rounded-xl px-4 py-2 w-full"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHabilidade())}
          />
          <button type="button" onClick={addHabilidade} className="bg-yellow-400 text-white px-4 py-2 rounded-xl font-medium hover:bg-yellow-500 transition">
            Adicionar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {habilidades.map((hab, idx) => (
            <span key={idx} className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full flex items-center gap-1">
              {hab}
              <button type="button" onClick={() => removeHabilidade(idx)} className="text-red-500 font-bold">
                x
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Serviços Oferecidos */}
      <section className="space-y-4">
        <h3 className="font-semibold text-lg">Serviços Oferecidos *</h3>
        {servicos.map((servico, idx) => (
          <div key={idx} className="flex flex-wrap gap-2 items-end">
            <InputField type="text" placeholder="Nome do serviço" value={servico.nome} onChange={(e) => updateServico(idx, 'nome', e.target.value)} />
            <InputField type="number" placeholder="Preço Min R$" value={servico.precoMin} onChange={(e) => updateServico(idx, 'precoMin', e.target.value)} />
            <InputField type="number" placeholder="Preço Médio R$" value={servico.precoMedio} onChange={(e) => updateServico(idx, 'precoMedio', e.target.value)} />
            <InputField type="number" placeholder="Preço Max R$" value={servico.precoMax} onChange={(e) => updateServico(idx, 'precoMax', e.target.value)} />
            <button type="button" onClick={() => removeServico(idx)} className="text-red-500 font-bold">
              X
            </button>
          </div>
        ))}
        <button type="button" onClick={addServico} className="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition">
          Adicionar serviço
        </button>
      </section>

      {/* Portfólio */}
      <section className="space-y-2">
        <h3 className="font-semibold text-lg">Portfólio</h3>
        <input type="file" multiple accept="image/*" onChange={handlePortfolioUpload} className="border rounded-xl px-4 py-2 w-full" />
        <div className="flex flex-wrap gap-2 mt-2">
          {portfolioFiles.map((file, idx) => (
            <img key={idx} src={URL.createObjectURL(file)} alt={`portfolio-${idx}`} className="w-24 h-24 object-cover rounded-xl" />
          ))}
        </div>
      </section>

      {/* Redes Sociais */}
      <section className="space-y-2">
        <InputField type="text" name="instagram" label="Instagram" placeholder="Link do Instagram" value={formData.instagram} onChange={onChange} />
        <InputField type="text" name="linkedin" label="LinkedIn" placeholder="Link do LinkedIn" value={formData.linkedin} onChange={onChange} />
        <InputField type="text" name="tiktok" label="TikTok" placeholder="Link do TikTok" value={formData.tiktok} onChange={onChange} />
      </section>

      {/* Disponibilidade */}
      <section className="space-y-2">
        <h3 className="font-semibold text-lg">Disponibilidade *</h3>
        <DisponibilidadeForm formData={formData} onChange={onChange} />
      </section>
      <section className="mt-6">
        <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400">
          Cadastrar
        </button>
      </section>
    </div>
  );
}

export default ProfessionalForm;
