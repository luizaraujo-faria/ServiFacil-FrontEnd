import { useState, useMemo } from 'react';
import { HelpCircle, Users } from 'lucide-react';
import UserNavigation from '../components/UserNavigation';

const ALL_FAQ = [
    {
        q: 'Como enviar uma proposta para um projeto?',
        a: 'Para enviar uma proposta: 1) Acesse a página do projeto desejado, 2) Clique no botão "Enviar Proposta", 3) Preencha sua proposta com valor, prazo e descrição detalhada, 4) Anexe portfólio se necessário, 5) Clique em "Enviar". Você receberá uma confirmação por email.',
    },
    {
        q: 'Como cancelar um contrato em andamento?',
        a: 'Para cancelar um contrato: 1) Acesse "Meus Projetos", 2) Selecione o projeto ativo, 3) Clique em "Solicitar Cancelamento", 4) Informe o motivo, 5) Aguarde aprovação do cliente. Atenção: verifique as cláusulas de cancelamento no contrato antes de prosseguir.',
    },
    {
        q: 'Como funciona o sistema de disputas de pagamento?',
        a: 'Se houver problemas com pagamento: 1) Vá em "Pagamentos" > "Disputas", 2) Clique em "Abrir Disputa", 3) Forneça evidências (conversas, entregas, etc.), 4) Nossa equipe analisará em até 7 dias úteis, 5) Você receberá a decisão por email. Mantenha sempre registros das comunicações.',
    },
    {
        q: 'Como solicitar suporte financeiro ou adiantamento?',
        a: 'Para solicitar suporte financeiro: 1) Acesse "Central Financeira", 2) Clique em "Solicitar Adiantamento", 3) Envie comprovantes de renda e projetos em andamento, 4) Abra um ticket de suporte, 5) Aguarde análise (até 3 dias úteis). Disponível apenas para usuários com histórico positivo.',
    },
    {
        q: 'Como alterar meu método de saque preferido?',
        a: 'Para alterar método de saque: 1) Vá em "Configurações" > "Financeiro", 2) Selecione "Métodos de Saque", 3) Escolha entre PIX, transferência bancária ou carteira digital, 4) Preencha os dados necessários, 5) Confirme com sua senha. As alterações são aplicadas no próximo saque.',
    },
    {
        q: 'Como editar informações do meu perfil?',
        a: 'Para editar seu perfil: 1) Clique em "Perfil" no menu, 2) Selecione "Editar Perfil", 3) Atualize suas informações pessoais, habilidades e portfólio, 4) Adicione uma foto profissional, 5) Clique em "Salvar Alterações". Um perfil completo aumenta suas chances de conseguir projetos.',
    },
    {
        q: 'Como redefinir minha senha de acesso?',
        a: 'Para redefinir sua senha: 1) Na tela de login, clique em "Esqueci minha senha", 2) Digite seu email cadastrado, 3) Verifique sua caixa de entrada (e spam), 4) Clique no link recebido, 5) Crie uma nova senha segura. O link expira em 24 horas.',
    },
    {
        q: 'Como configurar minhas notificações?',
        a: 'Para configurar notificações: 1) Acesse "Configurações" > "Notificações", 2) Escolha quais tipos de notificação deseja receber (propostas, mensagens, pagamentos), 3) Selecione os canais (email, SMS, push), 4) Defina a frequência (imediata, diária, semanal), 5) Salve as configurações.',
    },
    {
        q: 'Qual é a taxa cobrada pela plataforma?',
        a: 'Nossa taxa de serviço é de 10% sobre o valor total do projeto, descontada automaticamente quando o pagamento é liberado. Esta taxa cobre: proteção contra fraudes, suporte ao cliente, sistema de disputas, e manutenção da plataforma. Não há taxas de cadastro ou mensalidades.',
    },
    {
        q: 'Como funciona o sistema de avaliações?',
        a: 'Após cada projeto: 1) Cliente e freelancer se avaliam mutuamente, 2) Notas de 1 a 5 estrelas, 3) Comentários opcionais, 4) Avaliações aparecem no perfil, 5) Média geral é calculada automaticamente. Avaliações honestas ajudam a manter a qualidade da plataforma.',
    },
];

const Help = () => {
    const [query, setQuery] = useState('');
    const [openIdx, setOpenIdx] = useState(-1);

    const filteredFAQ = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return ALL_FAQ;
        return ALL_FAQ.filter(
            (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
        );
    }, [query]);

    const toggleAccordion = (idx) => {
        setOpenIdx((prev) => (prev === idx ? -1 : idx));
    };

    // suporte removido

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <UserNavigation />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-violet-400 to-yellow-400 bg-clip-text text-transparent">
                        Ajuda & Suporte
                    </h1>
                    <div className="flex items-center justify-center gap-2 p-4 bg-violet-50 border border-violet-200 rounded-xl text-violet-700 font-medium">
                        <HelpCircle className="w-5 h-5" />
                        <span>Encontre respostas rápidas ou abra um chamado.</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-violet-400" />
                        Perguntas Frequentes
                    </h2>
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Buscar perguntas..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-400"
                        />
                        <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                        {filteredFAQ.map((item, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                                    onClick={() => toggleAccordion(idx)}
                                >
                                    <span className="font-semibold text-gray-800 pr-4">{item.q}</span>
                                    <span className={`text-violet-400 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </button>
                                {openIdx === idx && (
                                    <div className="p-4 bg-gray-50 border-t border-gray-200 text-gray-700">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* seção de suporte removida */}

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Tutoriais rápidos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { icon: '📤', label: 'Como enviar proposta' },
                            { icon: '🧾', label: 'Como emitir nota fiscal' },
                            { icon: '💰', label: 'Como solicitar saque' },
                        ].map((tutorial, idx) => (
                            <button
                                key={idx}
                                onClick={() => alert('Tutorial em desenvolvimento')}
                                className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-violet-400 to-yellow-400 text-white rounded-xl hover:shadow-lg transition"
                            >
                                <span className="text-3xl">{tutorial.icon}</span>
                                <span className="font-medium">{tutorial.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-violet-400 to-yellow-400 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-8 h-8" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-semibold mb-2">Comunidade</h3>
                            <p className="mb-4 opacity-90">
                                Conecte-se com outros freelancers e tire suas dúvidas
                            </p>
                            <button
                                onClick={() => alert('Fórum em desenvolvimento')}
                                className="px-6 py-3 bg-white text-violet-600 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2 mx-auto md:mx-0"
                            >
                                Acessar fórum →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;

