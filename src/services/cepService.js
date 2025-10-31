import axios from "axios";

export async function buscarCEP(cep) {
    const cepNumeros = cep.replace(/\D/g, '');
    if (cepNumeros.length !== 8) {
        throw new Error("CEP inválido");
    }

    const response = await axios.get(`https://viacep.com.br/ws/${cepNumeros}/json/`);
    const data = response.data;

    if (data.erro) {
        throw new Error("CEP não encontrado");
    }

    return data;
}
