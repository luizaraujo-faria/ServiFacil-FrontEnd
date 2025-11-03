import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUser } from '../services/auth';
import { Edit2, Save, X, User, Mail, Phone, Calendar, MapPin, Briefcase, CreditCard, Home } from 'lucide-react';
import UserNavigation from '../components/UserNavigation';
import PhotoUpload from '../components/PhotoUpload';
import { useAuth } from '../hooks/useAuth';

function Profile() {
    const { logout } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        userPassword: '',
        telephone: '',
        profession: '',
        cpf: '',
        rg: '',
        cnpj: '',
        birthDate: '',
        profilePhoto: '',
        zipCode: '',
        street: '',
        houseNumber: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        setLoading(true);
        const userId = localStorage.getItem('userId');

        if (!userId) {
            navigate('/');
            return;
        }

        const result = await getUser(userId);

        if (result.success) {
            setUser(result.data);
            setFormData({
                userName: result.data.userName || '',
                email: result.data.email || '',
                userPassword: '', // Não carregar senha por segurança
                telephone: result.data.telephone || '',
                profession: result.data.profession || '',
                cpf: result.data.cpf || '',
                rg: result.data.rg || '',
                cnpj: result.data.cnpj || '',
                birthDate: result.data.birthDate || '',
                profilePhoto: result.data.profilePhoto || '',
                zipCode: result.data.address?.zipCode || '',
                street: result.data.address?.street || '',
                houseNumber: result.data.address?.houseNumber || '',
                complement: result.data.address?.complement || '',
                neighborhood: result.data.address?.neighborhoodID?.neighborhood || '',
                city: result.data.address?.cityID?.city || '',
                state: result.data.address?.stateID?.state || '',
            });
        } else {
            alert('Erro ao carregar dados do usuário: ' + result.message);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handlePhotoChange = (photoBase64) => {
        setFormData((prev) => ({ ...prev, profilePhoto: photoBase64 }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.userName || formData.userName.length < 2) {
            newErrors.userName = 'Nome deve ter pelo menos 2 caracteres';
        }

        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.telephone) {
            newErrors.telephone = 'Telefone é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setSaving(true);
        const userId = localStorage.getItem('userId');

        // Criar cópia dos dados sem a senha se estiver vazia
        const dataToSend = { ...formData };
        if (!dataToSend.userPassword || dataToSend.userPassword.trim() === '') {
            delete dataToSend.userPassword; // Não enviar senha se estiver vazia
        }

        console.log('Dados sendo enviados:', dataToSend);

        try {
            const result = await updateUser(userId, dataToSend);

            if (result.success) {
                alert('Perfil atualizado com sucesso!');
                setEditing(false);
                loadUserData();
            } else {
                alert(result.message || 'Erro ao atualizar perfil');
            }
        } catch (error) {
            console.error('Erro ao atualizar:', error);
            alert('Erro ao atualizar perfil: ' + (error.response?.data?.message || error.message));
        }

        setSaving(false);
        return;

        if (result.success) {
            alert('Perfil atualizado com sucesso!');
            setEditing(false);
            loadUserData();
        } else {
            alert(result.message);
        }
        setSaving(false);
    };

    const handleCancel = () => {
        setFormData({
            userName: user.userName || '',
            email: user.email || '',
            telephone: user.telephone || '',
            profession: user.profession || '',
            cpf: user.cpf || '',
            rg: user.rg || '',
            cnpj: user.cnpj || '',
            birthDate: user.birthDate || '',
            zipCode: user.address?.zipCode || '',
            street: user.address?.street || '',
            houseNumber: user.address?.houseNumber || '',
            complement: user.address?.complement || '',
            neighborhood: user.address?.neighborhoodID?.neighborhood || '',
            city: user.address?.cityID?.city || '',
            state: user.address?.stateID?.state || '',
        });
        setErrors({});
        setEditing(false);
    };

    const formatCPF = (cpf) => {
        if (!cpf) return 'Não informado';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatCNPJ = (cnpj) => {
        if (!cnpj) return 'Não informado';
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400"></div>
                    <p className="mt-4 text-gray-600">Carregando perfil...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">Erro ao carregar perfil</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="mt-4 px-4 py-2 bg-violet-400 text-white rounded-lg hover:bg-violet-500"
                    >
                        Voltar para Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header com Navegação */}
            <UserNavigation />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-violet-400 to-yellow-400 h-32"></div>

                    <div className="px-6 pb-6">
                        {/* Avatar */}
                        <div className="flex items-end justify-between -mt-16 mb-6">
                            <div className="flex items-end gap-4">
                                {editing ? (
                                    <div className="bg-white rounded-full border-4 border-white shadow-lg p-4">
                                        <PhotoUpload
                                            currentPhoto={formData.profilePhoto}
                                            onPhotoChange={handlePhotoChange}
                                            userName={formData.userName}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                                        {user.profilePhoto ? (
                                            <img
                                                src={user.profilePhoto}
                                                alt="Foto de perfil"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-violet-400 flex items-center justify-center text-white text-3xl font-bold">
                                                {user.userName?.substring(0, 2).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="mb-2">
                                    <h2 className="text-2xl font-bold text-gray-800">{user.userName}</h2>
                                    <p className="text-gray-600">{user.userType}</p>
                                </div>
                            </div>

                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition mb-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Editar Perfil
                                </button>
                            )}

                            {editing && (
                                <div className="flex gap-2 mb-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? 'Salvando...' : 'Salvar'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Informações Pessoais */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações Pessoais</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Nome */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <User className="w-4 h-4 inline mr-2" />
                                            Nome Completo
                                        </label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="userName"
                                                value={formData.userName}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 ${errors.userName ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2">{user.userName}</p>
                                        )}
                                        {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Mail className="w-4 h-4 inline mr-2" />
                                            Email
                                        </label>
                                        {editing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2">{user.email}</p>
                                        )}
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                    {/* Telefone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Phone className="w-4 h-4 inline mr-2" />
                                            Telefone
                                        </label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="telephone"
                                                value={formData.telephone}
                                                onChange={handleChange}
                                                placeholder="(XX) XXXXX-XXXX"
                                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 ${errors.telephone ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2">{user.telephone}</p>
                                        )}
                                        {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                                    </div>

                                    {/* Senha (apenas em edição) */}
                                    {editing && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                🔒 Nova Senha (opcional)
                                            </label>
                                            <input
                                                type="password"
                                                name="userPassword"
                                                value={formData.userPassword}
                                                onChange={handleChange}
                                                placeholder="Deixe em branco para manter a atual"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                                        </div>
                                    )}

                                    {/* Data de Nascimento */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Calendar className="w-4 h-4 inline mr-2" />
                                            Data de Nascimento
                                        </label>
                                        {editing ? (
                                            <input
                                                type="date"
                                                name="birthDate"
                                                value={formData.birthDate}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2">{user.birthDate}</p>
                                        )}
                                    </div>

                                    {/* CPF */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <CreditCard className="w-4 h-4 inline mr-2" />
                                            CPF
                                        </label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="cpf"
                                                value={formData.cpf}
                                                onChange={handleChange}
                                                placeholder="000.000.000-00"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2">{formatCPF(user.cpf)}</p>
                                        )}
                                    </div>

                                    {/* RG */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <CreditCard className="w-4 h-4 inline mr-2" />
                                            RG
                                        </label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="rg"
                                                value={formData.rg}
                                                onChange={handleChange}
                                                placeholder="00.000.000-0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2">{user.rg || 'Não informado'}</p>
                                        )}
                                    </div>

                                    {/* Profissão */}
                                    {user.userType === 'Profissional' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    <Briefcase className="w-4 h-4 inline mr-2" />
                                                    Profissão
                                                </label>
                                                {editing ? (
                                                    <input
                                                        type="text"
                                                        name="profession"
                                                        value={formData.profession}
                                                        onChange={handleChange}
                                                        placeholder="Ex: Desenvolvedor, Designer..."
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                                    />
                                                ) : (
                                                    <p className="text-gray-800 py-2">{user.profession || 'Não informado'}</p>
                                                )}
                                            </div>

                                            {/* CNPJ */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    <CreditCard className="w-4 h-4 inline mr-2" />
                                                    CNPJ (opcional)
                                                </label>
                                                {editing ? (
                                                    <input
                                                        type="text"
                                                        name="cnpj"
                                                        value={formData.cnpj}
                                                        onChange={handleChange}
                                                        placeholder="00.000.000/0000-00"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                                    />
                                                ) : (
                                                    <p className="text-gray-800 py-2">{formatCNPJ(user.cnpj)}</p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Endereço */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    <MapPin className="w-5 h-5 inline mr-2" />
                                    Endereço
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* CEP */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                placeholder="12345-678"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2">{user.address?.zipCode || 'Não informado'}</p>
                                        )}
                                    </div>

                                    {/* Rua */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="street"
                                                value={formData.street}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2">{user.address?.street || 'Não informado'}</p>
                                        )}
                                    </div>

                                    {/* Número */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="houseNumber"
                                                value={formData.houseNumber}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2">{user.address?.houseNumber || 'Não informado'}</p>
                                        )}
                                    </div>

                                    {/* Complemento */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="complement"
                                                value={formData.complement}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2">{user.address?.complement || 'Não informado'}</p>
                                        )}
                                    </div>

                                    {/* Bairro */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="neighborhood"
                                                value={formData.neighborhood}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2">{user.address?.neighborhoodID?.neighborhood || 'Não informado'}</p>
                                        )}
                                    </div>

                                    {/* Cidade */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2">{user.address?.cityID?.city || 'Não informado'}</p>
                                        )}
                                    </div>

                                    {/* Estado */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                maxLength={2}
                                                placeholder="PA"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2">{user.address?.stateID?.state || 'Não informado'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
