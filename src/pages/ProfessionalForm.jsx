import { useState } from 'react';

function ProfessionalForm({ formData, onChange }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Cadastro de Profissional</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="tipoServico" className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Serviço
                        </label>
                        <input
                            type="text"
                            id="tipoServico"
                            name="tipoServico"
                            value={formData.tipoServico}
                            onChange={onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Encanador, Eletricista, etc."
                        />
                    </div>

                    <div>
                        <label htmlFor="habilidades" className="block text-sm font-medium text-gray-700 mb-1">
                            Habilidades
                        </label>
                        <textarea
                            id="habilidades"
                            name="habilidades"
                            value={formData.habilidades}
                            onChange={onChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Descreva suas habilidades"
                        />
                    </div>

                    <div>
                        <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700 mb-1">
                            Experiência
                        </label>
                        <input
                            type="text"
                            id="experiencia"
                            name="experiencia"
                            value={formData.experiencia}
                            onChange={onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: 5 anos"
                        />
                    </div>

                    <div>
                        <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
                            Preço
                        </label>
                        <input
                            type="text"
                            id="preco"
                            name="preco"
                            value={formData.preco}
                            onChange={onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: R$ 100/hora"
                        />
                    </div>

                    <div>
                        <label htmlFor="disponibilidade" className="block text-sm font-medium text-gray-700 mb-1">
                            Disponibilidade
                        </label>
                        <input
                            type="text"
                            id="disponibilidade"
                            name="disponibilidade"
                            value={formData.disponibilidade}
                            onChange={onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Segunda a Sexta, 8h-18h"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Cadastrar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProfessionalForm;
