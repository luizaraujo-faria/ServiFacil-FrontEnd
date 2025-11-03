import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUser } from '../services/auth';
import { ChevronDown, LogOut, User } from 'lucide-react';

/**
 * Header simplificado com dropdown de perfil
 */
function UserHeader() {
    const { user, isProfessional, isClient, logout } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div
                        className="text-2xl font-bold text-violet-400 cursor-pointer hover:text-violet-500 transition-colors"
                        onClick={handleLogoClick}
                    >
                        ServiFacil
                    </div>

                    {/* Menu de Navegação */}
                    <div className="flex items-center space-x-6">
                        {isClient() && (
                            <>
                                <Link
                                    to="/home"
                                    className="text-gray-700 hover:text-violet-400 transition-colors font-medium"
                                >
                                    Serviços
                                </Link>
                                <Link
                                    to="/meus-agendamentos"
                                    className="text-gray-700 hover:text-violet-400 transition-colors font-medium"
                                >
                                    Agendamentos
                                </Link>
                            </>
                        )}

                        {isProfessional() && (
                            <Link
                                to="/dashboard"
                                className="text-gray-700 hover:text-violet-400 transition-colors font-medium"
                            >
                                Dashboard
                            </Link>
                        )}

                        {/* Dropdown do Perfil */}
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                <div className="w-10 h-10 bg-violet-400 rounded-full flex items-center justify-center text-white font-bold">
                                    {getUserInitials()}
                                </div>
                                <div className="hidden md:flex flex-col items-start">
                                    <span className="text-sm font-medium text-gray-700">
                                        {loading ? 'Carregando...' : userData?.userName || user?.email}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {isProfessional() ? 'Profissional' : 'Cliente'}
                                    </span>
                                </div>
                                <ChevronDown size={16} className="text-gray-500" />
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                                    <Link
                                        to="/perfil"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <User size={18} />
                                        <span>Meu Perfil</span>
                                    </Link>
                                    <hr className="my-2" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        <span>Sair</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay para fechar dropdown ao clicar fora */}
            {dropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                />
            )}
        </header>
    );
}

export default UserHeader;
