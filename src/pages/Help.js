import React, { useMemo, useState } from "react";
import "./Help.css";
import { useEnterNavigation } from "../hooks/useEnterNavigation";

const ALL_FAQ = [
  {
    q: "Como enviar uma proposta para um projeto?",
    a: "Para enviar uma proposta: 1) Acesse a página do projeto desejado, 2) Clique no botão 'Enviar Proposta', 3) Preencha sua proposta com valor, prazo e descrição detalhada, 4) Anexe portfólio se necessário, 5) Clique em 'Enviar'. Você receberá uma confirmação por email.",
  },
  {
    q: "Como cancelar um contrato em andamento?",
    a: "Para cancelar um contrato: 1) Acesse 'Meus Projetos', 2) Selecione o projeto ativo, 3) Clique em 'Solicitar Cancelamento', 4) Informe o motivo, 5) Aguarde aprovação do cliente. Atenção: verifique as cláusulas de cancelamento no contrato antes de prosseguir.",
  },
  {
    q: "Como funciona o sistema de disputas de pagamento?",
    a: "Se houver problemas com pagamento: 1) Vá em 'Pagamentos' > 'Disputas', 2) Clique em 'Abrir Disputa', 3) Forneça evidências (conversas, entregas, etc.), 4) Nossa equipe analisará em até 7 dias úteis, 5) Você receberá a decisão por email. Mantenha sempre registros das comunicações.",
  },
  {
    q: "Como solicitar suporte financeiro ou adiantamento?",
    a: "Para solicitar suporte financeiro: 1) Acesse 'Central Financeira', 2) Clique em 'Solicitar Adiantamento', 3) Envie comprovantes de renda e projetos em andamento, 4) Abra um ticket de suporte, 5) Aguarde análise (até 3 dias úteis). Disponível apenas para usuários com histórico positivo.",
  },
  {
    q: "Como alterar meu método de saque preferido?",
    a: "Para alterar método de saque: 1) Vá em 'Configurações' > 'Financeiro', 2) Selecione 'Métodos de Saque', 3) Escolha entre PIX, transferência bancária ou carteira digital, 4) Preencha os dados necessários, 5) Confirme com sua senha. As alterações são aplicadas no próximo saque.",
  },
  {
    q: "Como editar informações do meu perfil?",
    a: "Para editar seu perfil: 1) Clique em 'Perfil' no menu, 2) Selecione 'Editar Perfil', 3) Atualize suas informações pessoais, habilidades e portfólio, 4) Adicione uma foto profissional, 5) Clique em 'Salvar Alterações'. Um perfil completo aumenta suas chances de conseguir projetos.",
  },
  {
    q: "Como redefinir minha senha de acesso?",
    a: "Para redefinir sua senha: 1) Na tela de login, clique em 'Esqueci minha senha', 2) Digite seu email cadastrado, 3) Verifique sua caixa de entrada (e spam), 4) Clique no link recebido, 5) Crie uma nova senha segura. O link expira em 24 horas.",
  },
  {
    q: "Como configurar minhas notificações?",
    a: "Para configurar notificações: 1) Acesse 'Configurações' > 'Notificações', 2) Escolha quais tipos de notificação deseja receber (propostas, mensagens, pagamentos), 3) Selecione os canais (email, SMS, push), 4) Defina a frequência (imediata, diária, semanal), 5) Salve as configurações.",
  },
  {
    q: "Qual é a taxa cobrada pela plataforma?",
    a: "Nossa taxa de serviço é de 10% sobre o valor total do projeto, descontada automaticamente quando o pagamento é liberado. Esta taxa cobre: proteção contra fraudes, suporte ao cliente, sistema de disputas, e manutenção da plataforma. Não há taxas de cadastro ou mensalidades.",
  },
  {
    q: "Como funciona o sistema de avaliações?",
    a: "Após cada projeto: 1) Cliente e freelancer se avaliam mutuamente, 2) Notas de 1 a 5 estrelas, 3) Comentários opcionais, 4) Avaliações aparecem no perfil, 5) Média geral é calculada automaticamente. Avaliações honestas ajudam a manter a qualidade da plataforma.",
  },
];

