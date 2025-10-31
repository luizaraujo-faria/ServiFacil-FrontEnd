import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllServices, deleteService } from '../services/serviceService';
import { concludeAppointment, getServiceAppointments } from '../services/appointmentService';
import reviewService from '../services/reviewService';
import { Plus, Calendar, DollarSign, Star, Clock, User, CheckCircle } from 'lucide-react';
import UserNavigation from '../components/UserNavigation';
import ServiceCard from '../components/ServiceCard';

function ProfessionalDashboard() {
    console.log('🚀 ProfessionalDashboard renderizado');

    const [myServices, setMyServices] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('services');
    const [appointmentStatus, setAppointmentStatus] = useState('Pendente');
    const [serviceRatings, setServiceRatings] = useState({});
    const [averageRating, setAverageRating] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    useEffect(() => {
        if (myServices.length > 0) {
            loadAppointments();
        }
    }, [activeTab, appointmentStatus, myServices.length]);

    const loadDashboardData = async () => {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        const userType = localStorage.getItem('userType');

        console.log('🔍 loadDashboardData - userId:', userId, 'userType:', userType);

        // Verificar se é profissional
        if (userType !== 'Profissional') {
            alert('Acesso restrito a profissionais');
            navigate('/home');
            return;
        }

        // Carregar serviços do profissional
        console.log('📞 Buscando todos os serviços...');
        const servicesResult = await getAllServices();
        console.log('📦 Resultado getAllServices:', servicesResult);

        if (servicesResult.success) {
            console.log('✅ Total de serviços retornados:', servicesResult.data.length);

            // Filtrar apenas os serviços do profissional logado
            const filtered = servicesResult.data.filter(
                (service) => service.professional?.userId === parseInt(userId)
            );

            console.log('🔍 Serviços filtrados para o profissional:', filtered.length);
            console.log('📋 Serviços:', filtered);

            setMyServices(filtered);

            // Carregar avaliações de cada serviço
            await loadServiceRatings(filtered);
        } else {
            console.error('❌ Erro ao carregar serviços:', servicesResult.message);
        }

        setLoading(false);
    };

    const loadServiceRatings = async (services) => {
        const ratings = {};
        let totalRating = 0;
        let totalServices = 0;

        for (const service of services) {
            try {
                const result = await reviewService.getServiceRating(service.serviceId);
                if (result.success && result.data) {
                    const avgRating = parseFloat(result.data.average_rating) || 0;
                    const totalReviews = parseInt(result.data.total_reviews) || 0;

                    ratings[service.serviceId] = {
                        average: avgRating,
                        total: totalReviews
                    };

                    if (totalReviews > 0) {
                        totalRating += avgRating;
                        totalServices++;
                    }
                }
            } catch (error) {
                console.error(`Erro ao carregar avaliações do serviço ${service.serviceId}:`, error);
            }
        }

        setServiceRatings(ratings);
        setAverageRating(totalServices > 0 ? (totalRating / totalServices).toFixed(1) : 0);
    };

    const loadAppointments = async () => {
        if (myServices.length === 0) {
            console.log('⚠️ Nenhum serviço encontrado para carregar agendamentos');
            setAllAppointments([]);
            return;
        }

        console.log('🔍 Carregando agendamentos para', myServices.length, 'serviços');
        console.log('📋 Status:', appointmentStatus);

        try {
            // Buscar agendamentos de cada serviço usando o service (que trata 404)
            const allAppointmentsPromises = myServices.map(async (service) => {
                console.log(`📞 Buscando agendamentos do serviço ${service.serviceId} (${service.title})`);
                console.log(`   - Professional ID: ${service.professional.userId}`);
                console.log(`   - Service ID: ${service.serviceId}`);
                console.log(`   - Status: ${appointmentStatus}`);

                const result = await getServiceAppointments(
                    service.professional.userId,
                    service.serviceId,
                    appointmentStatus
                );

                console.log(`✅ Resultado do serviço ${service.serviceId}:`, result);
                return result.success ? result.data : [];
            });

            const results = await Promise.all(allAppointmentsPromises);
            console.log('📦 Resultados de todos os serviços:', results);

            const appointments = results.flat();
            console.log('✨ Total de agendamentos encontrados:', appointments.length);
            console.log('📋 Agendamentos:', appointments);

            setAllAppointments(appointments);

            // Atualizar contador de pendentes se estiver carregando pendentes
            if (appointmentStatus === 'Pendente') {
                setPendingCount(appointments.length);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar agendamentos:', error);
            setAllAppointments([]);
        }
    };

    const handleConcludeAppointment = async (appointment) => {
        const clientId = appointment.client?.userId;

        if (!clientId) {
            alert('❌ Erro: Cliente não encontrado');
            return;
        }

        // Fazer requisição direta com o token do profissional
        // mas usando o clientId no path (conforme backend espera)
        try {
            const response = await fetch(
                `http://localhost:8081/api/appointments/conclude/${clientId}/${appointment.appointmentId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            const result = await response.json();

            if (response.ok) {
                alert('✅ Agendamento marcado como concluído!');
                loadAppointments();
            } else {
                alert(`❌ ${result.message || 'Erro ao concluir agendamento'}`);
            }
        } catch (error) {
            console.error('Erro ao concluir agendamento:', error);
            alert('❌ Erro ao concluir agendamento');
        }
    };

    // Função para converter data do formato dd/MM/yyyy HH:mm para Date
    const parseDate = (dateString) => {
        if (!dateString) return null;
        if (dateString instanceof Date) return dateString;
        if (dateString.includes('T')) return new Date(dateString);

        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart ? timePart.split(':') : ['00', '00'];

        return new Date(year, month - 1, day, hours, minutes);
    };

    const formatDate = (dateString) => {
        const date = parseDate(dateString);
        if (!date || isNaN(date.getTime())) return 'Data inválida';

        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        const date = parseDate(dateString);
        if (!date || isNaN(date.getTime())) return '--:--';

        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleCreateService = () => {
        navigate('/criar-servico');
    };

    const handleEditService = (serviceId) => {
        navigate(`/editar-servico/${serviceId}`);
    };

    const handleDeleteService = async (serviceId) => {
        const userId = localStorage.getItem('userId');

        const result = await deleteService(parseInt(userId), serviceId);

        if (result.success) {
            alert('✅ Serviço excluído com sucesso!');
            // Recarregar lista de serviços
            loadDashboardData();
        } else {
            alert(`❌ ${result.message || 'Erro ao excluir serviço'}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400"></div>
                    <p className="mt-4 text-gray-600">Carregando dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header com Navegação */}
            <UserNavigation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Botão Novo Serviço */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={handleCreateService}
                        className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        Novo Serviço
                    </button>
                </div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Serviços Ativos</p>
                                <p className="text-3xl font-bold text-violet-800">{myServices.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-violet-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Agendamentos Pendentes</p>
                                <p className="text-3xl font-bold text-yellow-600">
                                    {pendingCount}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Avaliação Média</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl font-bold text-green-600">
                                        {averageRating > 0 ? averageRating : '-'}
                                    </p>
                                    {averageRating > 0 && (
                                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                    )}
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Star className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`px-6 py-2 rounded-lg transition ${activeTab === 'services'
                            ? 'bg-yellow-400 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Meus Serviços
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`px-6 py-2 rounded-lg transition ${activeTab === 'appointments'
                            ? 'bg-yellow-400 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Agendamentos Recebidos
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'services' && (
                    <div>
                        {myServices.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Nenhum serviço cadastrado
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Comece criando seu primeiro serviço para receber agendamentos
                                </p>
                                <button
                                    onClick={handleCreateService}
                                    className="px-6 py-3 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
                                >
                                    Criar Primeiro Serviço
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myServices.map((service) => (
                                    <ServiceCard
                                        key={service.serviceId}
                                        service={service}
                                        onDelete={handleDeleteService}
                                        rating={serviceRatings[service.serviceId]}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div>
                        {/* Tabs de Status */}
                        <div className="flex gap-2 mb-6">
                            {['Pendente', 'Concluido', 'Cancelado'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setAppointmentStatus(status)}
                                    className={`px-6 py-2 rounded-lg transition ${appointmentStatus === status
                                        ? 'bg-violet-400 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        {/* Lista de Agendamentos */}
                        {allAppointments.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Nenhum agendamento {appointmentStatus.toLowerCase()}
                                </h3>
                                <p className="text-gray-600">
                                    Quando clientes agendarem seus serviços, eles aparecerão aqui
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {allAppointments.map((appointment) => (
                                    <div
                                        key={appointment.appointmentId}
                                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                    {appointment.service?.title || 'Serviço'}
                                                </h3>

                                                <div className="space-y-2 mb-3">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <User className="w-4 h-4" />
                                                        <span className="font-medium">
                                                            Cliente: {appointment.client?.userName || 'N/A'}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            {formatDate(appointment.startDate)} - {formatDate(appointment.endDate)}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Clock className="w-4 h-4" />
                                                        <span>
                                                            {formatTime(appointment.startDate)} - {formatTime(appointment.endDate)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-5 h-5 text-yellow-500" />
                                                    <span className="text-xl font-bold text-violet-800">
                                                        {appointment.service?.price?.toFixed(2) || '0.00'}
                                                    </span>
                                                </div>

                                                <div className="mt-3">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-sm ${appointment.appointmentStatus === 'Pendente'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : appointment.appointmentStatus === 'Concluido'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {appointment.appointmentStatus}
                                                    </span>
                                                </div>
                                            </div>

                                            {appointment.appointmentStatus === 'Pendente' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleConcludeAppointment(appointment)}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        Concluir
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfessionalDashboard;
