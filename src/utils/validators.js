export const validarFormulario = (formData) => {
    const errors = {};

    if (!formData.isProfissional) errors.isProfissional = 'Selecione o tipo de conta.';


    if (!formData.nome.trim()) errors.nome = 'O nome é obrigatório.';

    if (!formData.email.trim()) errors.email = 'O email é obrigatório.';

    if (!formData.telefone.trim()) {
        errors.telefone = 'O telefone é obrigatório.';
    } else if (!/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(formData.telefone)) {
        errors.telefone = 'Telefone inválido.';
    }

    if (!formData.dataNascimento.trim()) {
        errors.dataNascimento = 'Data de nascimento é obrigatória.';
    } else if (!maiorDeIdade(formData.dataNascimento)) {
        errors.dataNascimento = 'Você precisa ter mais de 18 anos.';
    }


    if (formData.isProfissional === 'sim') {
        if (!formData.cnpj.trim()) errors.cnpj = 'O CNPJ é obrigatório.';
        else if (!validarCNPJ(formData.cnpj)) errors.cnpj = 'CNPJ inválido.';
        if (!formData.profissao.trim()) errors.profissao = 'A profissão é obrigatória.';
    } else {
        if (!formData.cpf.trim()) errors.cpf = 'O CPF é obrigatório.';
        else if (!validarCPF(formData.cpf)) errors.cpf = 'CPF inválido.';
    }


    if (!formData.senha.trim()) errors.senha = 'A senha é obrigatória.';
    if (!formData.repetirSenha.trim()) errors.repetirSenha = 'Confirme sua senha.';
    else if (formData.senha !== formData.repetirSenha) errors.repetirSenha = 'As senhas não coincidem.';


    if (!formData.cep.trim()) errors.cep = 'O CEP é obrigatório.';
    else if (!/^\d{8}$/.test(formData.cep.replace(/\D/g, ''))) errors.cep = 'CEP inválido.';
    if (!formData.rua.trim()) errors.rua = 'A rua é obrigatória.';
    if (!formData.bairro.trim()) errors.bairro = 'O bairro é obrigatório.';
    if (!formData.cidade.trim()) errors.cidade = 'A cidade é obrigatória.';
    if (!formData.estado.trim()) errors.estado = 'O estado é obrigatório.';

    if (!formData.termosAceitos) errors.termosAceitos = 'Você deve aceitar os termos.';

    return errors;
};



const validarCPF = (cpf) => {
    const cleaned = cpf.replace(/\D/g, '');
    return /^\d{11}$/.test(cleaned);
};

const validarCNPJ = (cnpj) => {
    const cleaned = cnpj.replace(/\D/g, '');
    return /^\d{14}$/.test(cleaned);
};

const maiorDeIdade = (data) => {
    if (!data) return false;
    const nascimento = new Date(data);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade >= 18;
};