const Help = () => {
  const handleKeyPress = useEnterNavigation();
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState(-1);
  const [ticket, setTicket] = useState({
    subject: "",
    description: "",
    priority: "normal",
    file: null,
  });
  const [toast, setToast] = useState("");

  const filteredFAQ = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_FAQ;
    return ALL_FAQ.filter(
      (item) =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [query]);

  const toggleAccordion = (idx) => {
    setOpenIdx((prev) => (prev === idx ? -1 : idx));
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    const ticketNumber = Math.floor(1000 + Math.random() * 9000);
    const priorityText = {
      low: "baixa prioridade",
      normal: "prioridade normal", 
      high: "alta prioridade",
      urgent: "prioridade urgente"
    };
    setToast(
      `✅ Chamado #${ticketNumber} criado com sucesso! Prioridade: ${priorityText[ticket.priority]}. Nossa equipe responderá em até 48h úteis.`
    );
    setTicket({ subject: "", description: "", priority: "normal", file: null });
    setTimeout(() => setToast(""), 6000);
  };

  return (
    <div
      className="editar-perfil help-page"
      style={{ width: "100%", maxWidth: 900 }}
    >
      <div className="header-editar" style={{ width: "100%" }}>
        <h1>Ajuda & Suporte</h1>
        <div className="security-info">
          <i className="fas fa-life-ring"></i>
          <span>Encontre respostas rápidas ou abra um chamado.</span>
        </div>

        {/* FAQ Section */}
        <div className="section-card help-faq">
          <h2><i className="fas fa-question-circle"></i> Perguntas Frequentes</h2>
          <div className="help-search">
            <input
              type="text"
              placeholder="Buscar perguntas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar perguntas frequentes"
            />
            <i className="fas fa-search"></i>
          </div>
          <div className="help-accordion">
            {filteredFAQ.map((item, idx) => (
              <div key={idx} className="help-accordion-item">
                <button
                  className="help-accordion-trigger"
                  aria-expanded={openIdx === idx}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleAccordion(idx);
                    }
                  }}
                  onClick={() => toggleAccordion(idx)}
                >
                  <span>{item.q}</span>
                  <i
                    className={`fas fa-chevron-${
                      openIdx === idx ? "up" : "down"
                    }`}
                  ></i>
                </button>
                {openIdx === idx && (
                  <div className="help-accordion-panel">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Ticket Section */}
        <div className="section-card help-ticket">
          <h2><i className="fas fa-headset"></i> Abrir Chamado de Suporte</h2>
          <form onSubmit={handleSubmitTicket} className="help-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Assunto do chamado"
                value={ticket.subject}
                onChange={(e) =>
                  setTicket((p) => ({ ...p, subject: e.target.value }))
                }
                onKeyPress={handleKeyPress}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Descreva detalhadamente o problema ou dúvida"
                value={ticket.description}
                onChange={(e) =>
                  setTicket((p) => ({ ...p, description: e.target.value.slice(0, 500) }))
                }
                onKeyPress={handleKeyPress}
                rows={4}
                maxLength={500}
                required
              />
            </div>
            <div className="form-row">
              <label className="file-label">
                <i className="fas fa-paperclip"></i>
                Anexar arquivo
                <input
                  type="file"
                  onChange={(e) =>
                    setTicket((p) => ({
                      ...p,
                      file: e.target.files?.[0] || null,
                    }))
                  }
                />
              </label>
              <label className="select-label">
                Prioridade:
                <select
                  value={ticket.priority}
                  onChange={(e) =>
                    setTicket((p) => ({ ...p, priority: e.target.value }))
                  }
                  onKeyPress={handleKeyPress}
                >
                  <option value="low">🟢 Baixa</option>
                  <option value="normal">🟡 Normal</option>
                  <option value="high">🔴 Alta</option>
                  <option value="urgent">⚡ Urgente</option>
                </select>
              </label>
            </div>
            <div className="form-actions">
              <div className="char-counter">
                {ticket.description.length}/500 caracteres
              </div>
              <button className="save-btn" type="submit" disabled={!ticket.subject.trim() || !ticket.description.trim()}>
                <i className="fas fa-paper-plane"></i>
                Enviar Chamado
              </button>
            </div>
          </form>
          {toast && (
            <div className="toast" role="status" aria-live="polite">
              {toast}
            </div>
          )}
        </div>

        {/* Quick Tutorials */}
        <div className="section-card help-tutorials">
          <h2>Tutoriais rápidos</h2>
          <div className="tutorial-grid">
            <a href="#" className="tutorial-card" onClick={(e) => { e.preventDefault(); alert('Tutorial em desenvolvimento'); }}>
              <i className="fas fa-paper-plane"></i>
              <span>Como enviar proposta</span>
            </a>
            <a href="#" className="tutorial-card" onClick={(e) => { e.preventDefault(); alert('Tutorial em desenvolvimento'); }}>
              <i className="fas fa-file-invoice"></i>
              <span>Como emitir nota fiscal</span>
            </a>
            <a href="#" className="tutorial-card" onClick={(e) => { e.preventDefault(); alert('Tutorial em desenvolvimento'); }}>
              <i className="fas fa-money-bill-wave"></i>
              <span>Como solicitar saque</span>
            </a>
          </div>
        </div>

        {/* Community */}
        <div className="section-card help-community">
          <div className="community-content">
            <div className="community-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="community-text">
              <h3>Comunidade</h3>
              <p>Conecte-se com outros freelancers e tire suas dúvidas</p>
              <button className="community-btn" onClick={() => alert('Fórum em desenvolvimento')}>
                Acessar fórum
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
