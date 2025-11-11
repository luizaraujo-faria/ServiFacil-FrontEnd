import { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';

const PhotoUpload = ({ currentPhoto, onPhotoChange, userName }) => {
  const [preview, setPreview] = useState(currentPhoto || null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }

      // Comprimir e converter para base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Criar canvas para redimensionar
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Definir tamanho máximo (reduzido para diminuir base64)
          const MAX_WIDTH = 200;
          const MAX_HEIGHT = 200;

          let width = img.width;
          let height = img.height;

          // Calcular novo tamanho mantendo proporção
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

          // Converter para base64 com qualidade muito reduzida (0.4 para menor tamanho)
          const base64String = canvas.toDataURL('image/jpeg', 0.4);

          // Log do tamanho para debug
          const sizeInKB = (base64String.length / 1024).toFixed(2);
          console.log(`📸 Imagem comprimida: ${sizeInKB} KB`);

          // Verificar se ainda está muito grande
          if (base64String.length > 100000) {
            // ~100KB
            console.warn('⚠️ Imagem ainda grande, considere usar uma foto menor');
          }

          setPreview(base64String);
          onPhotoChange(base64String);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = () => {
    if (!userName) return 'U';
    const names = userName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Preview da Foto */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100">
          {preview ? <img src={preview} alt="Foto de perfil" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-violet-400 flex items-center justify-center text-white text-3xl font-bold">{getInitials()}</div>}
        </div>

        {/* Botão de Remover */}
        {preview && (
          <button type="button" onClick={handleRemovePhoto} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition" title="Remover foto">
            <X size={16} />
          </button>
        )}

        {/* Botão de Upload */}
        <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition shadow-lg" title="Alterar foto">
          <Camera size={20} />
        </button>
      </div>

      {/* Input File (oculto) */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {/* Instruções */}
      <div className="text-center">
        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2">
          <Upload size={16} />
          {preview ? 'Alterar foto' : 'Adicionar foto'}
        </button>
        <p className="text-xs text-gray-500 mt-1">JPG, PNG ou GIF (máx. 5MB)</p>
      </div>
    </div>
  );
};

export default PhotoUpload;
