import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUser } from '../services/auth';
import { User, LogOut, Menu, X } from 'lucide-react';

/**
 * Componente de navegação adaptável ao tipo de usuário
 */
function UserNavigation() {
  const { user, isProfessional, isClient, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (user?.id) {
      setLoading(true);
      const result = await getUser(user.id);
      if (result.success) {
        setUserData(result.data);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleLogoClick = () => {
    if (isProfessional()) {
      navigate('/dashboard');
    } else {
      navigate('/home');
    }
  };

  const getUserInitials = () => {
    if (userData?.userName) {
      const names = userData.userName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return userData.userName.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-bold text-violet-400 cursor-pointer hover:text-violet-500 transition-colors" onClick={handleLogoClick}>
            ServiFacil
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {isClient() && (
              <>
                <Link to="/home" className="text-gray-700 hover:text-violet-400 transition-colors font-medium">
                  Serviços
                </Link>
                <Link to="/meus-agendamentos" className="text-gray-700 hover:text-violet-400 transition-colors font-medium">
                  Meus Agendamentos
                </Link>
              </>
            )}

            {isProfessional() && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-violet-400 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/minhas-avaliacoes" className="text-gray-700 hover:text-violet-400 transition-colors font-medium">
                  Minhas Avaliações
                </Link>
              </>
            )}

            {/* Perfil do Usuário */}
            <Link to="/perfil" className="flex items-center space-x-2 text-gray-700 hover:text-violet-400 transition-colors">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                {userData?.profilePhoto ? <img src={userData.profilePhoto} alt="Foto de perfil" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-violet-400 flex items-center justify-center text-white font-bold">{getUserInitials()}</div>}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userData?.userName || user?.email}</span>
                <span className="text-xs text-gray-500">{isProfessional() ? 'Profissional' : 'Cliente'}</span>
              </div>
            </Link>

            {/* Botão Sair */}
            <button onClick={handleLogout} className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>

          {/* Botão Menu Mobile */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-700 hover:text-violet-400">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* Perfil Mobile */}
              <Link to="/perfil" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                  {userData?.profilePhoto ? <img src={userData.profilePhoto} alt="Foto de perfil" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-violet-400 flex items-center justify-center text-white font-bold">{getUserInitials()}</div>}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">{loading ? 'Carregando...' : userData?.userName || user?.email}</span>
                  <span className="text-xs text-gray-500">{isProfessional() ? 'Profissional' : 'Cliente'}</span>
                </div>
              </Link>

              {/* Links Mobile */}
              {isClient() && (
                <>
                  <Link to="/home" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                    Serviços
                  </Link>
                  <Link to="/meus-agendamentos" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                    Meus Agendamentos
                  </Link>
                </>
              )}

              {isProfessional() && (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                    Dashboard
                  </Link>
                  <Link to="/minhas-avaliacoes" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                    Minhas Avaliações
                  </Link>
                </>
              )}

              {/* Botão Sair Mobile */}
              <button onClick={handleLogout} className="flex items-center justify-center space-x-2 mx-4 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default UserNavigation;
