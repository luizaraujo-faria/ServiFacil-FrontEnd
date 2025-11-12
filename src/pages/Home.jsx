import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllServices, getAllCategories } from '../services/serviceService';
import reviewService from '../services/reviewService';
import { Search, Star, DollarSign, ChevronLeft, ChevronRight, User, Briefcase } from 'lucide-react';
import UserNavigation from '../components/UserNavigation';

// Função auxiliar para extrair o nome da categoria de forma segura
const getCategoryName = (category) => {
  if (!category) return null;

  if (typeof category === 'string') return category;
  if (typeof category === 'object' && category.name) return category.name;
  if (typeof category === 'object' && category.category) return category.category;

  return null;
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

      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-indigo-950 to-indigo-400 text-white py-16 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
            Encontre o <span className="text-yellow-300">Profissional</span> Ideal
          </h1>
          <p className="text-lg mb-8 opacity-90">Conecte-se com os melhores prestadores de serviço em sua região.</p>

          <div className="bg-white rounded-xl flex items-center max-w-2xl p-3 shadow-2xl">
            <Search className="text-gray-400 ml-2 w-5 h-5" />
            <input type="text" placeholder="Ex: Eletricista, Encanador, Desenvolvedor Web..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 px-4 py-2 outline-none text-gray-800 placeholder-gray-500 text-base" />
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4">
        {/* --- CATEGORIAS --- */}
        <div className="py-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Categorias</h2>

          {loadingCategories ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl shadow-inner"></div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 italic">Nenhuma categoria encontrada.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  className={`bg-white shadow-lg hover:shadow-xl rounded-xl p-6 text-center cursor-pointer transition transform hover:scale-[1.02] border ${selectedCategory === cat.name ? 'border-violet-500 ring-2 ring-violet-500' : 'border-gray-100'}`}
                  onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                >
                  <p className="text-xl font-semibold text-violet-700">{cat.name}</p>
                  {cat.details && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.details}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="my-8 border-gray-200" />

        {/* --- PROFISSIONAIS RECOMENDADOS --- */}
        <Section id="profissionais" title=" Profissionais Recomendados" loading={loading} items={filtered} ratings={ratings} navigate={navigate} scroll={scroll} showProfessional />

        <hr className="my-8 border-gray-200" />

        {/* --- SERVIÇOS POPULARES --- */}
        <Section id="servicos" title=" Serviços Populares" loading={loading} items={filtered} ratings={ratings} navigate={navigate} scroll={scroll} showProfessional={false} />
      </main>
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
      imageSrc = null; // Para usar o ícone User
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
      className="min-w-[280px] w-[280px] bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer flex flex-col justify-between overflow-hidden group hover:translate-y-[-2px]"
    >
      {/* 1. SEÇÃO DE IMAGEM/DESTAQUE */}
      {showProfessional ? (
        <div className="bg-indigo-500 pt-8 pb-4">
          <div className="w-24 h-24 rounded-full mx-auto relative z-10">
            {imageSrc ? (
              <img
                src={imageSrc}
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
          className="h-40 w-full object-cover rounded-t-xl"
          onError={(e) => {
            e.target.src = '/service-default.jpg';
          }}
        />
      ) : (
        <div className="bg-blue-100 text-blue-800 h-24 p-4 flex items-center rounded-t-xl border-b border-blue-200 group-hover:border-blue-500 transition duration-300">
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
            <span className="text-violet-700 font-bold text-xl">R$ {service.price.toFixed(2)}</span>
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
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(id, 'left')} className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition text-gray-700 border border-gray-200" aria-label={`Scroll para a esquerda na seção ${title}`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scroll(id, 'right')} className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition text-gray-700 border border-gray-200" aria-label={`Scroll para a direita na seção ${title}`}>
            <ChevronRight className="w-5 h-5" />
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
          {items.length === 0 ? <p className="text-gray-500 italic text-lg">Nenhum item encontrado.</p> : items.map((service) => <ServiceCard key={service.serviceId} service={service} ratings={ratings} navigate={navigate} showProfessional={showProfessional} />)}
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
