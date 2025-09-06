import axios from "axios";

export const criarConta = async (formData) => {
    try {
        const payload = new FormData();
        payload.append("nome", formData.nome);
        payload.append("cpf", formData.cpf);
        payload.append("dataNascimento", formData.dataNascimento);
        payload.append("email", formData.email);
        payload.append("senha", formData.senha);
        payload.append("contaProfissional", formData.contaProfissional);
        payload.append("termosAceitos", formData.termosAceitos);

        // Endereço
        payload.append("cep", formData.cep);
        payload.append("rua", formData.rua);
        payload.append("numero", formData.numero);
        payload.append("complemento", formData.complemento);
        payload.append("bairro", formData.bairro);
        payload.append("municipio", formData.municipio);
        payload.append("estado", formData.estado);


        if (formData.foto) {
            payload.append("foto", formData.foto);
        }
        for (let pair of payload.entries()) {
            console.log(pair[0], pair[1]);
        }

        const response = await axios.post("http://localhost:3000/api/usuarios", payload, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return { success: true, data: response.data };
    } catch (error) {
        console.error("Erro ao criar conta:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Erro ao criar conta.",
        };
    }
};
