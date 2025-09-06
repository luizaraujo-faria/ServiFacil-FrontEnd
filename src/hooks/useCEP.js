import { useState } from "react";
import { buscarCEP } from "../services/cepService";

export function useCEP(onChange) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleBuscarCEP = async (cep) => {
        setLoading(true);
        try {
            const data = await buscarCEP(cep);
            setError("");
            onChange({ target: { name: 'rua', value: data.logradouro } });
            onChange({ target: { name: 'bairro', value: data.bairro } });
            onChange({ target: { name: 'municipio', value: data.localidade } });
            onChange({ target: { name: 'estado', value: data.uf } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handleBuscarCEP, setError };
}
