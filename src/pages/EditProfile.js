import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEnterNavigation } from "../hooks/useEnterNavigation";

const EditProfile = () => {
  const navigate = useNavigate();
  const handleKeyPress = useEnterNavigation();
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    usuario: "",
    email: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    senha: "",
    confirmar: "",
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("profile");
      if (savedProfile) {
        const data = JSON.parse(savedProfile);
        setFormData({
          nome: data.name || "",
          telefone: data.phone || "",
          cpf: data.cpf || "",
          usuario: data.username || "",
          email: data.email || "",
          rua: data.address?.street || "",
          numero: data.address?.number || "",
          bairro: data.address?.neighborhood || "",
          cidade: data.address?.city || "",
          estado: data.address?.state || "",
          cep: data.address?.zip || "",
          senha: "",
          confirmar: "",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("profile_form", JSON.stringify(formData));
    } catch (_) {}
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    let v = value;
    
    // Campos que só aceitam números
    if (name === "telefone") {
      v = value.replace(/\D/g, "").slice(0, 11);
      // Formatar telefone: (00) 00000-0000
      if (v.length > 10) {
        v = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      } else if (v.length > 6) {
        v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
      } else if (v.length > 2) {
        v = v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
      }
    } else if (name === "cpf") {
      v = value.replace(/\D/g, "").slice(0, 11);
      // Formatar CPF: 000.000.000-00
      if (v.length > 9) {
        v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      } else if (v.length > 6) {
        v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
      } else if (v.length > 3) {
        v = v.replace(/(\d{3})(\d{0,3})/, "$1.$2");
      }
    } else if (name === "numero") {
      v = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "cep") {
      v = value.replace(/\D/g, "").slice(0, 8);
      if (v.length > 5) {
        v = v.replace(/(\d{5})(\d{1,3})/, "$1-$2");
      }
    }
    // Campos que só aceitam letras e espaços
    else if (name === "nome" || name === "cidade" || name === "bairro") {
      v = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").slice(0, 50);
    }
    // Campo de usuário: letras, números e alguns caracteres especiais
    else if (name === "usuario") {
      v = value.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 30);
    }
    // Campo de rua aceita letras, números e alguns caracteres
    else if (name === "rua") {
      v = value.replace(/[^a-zA-ZÀ-ÿ0-9\s,.-]/g, "").slice(0, 100);
    }
    // Email: validação básica será feita na validação do formulário
    else if (name === "email") {
      v = value.slice(0, 100);
    }
    // Senhas: sem restrições especiais, mas com limite de tamanho
    else if (name === "senha" || name === "confirmar") {
      v = value.slice(0, 50);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: v,
    }));
  };


  const validateForm = () => {
    const errs = {};
    
    // Validação do nome
    if (!formData.nome.trim()) {
      errs.nome = "Nome é obrigatório";
    } else if (formData.nome.trim().length < 2) {
      errs.nome = "Nome deve ter pelo menos 2 caracteres";
    }
    
    // Validação do telefone
    const telefoneClean = formData.telefone.replace(/\D/g, "");
    if (!telefoneClean) {
      errs.telefone = "Telefone é obrigatório";
    } else if (telefoneClean.length < 10) {
      errs.telefone = "Telefone deve ter pelo menos 10 dígitos";
    }
    
    // Validação do CPF
    const cpfClean = formData.cpf.replace(/\D/g, "");
    if (!cpfClean) {
      errs.cpf = "CPF é obrigatório";
    } else if (cpfClean.length !== 11) {
      errs.cpf = "CPF deve ter 11 dígitos";
    }
    
    // Validação do usuário
    if (!formData.usuario.trim()) {
      errs.usuario = "Nome de usuário é obrigatório";
    } else if (formData.usuario.trim().length < 3) {
      errs.usuario = "Nome de usuário deve ter pelo menos 3 caracteres";
    }
    
    // Validação do email
    if (!formData.email.trim()) {
      errs.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Email inválido";
    }
    
    // Validação do endereço
    if (!formData.rua.trim()) {
      errs.rua = "Rua é obrigatória";
    } else if (formData.rua.trim().length < 5) {
      errs.rua = "Rua deve ter pelo menos 5 caracteres";
    }
    
    if (!formData.numero.trim()) {
      errs.numero = "Número é obrigatório";
    }
    
    if (!formData.bairro.trim()) {
      errs.bairro = "Bairro é obrigatório";
    } else if (formData.bairro.trim().length < 2) {
      errs.bairro = "Bairro deve ter pelo menos 2 caracteres";
    }
    
    if (!formData.cidade.trim()) {
      errs.cidade = "Cidade é obrigatória";
    } else if (formData.cidade.trim().length < 2) {
      errs.cidade = "Cidade deve ter pelo menos 2 caracteres";
    }
    
    if (!formData.estado) {
      errs.estado = "Estado é obrigatório";
    }
    
    // Validação do CEP
    if (!formData.cep.trim()) {
      errs.cep = "CEP é obrigatório";
    } else if (!/^\d{5}-\d{3}$/.test(formData.cep)) {
      errs.cep = "CEP inválido (formato: 00000-000)";
    }
    
    // Validação das senhas (opcionais, mas se preenchidas devem ser válidas)
    if (formData.senha || formData.confirmar) {
      if (!formData.senha) {
        errs.senha = "Digite a nova senha";
      } else if (formData.senha.length < 6) {
        errs.senha = "Senha deve ter pelo menos 6 caracteres";
      }
      
      if (!formData.confirmar) {
        errs.confirmar = "Confirme a nova senha";
      } else if (formData.senha !== formData.confirmar) {
        errs.confirmar = "Senhas não coincidem";
      }
    }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulário antes de enviar
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Payload mapeado para o backend
    const payload = {
      name: formData.nome,
      email: formData.email,
      phone: formData.telefone,
      cpf: formData.cpf,
      username: formData.usuario,
      address: {
        street: formData.rua,
        number: formData.numero,
        neighborhood: formData.bairro,
        city: formData.cidade,
        state: formData.estado,
        zip: formData.cep,
      },
      password: formData.senha || undefined, // se vazio, não altera
    };

    try {
      // Persistir o perfil localmente, eliminando dependência de backend
      const profileToSave = {
        id: 1,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        cpf: payload.cpf,
        username: payload.username,
        address: payload.address,
      };

      localStorage.setItem("profile", JSON.stringify(profileToSave));

      // Opcionalmente, limpar o rascunho do formulário
      try {
        localStorage.removeItem("profile_form");
      } catch (_) {}

      alert("Dados salvos com sucesso!");
      navigate("/perfil");
    } catch (error) {
      console.error("Erro ao salvar dados localmente:", error);
      alert("Falha ao salvar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    try {
      localStorage.removeItem("profile_form");
    } catch (_) {}
    setFormData({
      nome: "",
      telefone: "",
      cpf: "",
      usuario: "",
      email: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      senha: "",
      confirmar: "",
    });
  };

  const handleCancel = () => {
    navigate("/perfil");
  };

  return (
    <div className="editar-perfil">
      <div className="header-editar">
        <h1>Editar Perfil</h1>
        <div className="security-info">
          <i className="fas fa-shield-alt"></i>
          <span>
            Seus dados são protegidos com criptografia de ponta a ponta.
            Mantenha suas informações atualizadas.
          </span>
        </div>
        <form id="form-edicao" onSubmit={handleSubmit}>
          <div className="section-card">
            <h2>Informações Pessoais</h2>
            <div className="info-block">
              <i className="fas fa-user"></i>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Nome completo"
                value={formData.nome}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.nome ? "error" : ""}
              />
              {errors.nome && <span className="error-message">{errors.nome}</span>}
            </div>
            <div className="info-block">
              <i className="fas fa-phone"></i>
              <input
                type="text"
                id="telefone"
                name="telefone"
                placeholder="Telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.telefone ? "error" : ""}
              />
              {errors.telefone && <span className="error-message">{errors.telefone}</span>}
            </div>
            <div className="info-block">
              <i className="fas fa-id-card"></i>
              <input
                type="text"
                id="cpf"
                name="cpf"
                placeholder="CPF"
                value={formData.cpf}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.cpf ? "error" : ""}
              />
              {errors.cpf && <span className="error-message">{errors.cpf}</span>}
            </div>
            <div className="info-block">
              <i className="fas fa-user-tag"></i>
              <input
                type="text"
                id="usuario"
                name="usuario"
                placeholder="Nome de usuário"
                value={formData.usuario}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.usuario ? "error" : ""}
              />
              {errors.usuario && <span className="error-message">{errors.usuario}</span>}
            </div>
            <div className="info-block">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="section-card">
            <h2>Endereço</h2>
            <div className="info-block">
              <i className="fas fa-road"></i>
              <input
                type="text"
                id="rua"
                name="rua"
                placeholder="Rua"
                value={formData.rua}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.rua ? "error" : ""}
              />
              {errors.rua && <span className="error-message">{errors.rua}</span>}
            </div>
            <div className="info-block">
              <i className="fas fa-home"></i>
              <input
                type="text"
                id="numero"
                name="numero"
                placeholder="Número"
                value={formData.numero}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.numero ? "error" : ""}
              />
              {errors.numero && <span className="error-message">{errors.numero}</span>}
            </div>
            <div className="info-block">
              <i className="fas fa-map-marker-alt"></i>
              <input
                type="text"
                id="bairro"
                name="bairro"
                placeholder="Bairro"
                value={formData.bairro}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.bairro ? "error" : ""}
              />
              {errors.bairro && <span className="error-message">{errors.bairro}</span>}
            </div>
            <div className="info-block">
              <i className="fas fa-city"></i>
              <input
                type="text"
                id="cidade"
                name="cidade"
                placeholder="Cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.cidade ? "error" : ""}
              />
              {errors.cidade && <span className="error-message">{errors.cidade}</span>}
            </div>
            <div className="info-block">
              <i className="fas fa-flag"></i>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.estado ? "error" : ""}
              >
                <option value="">Selecione o estado</option>
                <option value="AC">AC - Acre</option>
                <option value="AL">AL - Alagoas</option>
                <option value="AP">AP - Amapá</option>
                <option value="AM">AM - Amazonas</option>
                <option value="BA">BA - Bahia</option>
                <option value="CE">CE - Ceará</option>
                <option value="DF">DF - Distrito Federal</option>
                <option value="ES">ES - Espírito Santo</option>
                <option value="GO">GO - Goiás</option>
                <option value="MA">MA - Maranhão</option>
                <option value="MT">MT - Mato Grosso</option>
                <option value="MS">MS - Mato Grosso do Sul</option>
                <option value="MG">MG - Minas Gerais</option>
                <option value="PA">PA - Pará</option>
                <option value="PB">PB - Paraíba</option>
                <option value="PR">PR - Paraná</option>
                <option value="PE">PE - Pernambuco</option>
                <option value="PI">PI - Piauí</option>
                <option value="RJ">RJ - Rio de Janeiro</option>
                <option value="RN">RN - Rio Grande do Norte</option>
                <option value="RS">RS - Rio Grande do Sul</option>
                <option value="RO">RO - Rondônia</option>
                <option value="RR">RR - Roraima</option>
                <option value="SC">SC - Santa Catarina</option>
                <option value="SP">SP - São Paulo</option>
                <option value="SE">SE - Sergipe</option>
                <option value="TO">TO - Tocantins</option>
              </select>
              {errors.estado && <span className="error-message">{errors.estado}</span>}
            </div>
            <div className="info-block">
              <i className="fas fa-mail-bulk"></i>
              <input
                type="text"
                id="cep"
                name="cep"
                placeholder="CEP"
                value={formData.cep}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.cep ? "error" : ""}
              />
              {errors.cep && <span className="error-message">{errors.cep}</span>}
            </div>
          </div>

          <div className="section-card">
            <h2>Segurança</h2>
            <div className="info-block">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Digite nova senha"
                value={formData.senha}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.senha ? "error" : ""}
              />
              {errors.senha && <span className="error-message">{errors.senha}</span>}
            </div>
            <div className="info-block">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="confirmar"
                name="confirmar"
                placeholder="Confirme nova senha"
                value={formData.confirmar}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.confirmar ? "error" : ""}
              />
              {errors.confirmar && <span className="error-message">{errors.confirmar}</span>}
            </div>
            <div className="warning">
              Deixe em branco se não deseja alterar a senha atual.
            </div>
            <div className="button-group">
              <button type="submit" className="save-btn">
                Salvar Alterações
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleReset}
              >
                Restaurar padrão
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
