import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavigation from '../components/UserNavigation';
import { useAuth } from '../hooks/useAuth';
import { createService } from '../services/serviceService';
import { Briefcase, DollarSign, FileText, Tag, ArrowLeft } from 'lucide-react';

function CreateService() {
    const { user, isProfessional } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        details: '',
        category: '',
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

    // Verificar se é profissional
    if (!isProfessional()) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Apenas profissionais podem criar serviços</p>
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

        // Validação especial para o campo de preço
        if (name === 'price') {
            // Permitir apenas números e ponto decimal
            const priceValue = value.replace(',', '.'); // Substituir vírgula por ponto
            if (priceValue && !/^\d*\.?\d{0,2}$/.test(priceValue)) {
                return; // Não atualizar se não for um formato válido
            }
            setFormData((prev) => ({ ...prev, [name]: priceValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Validação do título (2-125 caracteres)
        if (!formData.title || formData.title.trim().length < 2) {
            newErrors.title = 'Título deve ter pelo menos 2 caracteres';
        } else if (formData.title.length > 125) {
            newErrors.title = 'Título deve ter no máximo 125 caracteres';
        }

        // Validação do preço (mínimo 0.01, máximo 999999.99)
        const price = parseFloat(formData.price);
        if (!formData.price || isNaN(price) || price < 0.01) {
            newErrors.price = 'Preço deve ser maior que zero (mínimo R$ 0,01)';
        } else if (price > 999999.99) {
            newErrors.price = 'Preço deve ser no máximo R$ 999.999,99';
        }

        // Validação dos detalhes (25-250 caracteres)
        if (!formData.details || formData.details.trim().length < 25) {
            newErrors.details = 'Detalhes devem ter pelo menos 25 caracteres';
        } else if (formData.details.length > 250) {
            newErrors.details = 'Detalhes devem ter no máximo 250 caracteres';
        }

        // Validação da categoria (2-80 caracteres)
        if (!formData.category || formData.category.trim().length < 2) {
            newErrors.category = 'Categoria é obrigatória';
        } else if (formData.category.length > 80) {
            newErrors.category = 'Categoria deve ter no máximo 80 caracteres';
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
            // Formatar dados conforme especificação da API
            const serviceData = {
                title: formData.title.trim(),
                price: parseFloat(formData.price).toFixed(2), // Garantir 2 casas decimais
                details: formData.details.trim(),
                category: formData.category.trim(),
                serviceStatus: 'Ativo',
            };

            console.log('Enviando dados do serviço:', serviceData);

            const result = await createService(user.id, serviceData);

            if (result.success) {
                alert('✅ Serviço criado com sucesso!');
                navigate('/dashboard');
            } else {
                alert(`❌ ${result.message || 'Erro ao criar serviço'}`);
            }
        } catch (error) {
            console.error('Erro ao criar serviço:', error);
            alert('❌ Erro inesperado ao criar serviço. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-3xl font-bold text-gray-800">Criar Novo Serviço</h1>
                    <p className="text-gray-600 mt-2">Preencha os dados do serviço que você oferece</p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* Título */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Briefcase className="w-4 h-4 inline mr-2" />
                            Título do Serviço *
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
                            Categoria *
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
                            Preço (R$) *
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

                    {/* Detalhes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 inline mr-2" />
                            Detalhes do Serviço *
                        </label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            placeholder="Descreva detalhadamente o serviço que você oferece, sua experiência, ferramentas utilizadas, etc."
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
                            {loading ? 'Criando...' : 'Criar Serviço'}
                        </button>
                    </div>
                </form>

                {/* Informações Adicionais */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">💡 Dicas para um bom serviço:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Seja claro e específico no título</li>
                        <li>• Descreva detalhadamente o que você oferece</li>
                        <li>• Mencione sua experiência e qualificações</li>
                        <li>• Defina um preço justo e competitivo</li>
                        <li>• Escolha a categoria correta para facilitar a busca</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CreateService;
