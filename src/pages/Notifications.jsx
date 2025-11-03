import { useState, useEffect, useMemo } from 'react';
import { Bell } from 'lucide-react';
import UserNavigation from '../components/UserNavigation';

const initialState = {
    proposals: true,
    messages: true,
    projects: false,
    promos: true,
    frequency: 'daily',
    channels: ['email', 'push'],
};

const Notifications = () => {
    const [settings, setSettings] = useState(() => {
        try {
            const stored = localStorage.getItem('notif_settings');
            return stored ? JSON.parse(stored) : initialState;
        } catch (_) {
            return initialState;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('notif_settings', JSON.stringify(settings));
        } catch (_) {}
    }, [settings]);

    const handleToggle = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFrequency = (e) => {
        setSettings((prev) => ({ ...prev, frequency: e.target.value }));
    };

    const handleChannel = (channel) => {
        setSettings((prev) => {
            const exists = prev.channels.includes(channel);
            return {
                ...prev,
                channels: exists
                    ? prev.channels.filter((c) => c !== channel)
                    : [...prev.channels, channel],
            };
        });
    };

    const preview = useMemo(() => {
        return {
            title: 'Nova mensagem de cliente',
            lines: [
                'Você recebeu uma nova mensagem.',
                'Abra o app para responder rapidamente.',
            ],
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <UserNavigation />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-violet-400 to-yellow-400 bg-clip-text text-transparent">
                        Notificações
                    </h1>
                    <div className="flex items-center justify-center gap-2 p-4 bg-violet-50 border border-violet-200 rounded-xl text-violet-700 font-medium">
                        <Bell className="w-5 h-5" />
                        <span>Escolha como e quando receber alertas.</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Categorias</h2>
                    <div className="space-y-3">
                        {[
                            { key: 'proposals', label: 'Novas propostas' },
                            { key: 'messages', label: 'Mensagens de clientes' },
                            { key: 'projects', label: 'Atualizações de projeto' },
                            { key: 'promos', label: 'Promoções e novidades' },
                        ].map(({ key, label }) => (
                            <div
                                key={key}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                <span className="font-medium text-gray-700">{label}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings[key]}
                                        onChange={() => handleToggle(key)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-400"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequência</h2>
                    <div className="space-y-3">
                        {[
                            { value: 'immediate', label: 'Imediato', desc: 'Receba notificações instantaneamente' },
                            { value: 'daily', label: 'Diário', desc: 'Resumo diário às 9h' },
                            { value: 'weekly', label: 'Semanal', desc: 'Resumo semanal às segundas' },
                        ].map(({ value, label, desc }) => (
                            <label
                                key={value}
                                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-violet-300 transition"
                            >
                                <input
                                    type="radio"
                                    name="frequency"
                                    value={value}
                                    checked={settings.frequency === value}
                                    onChange={handleFrequency}
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
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Canais</h2>
                    <div className="space-y-3">
                        {[
                            { value: 'email', label: 'E-mail', desc: 'Notificações por e-mail', icon: '📧' },
                            { value: 'push', label: 'Push (navegador/app)', desc: 'Notificações no dispositivo', icon: '📱' },
                            { value: 'sms', label: 'SMS', desc: 'Mensagens de texto', icon: '💬' },
                        ].map(({ value, label, desc, icon }) => (
                            <label
                                key={value}
                                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-violet-300 transition"
                            >
                                <input
                                    type="checkbox"
                                    checked={settings.channels.includes(value)}
                                    onChange={() => handleChannel(value)}
                                    className="w-4 h-4 text-violet-400 rounded focus:ring-violet-300"
                                />
                                <span className="text-xl">{icon}</span>
                                <div>
                                    <span className="font-semibold text-gray-800 block">{label}</span>
                                    <small className="text-gray-600 text-sm">{desc}</small>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview</h2>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <strong className="block mb-2 text-gray-800">{preview.title}</strong>
                        <div className="text-gray-700">{preview.lines[0]}</div>
                        <div className="text-gray-600 text-sm">{preview.lines[1]}</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4 text-yellow-800 text-sm">
                        Ativar notificações de mensagens permite responder clientes rapidamente.
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => setSettings(initialState)}
                        className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                    >
                        Restaurar padrão
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Notifications;

