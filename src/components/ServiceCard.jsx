import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, DollarSign, Tag, Star } from 'lucide-react';

function ServiceCard({ service, onDelete, rating }) {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/editar-servico/${service.serviceId}`);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            `⚠️ Tem certeza que deseja excluir o serviço "${service.title}"?\n\nEsta ação não pode ser desfeita!`
        );

        if (confirmDelete && onDelete) {
            await onDelete(service.serviceId);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
            {/* Header com Status */}
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800 flex-1">{service.title}</h3>
                <span
                    className={`px-3 py-1 rounded-full text-sm ml-2 ${service.serviceStatus === 'Ativo'
                        ? 'bg-green-100 text-green-800'
                        : service.serviceStatus === 'Pausado'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    {service.serviceStatus}
                </span>
            </div>

            {/* Detalhes */}
            <p className="text-gray-600 mb-4 line-clamp-2">{service.details}</p>

            {/* Preço e Categoria */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                    <DollarSign className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-bold text-violet-800">
                        {service.price?.toFixed(2)}
                    </span>
                </div>

                {service.category && (
                    <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4 text-violet-400" />
                        <span className="text-sm text-gray-600">{service.category.category}</span>
                    </div>
                )}
            </div>

            {/* Avaliações */}
            {rating && rating.total > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="text-lg font-bold text-gray-800">
                                {rating.average.toFixed(1)}
                            </span>
                        </div>
                        <span className="text-sm text-gray-600">
                            {rating.total} {rating.total === 1 ? 'avaliação' : 'avaliações'}
                        </span>
                    </div>
                </div>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-2 pt-4 border-t">
                <button
                    onClick={handleEdit}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-violet-400 text-white rounded-lg hover:bg-violet-500 transition"
                >
                    <Edit size={18} />
                    Editar
                </button>
                <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    <Trash2 size={18} />
                    Excluir
                </button>
            </div>
        </div>
    );
}

export default ServiceCard;
