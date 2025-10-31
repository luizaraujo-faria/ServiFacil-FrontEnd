import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserNavigation from '../components/UserNavigation';
import { useAuth } from '../hooks/useAuth';
import { getAllServices, updateService, deleteService } from '../services/serviceService';
import { Briefcase, DollarSign, FileText, Tag, ArrowLeft, Trash2 } from 'lucide-react';

function EditService() {
    const { user, isProfessional } = useAuth();
    const navigate = useNavigate();
    const { serviceId } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        details: '',
        category: '',
        serviceStatus: 'Ativo',
    });
    const [errors, setErrors] = useState({});

    const categories = [
        'Elétrica',
        'Hidráulica',
        'Refrigeração',
        'Limpeza',
        'Jardinagem',
        'Pintura',
        'Marcenaria',
        'Alvenaria',
        'Serralheria',
        'Outros'
    ];

    const statusOptions = ['Ativo', 'Inativo', 'Pausado'];

    // Função para carregar dados do serviço
    const loadServiceData = async () => {
        console.log('=== INICIANDO CARREGAMENTO ===');
        setLoadingData(true);

        try {
            console.log('1. serviceId:', serviceId);
            console.log('2. Tipo do serviceId:', typeof serviceId);

            // Buscar todos os serviços e filtrar pelo ID
            console.log('3. Chamando getAllServices...');
            const result = await getAllServices();
            console.log('4. Resultado completo:', result);

            if (result.success && result.data) {
                console.log('5. Total de serviços:', result.data.length);
                console.log('6. Todos os serviços:', result.data);

                const service = result.data.find(s => {
                    console.log(`Comparando: ${s.serviceId} === ${parseInt(serviceId)}`);
                    return s.serviceId === parseInt(serviceId);
                });

                console.log('7. Serviço encontrado:', service);

                if (service) {
                    // Obter userId do user ou localStorage
                    const userId = user?.id || parseInt(localStorage.getItem('userId'));

                    console.log('8. User ID:', userId);
                    console.log('9. Professional ID:', service.professional?.userId);

                    // Verificar se o serviço pertence ao profissional logado
                    if (service.professional?.userId !== userId) {
                        console.log('10. ERRO: Serviço não pertence ao usuário');
                        alert('❌ Você não tem permissão para editar este serviço');
                        navigate('/dashboard');
                        return;
                    }

                    const dadosFormulario = {
                        title: service.title || '',
                        price: service.price?.toString() || '',
                        details: service.details || '',
                        category: service.category?.category || '',
                        serviceStatus: service.serviceStatus || 'Ativo',
                    };

                    console.log('11. Dados para o formulário:', dadosFormulario);

                    setFormData(dadosFormulario);

                    console.log('12. FormData atualizado!');
                } else {
                    console.log('ERRO: Serviço não encontrado na lista');
                    alert('❌ Serviço não encontrado');
                    navigate('/dashboard');
                }
            } else {
                console.log('ERRO: Falha ao buscar serviços ou data vazio');
                alert('❌ Erro ao carregar serviços');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('ERRO EXCEPTION:', error);
            alert('❌ Erro ao carregar dados do serviço');
            navigate('/dashboard');
        } finally {
            console.log('=== FINALIZANDO CARREGAMENTO ===');
            setLoadingData(false);
        }
    };

    // useEffect para carregar dados quando o componente montar
    useEffect(() => {
        console.log('useEffect executado!');
        console.log('serviceId:', serviceId);
        console.log('isProfessional():', isProfessional());
        console.log('user:', user);

        loadServiceData();
    }, [serviceId]);

    // Verificar se é profissional
    if (!isProfessional()) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Apenas profissionais podem editar serviços</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-4 py-2 bg-violet-400 text-white rounded-lg hover:bg-violet-500"
                    >
                        Voltar para Home
                    </button>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'price') {
            const priceValue = value.replace(',', '.');
            if (priceValue && !/^\d*\.?\d{0,2}$/.test(priceValue)) {
                return;
            }
            setFormData((prev) => ({ ...prev, [name]: priceValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (formData.title && formData.title.trim().length < 2) {
            newErrors.title = 'Título deve ter pelo menos 2 caracteres';
        } else if (formData.title && formData.title.length > 125) {
            newErrors.title = 'Título deve ter no máximo 125 caracteres';
        }

        const price = parseFloat(formData.price);
        if (formData.price && (isNaN(price) || price < 0.01)) {
            newErrors.price = 'Preço deve ser maior que zero (mínimo R$ 0,01)';
        } else if (formData.price && price > 999999.99) {
            newErrors.price = 'Preço deve ser no máximo R$ 999.999,99';
        }

        if (formData.details && formData.details.trim().length < 25) {
            newErrors.details = 'Detalhes devem ter pelo menos 25 caracteres';
        } else if (formData.details && formData.details.length > 250) {
            newErrors.details = 'Detalhes devem ter no máximo 250 caracteres';
        }

        if (formData.category && formData.category.trim().length < 2) {
            newErrors.category = 'Categoria inválida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Por favor, corrija os erros no formulário antes de continuar.');
            return;
        }

        setLoading(true);

        try {
            const serviceData = {
                title: formData.title.trim() || null,
                price: formData.price ? parseFloat(formData.price).toFixed(2) : null,
                details: formData.details.trim() || null,
                category: formData.category.trim() || null,
                serviceStatus: formData.serviceStatus || null,
            };

            console.log('Atualizando serviço:', serviceData);

            const result = await updateService(user.id, serviceId, serviceData);

            if (result.success) {
                alert('✅ Serviço atualizado com sucesso!');
                navigate('/dashboard');
            } else {
                alert(`❌ ${result.message || 'Erro ao atualizar serviço'}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar serviço:', error);
            alert('❌ Erro inesperado ao atualizar serviço. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            '⚠️ Tem certeza que deseja excluir este serviço?\n\nEsta ação não pode ser desfeita!'
        );

        if (!confirmDelete) return;

        setDeleting(true);

        try {
            const result = await deleteService(user.id, serviceId);

            if (result.success) {
                alert('✅ Serviço excluído com sucesso!');
                navigate('/dashboard');
            } else {
                alert(`❌ ${result.message || 'Erro ao excluir serviço'}`);
            }
        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            alert('❌ Erro inesperado ao excluir serviço. Tente novamente.');
        } finally {
            setDeleting(false);
        }
    };

    // Loading state
    if (loadingData) {
        return (
            <div className="min-h-screen bg-gray-50">
                <UserNavigation />
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400"></div>
                        <p className="mt-4 text-gray-600">Carregando dados do serviço...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <UserNavigation />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-violet-400 mb-4"
                    >
                        <ArrowLeft size={20} />
                        Voltar para Dashboard
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Editar Serviço</h1>
                            <p className="text-gray-600 mt-2">Atualize as informações do seu serviço</p>
                        </div>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Trash2 size={18} />
                            {deleting ? 'Excluindo...' : 'Excluir'}
                        </button>
                    </div>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* Título */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Briefcase className="w-4 h-4 inline mr-2" />
                            Título do Serviço
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ex: Instalação Elétrica Residencial"
                            maxLength={125}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 ${errors.title ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        <p className="text-gray-500 text-xs mt-1">{formData.title.length}/125 caracteres</p>
                    </div>

                    {/* Categoria */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Tag className="w-4 h-4 inline mr-2" />
                            Categoria
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 ${errors.category ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>

                    {/* Preço */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <DollarSign className="w-4 h-4 inline mr-2" />
                            Preço (R$)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                            <input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 ${errors.price ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                        </div>
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        <p className="text-gray-500 text-xs mt-1">
                            Valor por hora ou por serviço (máximo R$ 999.999,99)
                        </p>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status do Serviço
                        </label>
                        <select
                            name="serviceStatus"
                            value={formData.serviceStatus}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <p className="text-gray-500 text-xs mt-1">
                            Ativo: visível para clientes | Inativo/Pausado: oculto
                        </p>
                    </div>

                    {/* Detalhes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 inline mr-2" />
                            Detalhes do Serviço
                        </label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            placeholder="Descreva detalhadamente o serviço que você oferece..."
                            rows={6}
                            maxLength={250}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none ${errors.details ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details}</p>}
                        <p className="text-gray-500 text-xs mt-1">
                            {formData.details.length}/250 caracteres (mínimo 25)
                        </p>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>

                {/* Informações */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Informações:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Deixe campos em branco para manter os valores atuais</li>
                        <li>• Serviços inativos não aparecem para os clientes</li>
                        <li>• A exclusão é permanente e não pode ser desfeita</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default EditService;
