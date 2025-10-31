import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PersonalInfoForm from '../components/CreateAccount/PersonalInfoForm';
import AddressForm from '../components/CreateAccount/AddressForm';
import TermsAndSubmit from '../components/CreateAccount/TermsAndSubmit';
import PhotoUpload from '../components/PhotoUpload';
import InputField from '../components/CreateAccount/InputField';
import { UserPlus, ArrowLeft, User, Briefcase } from 'lucide-react';
import { criarConta } from '../services/userService';
import { validarFormulario } from '../utils/validators';

function CreateAccount() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        isProfissional: '', // "sim" ou "nao"
        nome: '',
        cpf: '',
        rg: '',
        cnpj: '',
        dataNascimento: '',
        email: '',
        telefone: '',
        senha: '',
        repetirSenha: '',
        profissao: '',
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        termosAceitos: false,
        foto: null,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    // Funções de máscara
    const maskCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const maskPhone = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    const maskCEP = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d{1,3})/, '$1-$2')
            .substring(0, 9); // Limita a 9 caracteres (00000-000)
    };

    const maskCNPJ = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let maskedValue = value;

        // Aplicar máscaras
        if (name === 'cpf') maskedValue = maskCPF(value);
        if (name === 'telefone') maskedValue = maskPhone(value);
        if (name === 'cep') maskedValue = maskCEP(value);
        if (name === 'cnpj') maskedValue = maskCNPJ(value);

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : maskedValue,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
        setServerMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validarFormulario(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            alert('Por favor, corrija os erros no formulário');
            return;
        }

        setLoading(true);
        try {
            const result = await criarConta(formData);
            if (result.success) {
                alert('✅ Conta criada com sucesso!');
                navigate('/');
            } else {
                setServerMessage(result.message || 'Erro ao criar conta.');
            }
        } catch (error) {
            console.error('Erro ao criar conta:', error);
            setServerMessage('Erro inesperado ao criar conta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-yellow-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Voltar
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="bg-violet-100 p-2 rounded-full">
                                <UserPlus className="w-6 h-6 text-violet-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Criar Conta</h1>
                                <p className="text-sm text-gray-500">Junte-se ao ServiFácil</p>
                            </div>
                        </div>
                        <div className="w-20"></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tipo de conta */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                                <span className="text-violet-600 font-bold">1</span>
                            </div>
                            Tipo de Conta
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label
                                className={`relative flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${formData.isProfissional === 'nao'
                                    ? 'border-violet-500 bg-violet-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="isProfissional"
                                    value="nao"
                                    checked={formData.isProfissional === 'nao'}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Conta Pessoal</p>
                                    <p className="text-sm text-gray-500">Para contratar serviços</p>
                                </div>
                            </label>

                            <label
                                className={`relative flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${formData.isProfissional === 'sim'
                                    ? 'border-yellow-500 bg-yellow-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="isProfissional"
                                    value="sim"
                                    checked={formData.isProfissional === 'sim'}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Briefcase className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Conta Profissional</p>
                                    <p className="text-sm text-gray-500">Para oferecer serviços</p>
                                </div>
                            </label>
                        </div>
                        {errors.isProfissional && <p className="text-red-500 text-sm mt-2">{errors.isProfissional}</p>}
                    </div>

                    {/* Upload de foto */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                                <span className="text-violet-600 font-bold">2</span>
                            </div>
                            Foto de Perfil
                        </h2>
                        <div className="flex justify-center">
                            <PhotoUpload
                                currentPhoto={formData.foto}
                                onPhotoChange={(photoBase64) =>
                                    setFormData((prev) => ({ ...prev, foto: photoBase64 }))
                                }
                                userName={formData.nome}
                            />
                        </div>
                    </div>

                    {/* Informações pessoais */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                                <span className="text-violet-600 font-bold">3</span>
                            </div>
                            Informações Pessoais
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Nome Completo"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Digite seu nome completo"
                                error={errors.nome}
                            />

                            <InputField
                                label="CPF"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                placeholder="000.000.000-00"
                                error={errors.cpf}
                                maxLength="14"
                            />

                            <InputField
                                type="date"
                                label="Data de Nascimento"
                                name="dataNascimento"
                                value={formData.dataNascimento}
                                onChange={handleChange}
                                error={errors.dataNascimento}
                            />

                            <InputField
                                type="email"
                                label="E-mail"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="exemplo@email.com"
                                error={errors.email}
                            />

                            <InputField
                                label="RG"
                                name="rg"
                                value={formData.rg}
                                onChange={handleChange}
                                placeholder="Digite seu RG"
                                error={errors.rg}
                            />

                            <InputField
                                label="Telefone"
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleChange}
                                placeholder="(00) 00000-0000"
                                error={errors.telefone}
                                maxLength="15"
                            />

                            {formData.isProfissional === 'sim' && (
                                <>
                                    <InputField
                                        label="CNPJ"
                                        name="cnpj"
                                        value={formData.cnpj}
                                        onChange={handleChange}
                                        placeholder="00.000.000/0000-00"
                                        error={errors.cnpj}
                                        maxLength="18"
                                    />
                                    <InputField
                                        label="Profissão"
                                        name="profissao"
                                        value={formData.profissao}
                                        onChange={handleChange}
                                        placeholder="Ex: Eletricista, Encanador..."
                                        error={errors.profissao}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Senhas */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                                <span className="text-violet-600 font-bold">4</span>
                            </div>
                            Segurança
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                type="password"
                                label="Senha"
                                name="senha"
                                value={formData.senha}
                                onChange={handleChange}
                                placeholder="Mínimo 8 caracteres"
                                error={errors.senha}
                            />
                            <InputField
                                type="password"
                                label="Confirmar Senha"
                                name="repetirSenha"
                                value={formData.repetirSenha}
                                onChange={handleChange}
                                placeholder="Digite a senha novamente"
                                error={errors.repetirSenha}
                            />
                        </div>
                    </div>

                    {/* Endereço */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                                <span className="text-violet-600 font-bold">5</span>
                            </div>
                            Endereço
                        </h2>
                        <AddressForm formData={formData} onChange={handleChange} errors={errors} />
                    </div>

                    {/* Termos e submit */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <TermsAndSubmit formData={formData} onChange={handleChange} errors={errors} />

                        {serverMessage && (
                            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                                <p className="text-red-600 text-sm text-center">{serverMessage}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!formData.termosAceitos || loading}
                            className="w-full bg-gradient-to-r from-violet-500 to-yellow-400 hover:from-violet-600 hover:to-yellow-500 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Criando conta...
                                </span>
                            ) : (
                                'Criar Conta'
                            )}
                        </button>

                        <p className="text-center text-gray-600 mt-4">
                            Já tem uma conta?{' '}
                            <Link to="/" className="text-violet-600 hover:text-violet-700 font-semibold">
                                Fazer Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateAccount;
