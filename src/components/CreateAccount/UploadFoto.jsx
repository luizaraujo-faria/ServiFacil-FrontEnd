import React from 'react';
import { Camera } from 'lucide-react';

function UploadFoto({ foto, onChange }) {
  return (
    <div className="flex flex-col items-center">
      <label className="cursor-pointer">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300 hover:border-yellow-400 transition">
          {foto ? <img src={URL.createObjectURL(foto)} alt="Preview" className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-gray-500" />}
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => onChange(e.target.files[0])} />
      </label>
      <p className="text-sm text-gray-500 mt-2">Adicionar Foto</p>
    </div>
  );
}

export default UploadFoto;
