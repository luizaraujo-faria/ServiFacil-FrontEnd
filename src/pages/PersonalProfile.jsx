import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, CheckCircle2, Edit3, LogOut } from 'lucide-react';
import UserNavigation from '../components/UserNavigation';
import DefaultAvatar from '../assets/img.png';

function PersonalProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: '', phone: '', address: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'name') {
      processedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').slice(0, 50);
    } else if (name === 'phone') {
      const numbers = value.replace(/\D/g, '').slice(0, 11);
      if (numbers.length > 10) processedValue = numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      else if (numbers.length > 6) processedValue = numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      else if (numbers.length > 2) processedValue = numbers.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      else processedValue = numbers;
    } else if (name === 'address') {
      processedValue = value.replace(/[^a-zA-ZÀ-ÿ0-9\s,.-]/g, '').slice(0, 100);
    }
    setProfile((p) => ({ ...p, [name]: processedValue }));
  };

  const handleEditProfile = () => navigate('/editar-perfil');

  const handleLogout = () => {
    setProfile({ name: '', phone: '', address: '' });
    alert('Logout realizado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UserNavigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 md:gap-6 mb-6">
              <img src={DefaultAvatar} alt="Foto de perfil" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{profile.name || 'Seu nome'}</h2>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Usuário ativo</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
                <User className="w-5 h-5 text-violet-400" />
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  placeholder="Nome completo"
                  className="flex-1 bg-transparent outline-none text-gray-700"
                />
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
                <Phone className="w-5 h-5 text-violet-400" />
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  placeholder="Telefone"
                  className="flex-1 bg-transparent outline-none text-gray-700"
                />
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
                <MapPin className="w-5 h-5 text-violet-400" />
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  placeholder="Endereço"
                  className="flex-1 bg-transparent outline-none text-gray-700"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3 justify-end mt-6">
              <button
                onClick={handleEditProfile}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-400 text-white rounded-lg font-semibold hover:bg-violet-500 transition"
              >
                <Edit3 className="w-4 h-4" />
                Editar Perfil
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalProfile;


