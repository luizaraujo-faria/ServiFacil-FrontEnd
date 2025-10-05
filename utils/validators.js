// utils/validators.js
export const validarFormulario = (formData) => {
    const errors = {};

    //  Informações pessoais
    if (!formData.nome.trim()) errors.nome = 'O nome é obrigatório.';

    if (!formData.cpf.trim()) {
        errors.cpf = 'O CPF é obrigatório.';
    } else if (!validarCPF(formData.cpf)) {
        errors.cpf = 'CPF inválido. Digite 11 números.';
    }

    if (!formData.dataNascimento.trim()) {
        errors.dataNascimento = 'Data de nascimento é obrigatória.';
    } else if (!maiorDeIdade(formData.dataNascimento)) {
        errors.dataNascimento = 'Você precisa ter mais de 18 anos.';
    }

    if (!formData.email.trim()) errors.email = 'O email é obrigatório.';

    //  Senha e confirmação
    if (!formData.senha.trim()) {
        errors.senha = 'A senha é obrigatória.';
    }

    if (!formData.repetirSenha.trim()) {
        errors.repetirSenha = 'Confirme sua senha.';
    } else if (formData.senha !== formData.repetirSenha) {
        errors.repetirSenha = 'As senhas não coincidem.';
    }

    //  Endereço
    if (!formData.cep.trim()) {
        errors.cep = 'O CEP é obrigatório.';
    } else if (!/^\d{8}$/.test(formData.cep.replace(/\D/g, ''))) {
        errors.cep = 'CEP inválido. Digite 8 números.';
    }

    if (!formData.rua.trim()) errors.rua = 'A rua é obrigatória.';
    if (!formData.bairro.trim()) errors.bairro = 'O bairro é obrigatório.';
    if (!formData.municipio.trim()) errors.municipio = 'O município é obrigatório.';
    if (!formData.estado.trim()) errors.estado = 'O estado é obrigatório.';

    //  Tipo de conta e termos
    if (!formData.contaProfissional) errors.contaProfissional = 'Selecione o tipo de conta.';
    if (!formData.termosAceitos) errors.termosAceitos = 'Você deve aceitar os termos.';

    return errors;
};

//  Funções auxiliares
const validarCPF = (cpf) => {
    const cleaned = cpf.replace(/\D/g, '');
    return /^\d{11}$/.test(cleaned);
};

const maiorDeIdade = (data) => {
    if (!data) return false;
    const nascimento = new Date(data);
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade >= 18;
};
