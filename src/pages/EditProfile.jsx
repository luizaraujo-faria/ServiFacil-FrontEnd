import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnterNavigation } from '../hooks/useEnterNavigation';
import { Shield, User, Phone, Mail, MapPin, Home, Lock } from 'lucide-react';
import UserNavigation from '../components/UserNavigation';

const EditProfile = () => {
    const navigate = useNavigate();
    const handleKeyPress = useEnterNavigation();
    const [formData, setFormData] = useState({
        nome: '', telefone: '', cpf: '', usuario: '', email: '',
        rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '',
        senha: '', confirmar: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem('profile_form', JSON.stringify(formData));
        } catch (_) {}
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
        let v = value;
        if (name === 'telefone') {
            v = value.replace(/\D/g, '').slice(0, 11);
            if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else if (name === 'cpf') {
            v = value.replace(/\D/g, '').slice(0, 11);
            if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
            else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, '$1.$2');
        } else if (name === 'numero') {
            v = value.replace(/\D/g, '').slice(0, 10);
        } else if (name === 'cep') {
            v = value.replace(/\D/g, '').slice(0, 8);
            if (v.length > 5) v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
        } else if (name === 'nome' || name === 'cidade' || name === 'bairro') {
            v = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').slice(0, 50);
        } else if (name === 'usuario') {
            v = value.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 30);
        } else if (name === 'rua') {
            v = value.replace(/[^a-zA-ZÀ-ÿ0-9\s,.-]/g, '').slice(0, 100);
        } else if (name === 'email') {
            v = value.slice(0, 100);
        } else if (name === 'senha' || name === 'confirmar') {
            v = value.slice(0, 50);
        }
        setFormData((prev) => ({ ...prev, [name]: v }));
    };

    const validateForm = () => {
        const errs = {};
        if (!formData.nome.trim()) errs.nome = 'Nome é obrigatório';
        else if (formData.nome.trim().length < 2) errs.nome = 'Nome deve ter pelo menos 2 caracteres';
        const telefoneClean = formData.telefone.replace(/\D/g, '');
        if (!telefoneClean) errs.telefone = 'Telefone é obrigatório';
        else if (telefoneClean.length < 10) errs.telefone = 'Telefone deve ter pelo menos 10 dígitos';
        const cpfClean = formData.cpf.replace(/\D/g, '');
        if (!cpfClean) errs.cpf = 'CPF é obrigatório';
        else if (cpfClean.length !== 11) errs.cpf = 'CPF deve ter 11 dígitos';
        if (!formData.usuario.trim()) errs.usuario = 'Nome de usuário é obrigatório';
        else if (formData.usuario.trim().length < 3) errs.usuario = 'Nome de usuário deve ter pelo menos 3 caracteres';
        if (!formData.email.trim()) errs.email = 'Email é obrigatório';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Email inválido';
        if (!formData.rua.trim()) errs.rua = 'Rua é obrigatória';
        else if (formData.rua.trim().length < 5) errs.rua = 'Rua deve ter pelo menos 5 caracteres';
        if (!formData.numero.trim()) errs.numero = 'Número é obrigatório';
        if (!formData.bairro.trim()) errs.bairro = 'Bairro é obrigatório';
        else if (formData.bairro.trim().length < 2) errs.bairro = 'Bairro deve ter pelo menos 2 caracteres';
        if (!formData.cidade.trim()) errs.cidade = 'Cidade é obrigatória';
        else if (formData.cidade.trim().length < 2) errs.cidade = 'Cidade deve ter pelo menos 2 caracteres';
        if (!formData.estado) errs.estado = 'Estado é obrigatório';
        if (!formData.cep.trim()) errs.cep = 'CEP é obrigatório';
        else if (!/^\d{5}-\d{3}$/.test(formData.cep)) errs.cep = 'CEP inválido (formato: 00000-000)';
        if (formData.senha || formData.confirmar) {
            if (!formData.senha) errs.senha = 'Digite a nova senha';
            else if (formData.senha.length < 6) errs.senha = 'Senha deve ter pelo menos 6 caracteres';
            if (!formData.confirmar) errs.confirmar = 'Confirme a nova senha';
            else if (formData.senha !== formData.confirmar) errs.confirmar = 'Senhas não coincidem';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const profileToSave = {
                id: 1,
                name: formData.nome,
                email: formData.email,
                phone: formData.telefone,
                cpf: formData.cpf,
                username: formData.usuario,
                address: {
                    street: formData.rua,
                    number: formData.numero,
                    neighborhood: formData.bairro,
                    city: formData.cidade,
                    state: formData.estado,
                    zip: formData.cep,
                },
            };
            localStorage.setItem('profile', JSON.stringify(profileToSave));
            try {
                localStorage.removeItem('profile_form');
            } catch (_) {}
            alert('Dados salvos com sucesso!');
            navigate('/perfil');
        } catch (error) {
            console.error('Erro ao salvar dados localmente:', error);
            alert('Falha ao salvar dados');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        try {
            localStorage.removeItem('profile_form');
        } catch (_) {}
        setFormData({
            nome: '', telefone: '', cpf: '', usuario: '', email: '',
            rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '',
            senha: '', confirmar: '',
        });
    };

    const handleCancel = () => {
        navigate('/perfil');
    };

    const estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <UserNavigation />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-violet-400 to-yellow-400 bg-clip-text text-transparent">
                        Editar Perfil
                    </h1>
                    <div className="flex items-center justify-center gap-2 p-4 bg-violet-50 border border-violet-200 rounded-xl text-violet-700 font-medium">
                        <Shield className="w-5 h-5" />
                        <span>Seus dados são protegidos com criptografia de ponta a ponta.</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-violet-400" />
                            Informações Pessoais
                        </h2>
                        <div className="space-y-4">
                            {[
                                { name: 'nome', icon: User, placeholder: 'Nome completo', type: 'text' },
                                { name: 'telefone', icon: Phone, placeholder: 'Telefone', type: 'text' },
                                { name: 'cpf', icon: User, placeholder: 'CPF', type: 'text' },
                                { name: 'usuario', icon: User, placeholder: 'Nome de usuário', type: 'text' },
                                { name: 'email', icon: Mail, placeholder: 'Email', type: 'email' },
                            ].map(({ name, icon: Icon, placeholder, type }) => (
                                <div key={name}>
                                    <div className={`flex items-center gap-3 p-4 rounded-lg border ${errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                                        <Icon className="w-5 h-5 text-violet-400 flex-shrink-0" />
                                        <input
                                            type={type}
                                            id={name}
                                            name={name}
                                            placeholder={placeholder}
                                            value={formData[name]}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            className="flex-1 bg-transparent outline-none text-gray-700"
                                        />
                                    </div>
                                    {errors[name] && <span className="text-red-500 text-sm mt-1 block">{errors[name]}</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-violet-400" />
                            Endereço
                        </h2>
                        <div className="space-y-4">
                            {[
                                { name: 'rua', icon: MapPin, placeholder: 'Rua' },
                                { name: 'numero', icon: Home, placeholder: 'Número' },
                                { name: 'bairro', icon: MapPin, placeholder: 'Bairro' },
                                { name: 'cidade', icon: MapPin, placeholder: 'Cidade' },
                            ].map(({ name, icon: Icon, placeholder }) => (
                                <div key={name} className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
                                    <Icon className="w-5 h-5 text-violet-400 flex-shrink-0" />
                                    <input
                                        type="text"
                                        id={name}
                                        name={name}
                                        placeholder={placeholder}
                                        value={formData[name]}
                                        onChange={handleInputChange}
                                        onKeyPress={handleKeyPress}
                                        className="flex-1 bg-transparent outline-none text-gray-700"
                                    />
                                </div>
                            ))}
                            <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
                                <MapPin className="w-5 h-5 text-violet-400 flex-shrink-0" />
                                <select
                                    id="estado"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    className="flex-1 bg-transparent outline-none text-gray-700"
                                >
                                    <option value="">Selecione o estado</option>
                                    {estados.map((uf) => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
                                <MapPin className="w-5 h-5 text-violet-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    id="cep"
                                    name="cep"
                                    placeholder="CEP"
                                    value={formData.cep}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    className="flex-1 bg-transparent outline-none text-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-violet-400" />
                            Segurança
                        </h2>
                        <div className="space-y-4">
                            {['senha', 'confirmar'].map((field) => (
                                <div key={field}>
                                    <div className={`flex items-center gap-3 p-4 rounded-lg border ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                                        <Lock className="w-5 h-5 text-violet-400 flex-shrink-0" />
                                        <input
                                            type="password"
                                            id={field}
                                            name={field}
                                            placeholder={field === 'senha' ? 'Digite nova senha' : 'Confirme nova senha'}
                                            value={formData[field]}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            className="flex-1 bg-transparent outline-none text-gray-700"
                                        />
                                    </div>
                                    {errors[field] && <span className="text-red-500 text-sm mt-1 block">{errors[field]}</span>}
                                </div>
                            ))}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-sm">
                                Deixe em branco se não deseja alterar a senha atual.
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-violet-400 text-white rounded-lg font-semibold hover:bg-violet-500 transition disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                        >
                            Restaurar padrão
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;

