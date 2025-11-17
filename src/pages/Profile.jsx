import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/auth';
import { Edit2, Save, X, User, Mail, Phone, Calendar, MapPin, Home, CreditCard, Building, Hash, Lock, Briefcase } from 'lucide-react';
import UserNavigation from '../components/UserNavigation';
import PhotoUpload from '../components/PhotoUpload';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';
import ProfileSkeleton from '../components/Skeleton/ProfileSkeleton';

function Profile() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Função para converter dd/MM/yyyy para yyyy-MM-dd (para o input date)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';

    // Se já está no formato yyyy-MM-dd, retorna como está
    if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
      return dateString.split('T')[0]; // Remove hora se houver
    }

    // Converte dd/MM/yyyy para yyyy-MM-dd
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return '';
  };

  // Função para converter yyyy-MM-dd para dd/MM/yyyy (para exibição)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Não informado';

    // Remove a parte do tempo se existir
    const datePart = dateString.split('T')[0];

    // Se já está no formato dd/MM/yyyy, retorna como está
    if (datePart.includes('/')) {
      return datePart;
    }

    // Converte yyyy-MM-dd para dd/MM/yyyy
    if (datePart.includes('-')) {
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year}`;
    }

    return 'Não informado';
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      console.error('User ID ou Token não encontrado');
      navigate('/');
      return;
    }
    const result = await getUser(userId);

    if (result.success) {
      const data = result.data;
      setUser(data);

      // CORREÇÃO: Converter userType para exibição
      const displayUserType = data.userType === 'PF' ? 'Cliente' : data.userType === 'PJ' ? 'Profissional' : data.userType;

      setFormData({
        userName: data.userName || '',
        email: data.email || '',
        userPassword: '',
        telephone: data.telephone || '',
        cpf: data.cpf || '',
        cnpj: data.cnpj || '',
        // CORREÇÃO: Armazenar o valor para exibição
        userType: displayUserType,
        birthDate: formatDateForInput(data.birthDate),
        profilePhoto: data.profilePhoto || '',
        zipCode: data.address?.zipCode || '',
        street: data.address?.street || '',
        houseNumber: data.address?.houseNumber || '',
        complement: data.address?.complement || '',
        neighborhood: data.address?.neighborhoodID?.neighborhood || '',
        city: data.address?.cityID?.city || '',
        state: data.address?.stateID?.state || '',
      });
    } else {
      console.error('Erro no getUser:', result.message);
      toast.error('Erro ao carregar dados do usuário: ' + result.message);
      navigate('/');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhotoChange = (photoBase64) => {
    setFormData((prev) => ({ ...prev, profilePhoto: photoBase64 }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      toast.error('Usuário não autenticado.');
      logout();
      return;
    }

    // Converter userType de exibição (Cliente/Profissional) para API (PF/PJ)
    let userTypeForAPI = 'PF';
    if (formData.userType === 'Profissional' || formData.userType === 'PJ') {
      userTypeForAPI = 'PJ';
    } else if (formData.userType === 'Cliente' || formData.userType === 'PF') {
      userTypeForAPI = 'PF';
    }

    // Função para remover formatação de CPF/CNPJ (apenas números)
    const cleanDocument = (doc) => {
      if (!doc || typeof doc !== 'string') return null;
      const cleaned = doc.replace(/\D/g, ''); // Remove tudo que não é dígito
      return cleaned.length > 0 ? cleaned : null;
    };

    // Função para limpar telefone (remove formatação)
    const cleanPhone = (phone) => {
      if (!phone || typeof phone !== 'string') return '';
      return phone.replace(/\D/g, ''); // Remove tudo que não é dígito
    };

    // Função para limpar CEP (remove hífen e espaços)
    const cleanZipCode = (zipCode) => {
      if (!zipCode || typeof zipCode !== 'string') return '';
      return zipCode.replace(/\D/g, ''); // Remove tudo que não é dígito
    };

    // Obter fotos atual e nova
    const currentPhoto = user?.profilePhoto || '';
    const newPhoto = formData.profilePhoto || '';

    // Tratar complement - converter "N/A" para null
    let complementValue = formData.complement;
    if (!complementValue || 
        complementValue.trim() === '' || 
        complementValue === 'N/A' || 
        complementValue === 'n/a' ||
        complementValue === 'null') {
      complementValue = null;
    }

    // Obter RG original do usuário
    const originalRg = user?.rg || '';

    const dataToSend = {
      userName: formData.userName || '',
      email: formData.email || '',
      telephone: cleanPhone(formData.telephone) || null,
      cpf: cleanDocument(formData.cpf),
      cnpj: cleanDocument(formData.cnpj),
      userType: userTypeForAPI,
      birthDate: formData.birthDate ? formatDateForDisplay(formData.birthDate) : null,
      zipCode: cleanZipCode(formData.zipCode) || null,
      street: formData.street || null,
      houseNumber: formData.houseNumber || null,
      complement: complementValue,
      neighborhood: formData.neighborhood || null,
      city: formData.city || null,
      state: formData.state || null,
    };

    // Adicionar RG - manter o original se existir, especialmente para PJ
    if (originalRg && originalRg.trim() !== '') {
      dataToSend.rg = originalRg;
    } else if (formData.rg && formData.rg.trim() !== '') {
      // Se não tem original mas tem no formData, usar do formData
      dataToSend.rg = formData.rg.replace(/\D/g, ''); // Remove formatação
    }

    // Adicionar foto se houver uma nova foto ou se estiver editando
    // Sempre enviar a foto atual do formData se ela existir
    if (newPhoto && newPhoto.trim() !== '' && newPhoto !== 'null') {
      dataToSend.profilePhoto = newPhoto;
    } else if (currentPhoto && currentPhoto.trim() !== '') {
      // Se não há nova foto mas há uma foto atual, manter ela
      dataToSend.profilePhoto = currentPhoto;
    }

    // Apenas adiciona senha se foi preenchida e não está vazia
    if (formData.userPassword && formData.userPassword.trim() !== '') {
      dataToSend.userPassword = formData.userPassword;
    }

    // Limpar CPF/CNPJ baseado no tipo de usuário
    if (dataToSend.userType === 'PF') {
      // Para PF, remover CNPJ completamente
      delete dataToSend.cnpj;
      // Remover CPF se estiver vazio ou inválido
      if (!dataToSend.cpf || dataToSend.cpf === '' || dataToSend.cpf.length < 11) {
        delete dataToSend.cpf;
      }
    } else if (dataToSend.userType === 'PJ') {
      // Para PJ, manter o CPF original do usuário se existir
      // Isso evita que o backend tente atualizar para NULL
      const originalCpf = user?.cpf || '';
      if (originalCpf && originalCpf.trim() !== '') {
        // Se o usuário já tem CPF no banco, manter ele
        dataToSend.cpf = originalCpf;
      } else {
        // Se não tem CPF, remover o campo para não enviar
        delete dataToSend.cpf;
      }
      // Para PJ, garantir que RG seja mantido (não pode ser NULL)
      if (!dataToSend.rg || dataToSend.rg === '') {
        // Se não tem RG no dataToSend, usar o original
        if (originalRg && originalRg.trim() !== '') {
          dataToSend.rg = originalRg;
        } else {
          // Se não tem RG original, usar um valor padrão para evitar NULL
          dataToSend.rg = '000000000';
        }
      }
      // Remover CNPJ se estiver vazio ou inválido
      if (!dataToSend.cnpj || dataToSend.cnpj === '' || dataToSend.cnpj.length < 14) {
        delete dataToSend.cnpj;
      }
    } else {
      // Para PF, garantir que RG seja mantido se existir
      if (!dataToSend.rg || dataToSend.rg === '') {
        if (originalRg && originalRg.trim() !== '') {
          dataToSend.rg = originalRg;
        }
      }
    }

    // Limpar campos vazios para evitar enviar strings vazias
    Object.keys(dataToSend).forEach(key => {
      if (dataToSend[key] === '' || 
          (typeof dataToSend[key] === 'string' && dataToSend[key].trim() === '') ||
          dataToSend[key] === 'N/A' ||
          dataToSend[key] === 'n/a') {
        dataToSend[key] = null;
      }
    });

    // Verificar tamanho da foto se estiver sendo enviada
    if (dataToSend.profilePhoto && typeof dataToSend.profilePhoto === 'string') {
      if (dataToSend.profilePhoto.length > 2000000) { // Se maior que ~2MB
        console.warn('⚠️ Foto muito grande, pode causar problemas. Tamanho:', (dataToSend.profilePhoto.length / 1024 / 1024).toFixed(2), 'MB');
        // Ainda envia, mas avisa
      }
    }

    // Log para debug (remover em produção se necessário)
    console.log('📤 Dados sendo enviados para a API:', JSON.stringify(dataToSend, null, 2));
    console.log('📊 Resumo dos dados:', {
      temFoto: !!dataToSend.profilePhoto,
      temSenha: !!dataToSend.userPassword,
      userType: dataToSend.userType,
      temCPF: !!dataToSend.cpf,
      temCNPJ: !!dataToSend.cnpj,
      temEndereco: !!(dataToSend.zipCode || dataToSend.street),
    });

    try {
      setSaving(true);

      const response = await api.patch(`/users/${userId}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        toast.success('Perfil atualizado com sucesso!');
        setEditing(false);
        loadUserData();
      } else {
        toast.error(response.data.message || 'Erro ao atualizar perfil.');
      }
    } catch (error) {
      console.error('❌ Erro completo:', error);

      if (error.response) {
        console.error('📋 Status:', error.response.status);
        console.error('📄 Dados do erro:', error.response.data);
        console.error('📤 Dados enviados:', dataToSend);
        console.error('📄 Response completa:', error.response);
        console.error('📄 Headers da resposta:', error.response.headers);

        // Tentar extrair mensagem de erro mais detalhada
        let errorMessage = 'Erro interno do servidor (500)';
        let errorDetails = '';
        
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else {
            // Tentar diferentes propriedades comuns de erro
            errorMessage = error.response.data.message || 
                          error.response.data.error || 
                          error.response.data.errorMessage ||
                          error.response.data.msg ||
                          'Erro interno do servidor';
            
            // Capturar detalhes adicionais
            if (error.response.data.errors) {
              errorDetails = Array.isArray(error.response.data.errors) 
                ? error.response.data.errors.join(', ')
                : JSON.stringify(error.response.data.errors);
            } else if (error.response.data.details) {
              errorDetails = JSON.stringify(error.response.data.details);
            } else if (Object.keys(error.response.data).length > 0) {
              // Se não encontrou mensagem, mostrar toda a estrutura
              errorDetails = JSON.stringify(error.response.data, null, 2);
            }
          }
        }
        
        // Exibir mensagem completa
        const fullMessage = errorDetails 
          ? `${errorMessage}\n\nDetalhes: ${errorDetails}` 
          : errorMessage;
        
        console.error('💥 Mensagem de erro completa:', fullMessage);
        toast.error(`Erro ao atualizar: ${errorMessage}`, { 
          duration: 6000,
          style: { maxWidth: '500px' }
        });
        
        // Se houver detalhes, mostrar no console
        if (errorDetails) {
          console.error('📝 Detalhes do erro:', errorDetails);
        }
      } else {
        console.error('Erro de rede:', error.message);
        toast.error('Erro de conexão. Tente novamente.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    loadUserData();
  };

  const formatCPF = (cpf) => (cpf ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : 'Não informado');

  const formatCNPJ = (cnpj) => (cnpj ? cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5') : 'Não informado');

  if (loading) {
    return (
      <>
        <UserNavigation />
        <ProfileSkeleton />;
      </>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-violet-400 to-yellow-300 h-36 relative"></div>

          <div className="px-4 sm:px-8 pb-8 sm:pb-10 -mt-16">
            {/* 🔥 PARTE MODIFICADA - BOTÕES RESPONSIVOS */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between relative z-10 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
                {editing ? (
                  <div className="flex justify-center sm:justify-start">
                    <PhotoUpload currentPhoto={formData.profilePhoto} onPhotoChange={handlePhotoChange} userName={formData.userName} />
                  </div>
                ) : (
                  <div className="flex justify-center sm:justify-start">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-violet-200 flex items-center justify-center text-xl sm:text-3xl font-bold text-white">
                      {user.profilePhoto ? <img src={user.profilePhoto} alt="Foto" className="w-full h-full object-cover" /> : user.userName?.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">{user.userName}</h2>
                  <p className="text-gray-500 text-sm sm:text-base">{user.userType === 'PF' ? 'Cliente' : 'Profissional'}</p>
                </div>
              </div>

              {/* BOTÕES - AGORA RESPONSIVOS */}
              {editing ? (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button onClick={handleSave} disabled={saving} className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-green-300 w-full sm:w-auto">
                    <Save className="w-4 h-4" />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button onClick={handleCancel} className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition w-full sm:w-auto">
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              ) : (
                <button onClick={() => setEditing(true)} className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition w-full sm:w-auto">
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
              )}
            </div>

            <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <InfoField icon={<User />} label="Nome" name="userName" value={user.userName} {...{ editing, formData, handleChange, errors }} />
              <InfoField icon={<Mail />} label="Email" name="email" value={user.email} {...{ editing, formData, handleChange, errors }} />
              <InfoField icon={<Phone />} label="Telefone" name="telephone" value={user.telephone} {...{ editing, formData, handleChange, errors }} />

              {/* Agora o campo data funciona corretamente */}
              <InfoField icon={<Calendar />} label="Nascimento" name="birthDate" value={formatDateForDisplay(user.birthDate)} inputProps={{ type: 'date' }} {...{ editing, formData, handleChange }} />

              {/* CORREÇÃO: Select com valores PF/PJ mas exibindo Cliente/Profissional */}
              <InfoField
                icon={<Briefcase />}
                label="Tipo de Conta"
                name="userType"
                value={formData.userType} // Usa formData que já está convertido para exibição
                {...{ editing, formData, handleChange }}
                inputProps={{
                  as: 'select',
                  children: (
                    <>
                      <option value="Cliente">Cliente</option>
                      <option value="Profissional">Profissional</option>
                    </>
                  ),
                }}
              />

              {formData.userType === 'Cliente' && <InfoField icon={<CreditCard />} label="CPF" name="cpf" value={formatCPF(user.cpf)} {...{ editing, formData, handleChange }} />}
              {formData.userType === 'Profissional' && <InfoField icon={<Building />} label="CNPJ" name="cnpj" value={formatCNPJ(user.cnpj)} {...{ editing, formData, handleChange }} />}
              <InfoField icon={<Lock />} label="Nova Senha" name="userPassword" value="" inputProps={{ type: 'password', placeholder: editing ? 'Deixe em branco para não alterar' : '********' }} {...{ editing, formData, handleChange, errors }} />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-violet-500" /> Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <InfoField icon={<Hash />} label="CEP" name="zipCode" value={formData.zipCode} {...{ editing, formData, handleChange }} />
              <InfoField icon={<Home />} label="Rua" name="street" value={formData.street} {...{ editing, formData, handleChange }} />
              <InfoField icon={<Building />} label="Número" name="houseNumber" value={formData.houseNumber} {...{ editing, formData, handleChange }} />
              <InfoField icon={<Home />} label="Complemento" name="complement" value={formData.complement} {...{ editing, formData, handleChange }} />
              <InfoField icon={<MapPin />} label="Bairro" name="neighborhood" value={formData.neighborhood} {...{ editing, formData, handleChange }} />
              <InfoField icon={<MapPin />} label="Cidade" name="city" value={formData.city} {...{ editing, formData, handleChange }} />
              <InfoField icon={<MapPin />} label="Estado" name="state" value={formData.state} {...{ editing, formData, handleChange }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente InfoField permanece o mesmo
const InfoField = ({ icon, label, value, name, editing, formData, handleChange, errors = {}, type = 'text', inputProps = {} }) => {
  const error = errors[name];
  const inputValue = formData[name] !== undefined ? String(formData[name]) : '';

  let displayValue = value;
  if (name === 'userPassword' && !editing) {
    displayValue = '********';
  }

  return (
    <div>
      <label className="text-sm text-gray-700 font-medium mb-1 block">
        <span className="inline-flex items-center gap-1">
          {icon} {label}
        </span>
      </label>
      {editing ? (
        inputProps.as === 'select' ? (
          <select name={name} value={inputValue} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 border-gray-300">
            {inputProps.children}
          </select>
        ) : (
          <input type={inputProps.type || type} name={name} value={inputValue} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 ${error ? 'border-red-500' : 'border-gray-300'}`} {...inputProps} />
        )
      ) : (
        <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 break-words">{displayValue || 'Não informado'}</p>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Profile;
