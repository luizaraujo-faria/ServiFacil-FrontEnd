import React from 'react';
import InputField from '../CreateAccount/InputField';
import { AiOutlineSearch } from 'react-icons/ai';
import { useCEP } from '../../hooks/useCEP';

function AddressForm({ formData, onChange, errors = {} }) {
  const { loading, error, handleBuscarCEP, setError } = useCEP(onChange);

  // Prioriza erro do formulário; usa erro do hook se não houver errors.cep
  const cepError = errors.cep || error || '';

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* CEP + botão */}
      <div className="flex flex-col space-y-1">
        <div className="flex space-x-2">
          <InputField
            type="text"
            name="cep"
            placeholder="CEP"
            maxLength={8}
            value={formData.cep}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, '');
              onChange({ target: { name: 'cep', value: onlyNumbers } });
              setError(''); // limpa erro do hook ao digitar
            }}
            error={cepError}
          />

          <button
            type="button"
            onClick={() => handleBuscarCEP(formData.cep)}
            disabled={loading}
            className={`flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors ${loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : (
              <AiOutlineSearch className="mr-1" />
            )}
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {/* Rua */}
      <InputField type="text" name="rua" placeholder="Rua" value={formData.rua} onChange={onChange} error={errors.rua} />

      {/* Número e complemento */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          type="text"
          name="numero"
          placeholder="Número"
          value={formData.numero}
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/\D/g, '');
            onChange({ target: { name: 'numero', value: onlyNumbers } });
          }}
          error={errors.numero}
        />

        <InputField type="text" name="complemento" placeholder="Complemento (opcional)" value={formData.complemento} onChange={onChange} error={errors.complemento} />
      </div>

      {/* Bairro */}
      <InputField type="text" name="bairro" placeholder="Bairro" value={formData.bairro} onChange={onChange} error={errors.bairro} />

      {/* Município */}
      <InputField type="text" name="municipio" placeholder="Município" value={formData.municipio} onChange={onChange} error={errors.municipio} />

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select name="estado" value={formData.estado} onChange={onChange} className={`border rounded-lg px-4 py-2 w-full focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 ${errors.estado ? 'border-red-500' : 'border-gray-300'}`}>
          <option value="">Selecione o estado</option>
          {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </select>
        {errors.estado && <p className="text-red-500 text-sm">{errors.estado}</p>}
      </div>
    </div>
  );
}

export default AddressForm;
