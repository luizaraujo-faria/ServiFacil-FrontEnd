import { useState, useEffect, useMemo } from 'react';
import { Shield, Download, Trash2 } from 'lucide-react';
import UserNavigation from '../components/UserNavigation';

const defaultState = {
    visibility: 'public',
    onlineStatus: 'online',
    online: true,
    blockedSearch: '',
    blocked: ['maria.silva', 'joao.souza'],
};

const Privacy = () => {
    const [state, setState] = useState(() => {
        try {
            const stored = localStorage.getItem('privacy_settings');
            return stored ? JSON.parse(stored) : defaultState;
        } catch (_) {
            return defaultState;
        }
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmName, setConfirmName] = useState('');

    useEffect(() => {
        try {
            localStorage.setItem('privacy_settings', JSON.stringify(state));
        } catch (_) {}
    }, [state]);

    const filteredBlocked = useMemo(() => {
        const q = state.blockedSearch.trim().toLowerCase();
        if (!q) return state.blocked;
        return state.blocked.filter((u) => u.toLowerCase().includes(q));
    }, [state.blocked, state.blockedSearch]);

    const handleUnblock = (user) => {
        setState((prev) => ({
            ...prev,
            blocked: prev.blocked.filter((u) => u !== user),
        }));
    };

    const handleDownloadData = () => {
        const blob = new Blob([JSON.stringify(state, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meus-dados.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const canConfirmDelete = confirmName.trim().toUpperCase() === 'CONFIRMAR';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <UserNavigation />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-violet-400 to-yellow-400 bg-clip-text text-transparent">
                        Privacidade
                    </h1>
                    <div className="flex items-center justify-center gap-2 p-4 bg-violet-50 border border-violet-200 rounded-xl text-violet-700 font-medium">
                        <Shield className="w-5 h-5" />
                        <span>Seus dados estão protegidos e criptografados. Controle quem vê seu perfil.</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Visibilidade do Perfil</h2>
                    <div className="space-y-3">
                        {[
                            { value: 'public', label: 'Público', desc: 'Qualquer pessoa pode ver seu perfil' },
                            { value: 'clients', label: 'Somente clientes', desc: 'Apenas clientes ativos podem ver' },
                            { value: 'private', label: 'Privado', desc: 'Perfil completamente privado' },
                        ].map(({ value, label, desc }) => (
                            <label
                                key={value}
                                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-violet-300 transition"
                            >
                                <input
                                    type="radio"
                                    name="visibility"
                                    value={value}
                                    checked={state.visibility === value}
                                    onChange={(e) => setState((p) => ({ ...p, visibility: e.target.value }))}
                                    className="mt-1 w-4 h-4 text-violet-400 focus:ring-violet-300"
                                />
                                <div>
                                    <span className="font-semibold text-gray-800 block">{label}</span>
                                    <small className="text-gray-600 text-sm">{desc}</small>
                                </div>
                            </label>
                        ))}
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4 text-yellow-800 text-sm flex items-start gap-2">
                        <span>💡</span>
                        <span><strong>Dica:</strong> Perfis públicos recebem mais propostas de trabalho.</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Online</h2>
                    <div className="space-y-3">
                        {[
                            { value: 'online', label: 'Online', desc: 'Disponível para novos projetos' },
                            { value: 'busy', label: 'Ocupado', desc: 'Trabalhando em projetos atuais' },
                            { value: 'offline', label: 'Offline', desc: 'Não disponível para novos projetos' },
                        ].map(({ value, label, desc }) => (
                            <label
                                key={value}
                                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-violet-300 transition"
                            >
                                <input
                                    type="radio"
                                    name="onlineStatus"
                                    value={value}
                                    checked={state.onlineStatus === value}
                                    onChange={(e) => setState((p) => ({ ...p, onlineStatus: e.target.value }))}
                                    className="mt-1 w-4 h-4 text-violet-400 focus:ring-violet-300"
                                />
                                <div>
                                    <span className="font-semibold text-gray-800 block">{label}</span>
                                    <small className="text-gray-600 text-sm">{desc}</small>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Usuários Bloqueados</h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Buscar usuário bloqueado..."
                            value={state.blockedSearch}
                            onChange={(e) => setState((p) => ({ ...p, blockedSearch: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                        />
                    </div>
                    <div className="space-y-2">
                        {filteredBlocked.length === 0 ? (
                            <div className="text-center text-gray-500 py-8 italic">
                                {state.blockedSearch.trim() ? 'Nenhum usuário encontrado' : 'Nenhum usuário bloqueado'}
                            </div>
                        ) : (
                            filteredBlocked.map((username) => (
                                <div
                                    key={username}
                                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <span className="font-medium text-gray-800">@{username}</span>
                                    <button
                                        onClick={() => handleUnblock(username)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                                    >
                                        Desbloquear
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Download className="w-5 h-5 text-violet-400" />
                        Exportar Dados
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Baixe uma cópia de todas as suas configurações de privacidade.
                    </p>
                    <button
                        onClick={handleDownloadData}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Exportar dados
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200">
                    <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
                        <Trash2 className="w-5 h-5" />
                        Zona de Perigo
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Ações irreversíveis que afetam permanentemente sua conta.
                    </p>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Excluir conta
                    </button>
                </div>

                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-red-600 mb-4">Confirmar exclusão</h3>
                            <p className="text-gray-600 mb-4">
                                Esta ação não pode ser desfeita. Digite "CONFIRMAR" para prosseguir:
                            </p>
                            <input
                                type="text"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                                placeholder="Digite CONFIRMAR"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setConfirmName('');
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        alert('Funcionalidade em desenvolvimento');
                                        setShowDeleteModal(false);
                                        setConfirmName('');
                                    }}
                                    disabled={!canConfirmDelete}
                                    className={`flex-1 px-4 py-2 rounded-lg transition ${
                                        canConfirmDelete
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Privacy;

