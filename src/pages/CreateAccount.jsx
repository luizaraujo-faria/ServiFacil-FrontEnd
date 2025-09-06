import React, { useState } from 'react';
import PersonalInfoForm from '../components/CreateAccount/PersonalInfoForm';
import AddressForm from '../components/CreateAccount/AddressForm';
import TermsAndSubmit from '../components/CreateAccount/TermsAndSubmit';
import UploadFoto from '../components/CreateAccount/UploadFoto';
import { UserPlus } from 'lucide-react';
import { validarFormulario } from '../utils/validators';
import { criarConta } from '../services/userService';
import InputField from '../components/CreateAccount/InputField';

function CreateAccount() {
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
    setErrors((prev) => ({ ...prev, [name]: '' })); // limpa o erro do campo ao digitar
    setServerMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Valida todos os campos
    const validationErrors = validarFormulario(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return; // se houver erros, não envia

    setLoading(true);
    const result = await criarConta(formData); // envia para o backend
    setLoading(false);

    if (result.success) {
      setServerMessage('Conta criada com sucesso!');
      // opcional: limpar formulário ou redirecionar
    } else {
      setServerMessage(result.message || 'Ocorreu um erro ao criar a conta.');
    }
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

        {/* Upload de foto */}
        <section className="flex justify-center mb-6">
          <UploadFoto foto={formData.foto} onChange={(file) => setFormData((prev) => ({ ...prev, foto: file }))} />
        </section>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações pessoais */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações Pessoais</h2>
            <PersonalInfoForm formData={formData} onChange={handleChange} errors={errors} />
          </section>

          {/* Senha */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField type="password" label="Senha" name="senha" value={formData.senha} onChange={handleChange} placeholder="Digite sua senha" error={errors.senha} required />
            <InputField type="password" label="Repetir Senha" name="repetirSenha" value={formData.repetirSenha} onChange={handleChange} placeholder="Confirme sua senha" error={errors.repetirSenha} required />
          </section>

          {/* Endereço */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Endereço</h2>
            <AddressForm formData={formData} onChange={handleChange} errors={errors} />
          </section>

          {/* Tipo de conta */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Tipo de Conta</h2>
            <div className="flex flex-col space-y-2">
              {['nao', 'sim'].map((value) => (
                <label key={value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="contaProfissional"
                    value={value}
                    checked={formData.contaProfissional === value}
                    onChange={handleChange}
                    className={`h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded ${errors.contaProfissional ? 'border-red-500' : ''}`}
                  />
                  <span>{value === 'sim' ? 'Profissional' : 'Pessoal'}</span>
                </label>
              ))}
              {errors.contaProfissional && <p className="text-red-500 text-sm">{errors.contaProfissional}</p>}
            </div>
          </section>

          {/* Termos e submit */}
          <section>
            <TermsAndSubmit formData={formData} onChange={handleChange} errors={errors} />
          </section>
          {/* Mensagem geral */}

          <section className="mt-4">
            {/* Mensagem geral */}
            {serverMessage && <p className={`text-center mb-4 ${serverMessage.includes('sucesso') ? 'text-green-500' : 'text-red-500'}`}>{serverMessage}</p>}
            <button
              type="submit"
              disabled={!formData.termosAceitos || loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;
