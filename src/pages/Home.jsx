import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllServices, filterServicesByCategory } from '../services/serviceService';
import { Search, Star, MapPin, DollarSign } from 'lucide-react';
import UserNavigation from '../components/UserNavigation';

function Home() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = ['Todos', 'Elétrica', 'Hidráulica', 'Refrigeração', 'Limpeza', 'Jardinagem'];

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchTerm, selectedCategory, services]);

  const loadServices = async () => {
    setLoading(true);
    const result = await getAllServices();
    if (result.success) {
      setServices(result.data);
      setFilteredServices(result.data);
    }
    setLoading(false);
  };

  const filterServices = () => {
    let filtered = services;

    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter((service) => service.category?.categoryName === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((service) => service.title.toLowerCase().includes(searchTerm.toLowerCase()) || service.details.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setFilteredServices(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com Navegação */}
      <UserNavigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-violet-400 to-yellow-400 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Encontre o profissional ideal</h2>
          <p className="text-xl mb-8">Conecte-se com os melhores prestadores de serviço</p>

          {/* Search Bar */}
          <div className="bg-white rounded-lg p-2 flex items-center max-w-2xl">
            <Search className="text-gray-400 ml-2" />
            <input type="text" placeholder="Buscar serviços..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 px-4 py-2 outline-none text-gray-800" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button key={category} onClick={() => setSelectedCategory(category)} className={`px-6 py-2 rounded-full whitespace-nowrap transition ${selectedCategory === category ? 'bg-yellow-400 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400"></div>
            <p className="mt-4 text-gray-600">Carregando serviços...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum serviço encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.serviceId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden" onClick={() => navigate(`/servico/${service.serviceId}`)}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${service.serviceStatus === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{service.serviceStatus}</span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{service.details}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{service.professional?.userName || 'Profissional'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-5 h-5 text-yellow-500" />
                      <span className="text-2xl font-bold text-violet-800">{service.price?.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>

                  {service.category && (
                    <div className="mt-4 pt-4 border-t">
                      <span className="inline-block px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm">{service.category.categoryName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
