import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllServices, getAllCategories } from '../services/serviceService';
import reviewService from '../services/reviewService';
import { Search, Star, DollarSign, ChevronLeft, ChevronRight, User, Briefcase, HomeIcon, Zap, Wrench, Monitor } from 'lucide-react';
import UserNavigation from '../components/UserNavigation';

// Função auxiliar para extrair o nome da categoria de forma segura
const getCategoryName = (category) => {
  if (!category) return null;

  if (typeof category === 'string') return category;
  if (typeof category === 'object' && category.name) return category.name;
  if (typeof category === 'object' && category.category) return category.category;

  return null;
};

const categoryIcons = {
  'Elétrica': Zap,
  'Mecânica': Wrench,
  'TI': Monitor,
  'Tecnologia': Monitor,
  'Informática': Monitor,
  'Eletrônica': Zap,
  'Manutenção': Wrench,
};

// --- Componente principal da Home ---
function Home() {
  const [services, setServices] = useState([]);
  const [ratings, setRatings] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  // Carregar categorias do banco
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const result = await getAllCategories();
      if (result.success) {
        const catList = result.data.map((c) => ({
          name: getCategoryName(c) || c.name || String(c),
        }));
        setCategories(catList.filter((c) => c.name));
      }
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Carregar serviços e avaliações
  const loadServices = async () => {
    try {
      setLoading(true);
      const result = await getAllServices();
      if (result.success) {
        setServices(result.data);

        const ratingsData = {};
        for (const service of result.data) {
          try {
            const ratingRes = await reviewService.getServiceRating(service.serviceId);
            ratingsData[service.serviceId] = ratingRes.averageRating || 0;
          } catch {
            ratingsData[service.serviceId] = 0;
          }
        }
        setRatings(ratingsData);
      }
    } catch (err) {
      console.error('Erro ao carregar serviços:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtro combinado (busca + categoria)
  const filtered = services.filter((s) => {
    const matchSearch = s.title?.toLowerCase().includes(searchTerm.toLowerCase()) || s.details?.toLowerCase().includes(searchTerm.toLowerCase());

    const serviceCategoryName = getCategoryName(s.category);

    const matchCategory = !selectedCategory || (serviceCategoryName && serviceCategoryName.toLowerCase() === selectedCategory.toLowerCase());

    return matchSearch && matchCategory;
  });

  // Scroll do carrossel
  const scroll = (id, dir) => {
    const container = document.getElementById(id);
    if (container) {
      const scrollAmount = 350;
      container.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavigation />

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-end gap-4">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Ex: Eletricista, Encanador, Desenvolvedor Web..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition text-gray-800 placeholder-gray-500 text-sm" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4">
        <div className="py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Categorias</h2>

          {loadingCategories ? (
            <div className="flex gap-6 overflow-x-auto pb-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="min-w-[180px] h-28 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 italic text-center py-8">Nenhuma categoria encontrada.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {categories.map((cat, index) => {
                const IconComponent = categoryIcons[cat.name] || Briefcase;
                return (
                  <div
                    key={index}
                    className={`bg-white rounded-xl p-6 text-center cursor-pointer transition hover:shadow-lg border-2 ${
                      selectedCategory === cat.name ? 'border-purple-500 shadow-md' : 'border-gray-100'
                    }`}
                    onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                  >
                    <div className="flex justify-center mb-3">
                      <IconComponent className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-lg font-semibold text-purple-600">{cat.name}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <hr className="my-8 border-gray-200" />

        <Section 
          id="profissionais" 
          title="Profissionais Recomendados" 
          loading={loading} 
          items={filtered} 
          ratings={ratings} 
          navigate={navigate} 
          scroll={scroll} 
          showProfessional 
        />

        <hr className="my-8 border-gray-200" />

        <Section 
          id="servicos" 
          title="Serviços Populares" 
          loading={loading} 
          items={filtered} 
          ratings={ratings} 
          navigate={navigate} 
          scroll={scroll} 
          showProfessional={false} 
        />
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// --- COMPONENTE CARD ---
function ServiceCard({ service, ratings, navigate, showProfessional }) {
  let imageSrc = '/service-default.jpg';
  let mainTitle = service.title;
  let subTitle = service.details;
  let rating = ratings[service.serviceId]?.toFixed(1) || '0.0';

  // Lógica para Profissionais (showProfessional = true)
  if (showProfessional) {
    mainTitle = service.professional?.userName || 'Profissional Desconhecido';
    subTitle = service.title;

    if (service.professional?.profilePhoto) {
      imageSrc = service.professional.profilePhoto.startsWith('data:image') ? service.professional.profilePhoto : `data:image/jpeg;base64,${service.professional.profilePhoto}`;
    } else {
      imageSrc = null;
    }
  }
  // Lógica para Serviços Populares (showProfessional = false)
  else {
    if (service.imageUrl) {
      imageSrc = service.imageUrl.startsWith('http') ? service.imageUrl : `data:image/jpeg;base64,${service.imageUrl}`;
    }
  }

  return (
    <div
      key={service.serviceId}
      onClick={() => navigate(`/servico/${service.serviceId}`)}
      className="min-w-[280px] w-[280px] bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer flex flex-col justify-between overflow-hidden group"
    >
      {/* 1. SEÇÃO DE IMAGEM/DESTAQUE */}
      {showProfessional ? (
        <div className="bg-indigo-500 pt-8 pb-4">
          <div className="w-24 h-24 rounded-full mx-auto relative z-10">
            {imageSrc ? (
              <img
                src={imageSrc || "/placeholder.svg"}
                alt={mainTitle}
                className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg">
                <User className="w-10 h-10 text-indigo-500" />
              </div>
            )}
          </div>
        </div>
      ) : service.imageUrl ? (
        <img
          src={imageSrc || '/service-default.jpg'}
          alt={mainTitle}
          className="h-40 w-full object-cover"
          onError={(e) => {
            e.target.src = '/service-default.jpg';
          }}
        />
      ) : (
        <div className="bg-blue-50 text-blue-800 h-24 p-4 flex items-center border-b border-blue-200">
          <Briefcase className="w-8 h-8 mr-3 opacity-80" />
          <h3 className="text-lg font-bold truncate">{mainTitle}</h3>
        </div>
      )}

      {/* 2. SEÇÃO DE TEXTO */}
      <div className={`p-4 flex flex-col flex-grow ${showProfessional ? 'text-center' : ''}`}>
        {showProfessional ? (
          <div className="-mt-4">
            <h3 className="text-xl font-bold text-gray-800 truncate mb-0">{mainTitle}</h3>
            <p className="text-sm text-gray-600 truncate mb-2">{subTitle}</p>
          </div>
        ) : (
          <div className="flex flex-col flex-grow">
            {!service.imageUrl && <h3 className="text-lg font-bold text-gray-800 line-clamp-2 min-h-[3rem] sr-only">{mainTitle}</h3>}
            <p className="text-sm text-gray-600 line-clamp-3 mb-3 flex-grow">{subTitle}</p>
          </div>
        )}
      </div>

      {/* 3. SEÇÃO DE RODAPÉ */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between mt-auto">
        {!showProfessional && service.price && (
          <div className="flex items-center gap-1">
            <span className="text-purple-700 font-bold text-xl">R$ {service.price.toFixed(2)}</span>
          </div>
        )}

        <div className={`flex items-center gap-1 ${!showProfessional ? 'ml-auto' : 'mx-auto'}`}>
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-md font-semibold text-gray-700">{rating}</span>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE SEÇÃO ---
function Section({ id, title, loading, items, ratings, navigate, scroll, showProfessional }) {
  return (
    <div className="py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll(id, 'left')} 
            className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition shadow-sm" 
            aria-label={`Scroll para a esquerda na seção ${title}`}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={() => scroll(id, 'right')} 
            className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition shadow-sm" 
            aria-label={`Scroll para a direita na seção ${title}`}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-6 overflow-x-auto pb-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[280px] h-64 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div id={id} className="flex gap-6 pb-4 overflow-x-auto scroll-smooth scrollbar-hide">
          {items.length === 0 ? (
            <p className="text-gray-500 italic text-lg">Nenhum item encontrado.</p>
          ) : (
            items.map((service) => (
              <ServiceCard 
                key={service.serviceId} 
                service={service} 
                ratings={ratings} 
                navigate={navigate} 
                showProfessional={showProfessional} 
              />
            ))
          )}
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default Home;
