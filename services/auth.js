import axios from 'axios';

export const login = async ({ email, password }) => {
    console.log(login)
    try {
        const response = await axios.post('https://backendServiFacil.com/api/login', { email, password });

        if (response.data.success) {
            // Salva token no localStorage se quiser
            localStorage.setItem('token', response.data.token);

            return { success: true, user: response.data.user };
        } else {
            return { success: false, message: 'Email ou senha incorretos' };
        }
    } catch (error) {

        return { success: false, message: 'Erro de conexão com o servidor' };
    }
};
