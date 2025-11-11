import { register } from './auth';

export const criarConta = async (formData) => {
  try {
    // Processar foto se existir
    // A foto já vem em base64 do PhotoUpload, não precisa converter
    let profilePhotoBase64 = null;
    if (formData.foto) {
      // Se já é uma string base64, usa diretamente
      if (typeof formData.foto === 'string') {
        profilePhotoBase64 = formData.foto;
      } else {
        // Se for um File, converte
        profilePhotoBase64 = await convertImageToBase64(formData.foto);
      }
    }

    // Mapear os dados do formulário para o formato da API
    const userData = {
      userName: formData.nome,
      email: formData.email,
      userPassword: formData.senha,
      cpf: formData.cpf?.replace(/\D/g, '') || '',
      telephone: formData.telefone || '(00) 00000-0000',
      birthDate: formatDateToAPI(formData.dataNascimento),
      rg: formData.rg || '000000000',
      userType: formData.isProfissional === 'sim' ? 'Profissional' : 'Cliente',
      profession: formData.profissao || null,
      cnpj: formData.cnpj?.replace(/\D/g, '') || null,
      profilePhoto: profilePhotoBase64, // Adicionar foto em Base64

      // Endereço
      zipCode: formatZipCode(formData.cep) || '',
      street: formData.rua || '',
      houseNumber: formData.numero || '0',
      complement: formData.complemento || 'N/A',
      neighborhood: formData.bairro || '',
      city: formData.cidade || '',
      state: formData.estado || '',
    };

    // console.log('Enviando dados para API:', userData);
    // console.log('Foto incluída:', profilePhotoBase64 ? 'Sim' : 'Não');

    const result = await register(userData);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    return {
      success: false,
      message: error.message || 'Erro ao criar conta.',
    };
  }
};

// Função para converter imagem para Base64 com compressão agressiva
async function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Criar canvas para redimensionar
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Definir tamanho máximo reduzido para diminuir o base64
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para Base64 com qualidade muito reduzida (0.3 para menor tamanho)
        const base64 = canvas.toDataURL('image/jpeg', 0.3);

        // Log do tamanho para debug
        const sizeInKB = (base64.length / 1024).toFixed(2);
        // console.log(`📸 Imagem comprimida (userService): ${sizeInKB} KB`);

        // Verificar se ainda está muito grande
        if (base64.length > 100000) { // ~100KB
          console.warn('⚠️ Imagem ainda grande após compressão');
        }

        resolve(base64);
      };

      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Função auxiliar para formatar data
function formatDateToAPI(dateString) {
  // A API espera formato dd/MM/yyyy
  if (!dateString) return '';

  // Se já está no formato correto, retorna
  if (dateString.includes('/')) {
    return dateString;
  }

  // Se está no formato yyyy-MM-dd, converte
  if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  return dateString;
}

// Função auxiliar para formatar CEP
function formatZipCode(cep) {
  if (!cep) return '';

  // Remove tudo que não é número
  const numbers = cep.replace(/\D/g, '');

  // Se tem 8 dígitos, formata como XXXXX-XXX
  if (numbers.length === 8) {
    return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
  }

  // Se já está formatado ou tem outro tamanho, retorna como está
  return cep;
}
