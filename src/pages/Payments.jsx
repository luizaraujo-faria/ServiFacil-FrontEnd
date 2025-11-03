import { useState, useEffect } from 'react';
import { useEnterNavigation } from '../hooks/useEnterNavigation';
import { ButtonLoading } from '../components/Loading';
import { CreditCard, Lock, MapPin } from 'lucide-react';
import ServiceIcon from '../assets/icone-limpeza.png';
import ProviderAvatar from '../assets/images.jpg';
import UserNavigation from '../components/UserNavigation';

const Payments = () => {
    const handleKeyPress = useEnterNavigation();
    const [paymentData, setPaymentData] = useState(() => {
        const defaults = {
            cardNumber: '', expiryDate: '', cvv: '', cardName: '',
            address: '', city: '', state: '', cep: '',
        };
        try {
            const stored = localStorage.getItem('payment_form');
            return stored ? JSON.parse(stored) : defaults;
        } catch (_) {
            return defaults;
        }
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [orderData] = useState(() => {
        try {
            const stored = localStorage.getItem('order_data');
            if (stored) return JSON.parse(stored);
        } catch (_) {}
        return {
            service: { id: 1, name: 'Serviço de Limpeza', description: 'Limpeza completa - 4 horas', price: 150.0, icon: ServiceIcon },
            provider: { id: 1, name: 'Maria Silva', avatar: ProviderAvatar, rating: 4.8, reviewCount: 56 },
            fees: { service: 15.0, platform: 0.0 },
            currency: 'BRL',
        };
    });

    useEffect(() => {
        try {
            localStorage.setItem('payment_form', JSON.stringify(paymentData));
        } catch (_) {}
    }, [paymentData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
        let v = value;
        if (name === 'cardNumber') {
            v = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
        } else if (name === 'expiryDate') {
            v = value.replace(/\D/g, '').slice(0, 4);
            if (v.length >= 3) v = v.replace(/(\d{2})(\d{1,2})/, '$1/$2');
        } else if (name === 'cvv') {
            v = value.replace(/\D/g, '').slice(0, 4);
        } else if (name === 'cep') {
            v = value.replace(/\D/g, '').slice(0, 8);
            if (v.length > 5) v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
        } else if (name === 'cardName') {
            v = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').slice(0, 50);
        } else if (name === 'city') {
            v = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').slice(0, 50);
        } else if (name === 'address') {
            v = value.replace(/[^a-zA-ZÀ-ÿ0-9\s,.-]/g, '').slice(0, 100);
        }
        setPaymentData((prev) => ({ ...prev, [name]: v }));
    };

    const validateForm = () => {
        const errs = {};
        const cardNumberClean = paymentData.cardNumber.replace(/\s/g, '');
        if (!cardNumberClean) errs.cardNumber = 'Número do cartão é obrigatório';
        else if (cardNumberClean.length < 16) errs.cardNumber = 'Número do cartão deve ter 16 dígitos';
        if (!paymentData.expiryDate.trim()) errs.expiryDate = 'Data de validade é obrigatória';
        else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) errs.expiryDate = 'Data de validade inválida (MM/AA)';
        else {
            const [month, year] = paymentData.expiryDate.split('/');
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;
            if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                errs.expiryDate = 'Cartão expirado';
            }
            if (parseInt(month) < 1 || parseInt(month) > 12) errs.expiryDate = 'Mês inválido';
        }
        if (!paymentData.cvv.trim()) errs.cvv = 'CVV é obrigatório';
        else if (paymentData.cvv.length < 3) errs.cvv = 'CVV deve ter pelo menos 3 dígitos';
        if (!paymentData.cardName.trim()) errs.cardName = 'Nome no cartão é obrigatório';
        else if (paymentData.cardName.trim().length < 2) errs.cardName = 'Nome deve ter pelo menos 2 caracteres';
        if (!paymentData.address.trim()) errs.address = 'Endereço é obrigatório';
        else if (paymentData.address.trim().length < 5) errs.address = 'Endereço deve ter pelo menos 5 caracteres';
        if (!paymentData.city.trim()) errs.city = 'Cidade é obrigatória';
        else if (paymentData.city.trim().length < 2) errs.city = 'Nome da cidade deve ter pelo menos 2 caracteres';
        if (!paymentData.state) errs.state = 'Estado é obrigatório';
        if (!paymentData.cep.trim()) errs.cep = 'CEP é obrigatório';
        else if (!/^\d{5}-\d{3}$/.test(paymentData.cep)) errs.cep = 'CEP inválido (formato: 00000-000)';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const calculateTotal = () => {
        return (orderData?.service?.price || 0) + (orderData?.fees?.service || 0) + (orderData?.fees?.platform || 0);
    };

    const handlePayment = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const payload = {
                orderId: orderData?.service?.id,
                providerId: orderData?.provider?.id,
                amount: calculateTotal(),
                currency: orderData?.currency || 'BRL',
                paymentMethod: {
                    type: 'credit_card',
                    cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
                    expiryDate: paymentData.expiryDate,
                    cvv: paymentData.cvv,
                    cardName: paymentData.cardName,
                },
                billingAddress: {
                    address: paymentData.address,
                    city: paymentData.city,
                    state: paymentData.state,
                    cep: paymentData.cep,
                },
            };
            await new Promise((r) => setTimeout(r, 1200));
            localStorage.setItem('last_payment', JSON.stringify(payload));
            localStorage.removeItem('payment_form');
            alert('Pagamento processado com sucesso!');
        } catch (err) {
            console.error('Erro no pagamento:', err);
            alert('Erro ao processar pagamento. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <UserNavigation />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-violet-400 to-yellow-400 bg-clip-text text-transparent">
                    Finalizar Pagamento
                </h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    <section className="flex-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-violet-400" />
                            Dados de Pagamento
                        </h3>

                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-gray-700 mb-4">Informações do Cartão</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
                                    <div className={`flex items-center gap-3 p-4 rounded-lg border ${errors.cardNumber ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                                        <CreditCard className="w-5 h-5 text-violet-400 flex-shrink-0" />
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            name="cardNumber"
                                            value={paymentData.cardNumber}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            maxLength={19}
                                            autoComplete="cc-number"
                                            className="flex-1 bg-transparent outline-none text-gray-700"
                                        />
                                    </div>
                                    {errors.cardNumber && <span className="text-red-500 text-sm mt-1 block">{errors.cardNumber}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                                        <div className={`flex items-center gap-3 p-4 rounded-lg border ${errors.expiryDate ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                                            <input
                                                type="text"
                                                placeholder="MM/AA"
                                                name="expiryDate"
                                                value={paymentData.expiryDate}
                                                onChange={handleInputChange}
                                                onKeyPress={handleKeyPress}
                                                maxLength={5}
                                                autoComplete="cc-exp"
                                                className="flex-1 bg-transparent outline-none text-gray-700"
                                            />
                                        </div>
                                        {errors.expiryDate && <span className="text-red-500 text-sm mt-1 block">{errors.expiryDate}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                        <div className={`flex items-center gap-3 p-4 rounded-lg border ${errors.cvv ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                name="cvv"
                                                value={paymentData.cvv}
                                                onChange={handleInputChange}
                                                onKeyPress={handleKeyPress}
                                                maxLength={4}
                                                autoComplete="cc-csc"
                                                className="flex-1 bg-transparent outline-none text-gray-700"
                                            />
                                        </div>
                                        {errors.cvv && <span className="text-red-500 text-sm mt-1 block">{errors.cvv}</span>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome no Cartão</label>
                                    <div className={`flex items-center gap-3 p-4 rounded-lg border ${errors.cardName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                                        <input
                                            type="text"
                                            placeholder="Como está impresso no cartão"
                                            name="cardName"
                                            value={paymentData.cardName}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            autoComplete="cc-name"
                                            className="flex-1 bg-transparent outline-none text-gray-700"
                                        />
                                    </div>
                                    {errors.cardName && <span className="text-red-500 text-sm mt-1 block">{errors.cardName}</span>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-violet-400" />
                                Endereço de Cobrança
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rua, número e bairro</label>
                                    <div className={`flex items-center gap-3 p-4 rounded-lg border ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                                        <MapPin className="w-5 h-5 text-violet-400 flex-shrink-0" />
                                        <input
                                            type="text"
                                            placeholder="Av. Brasil, 123 - Centro"
                                            name="address"
                                            value={paymentData.address}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            className="flex-1 bg-transparent outline-none text-gray-700"
                                        />
                                    </div>
                                    {errors.address && <span className="text-red-500 text-sm mt-1 block">{errors.address}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                                        <div className={`flex items-center gap-3 p-4 rounded-lg border ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                                            <input
                                                type="text"
                                                placeholder="São Paulo"
                                                name="city"
                                                value={paymentData.city}
                                                onChange={handleInputChange}
                                                onKeyPress={handleKeyPress}
                                                className="flex-1 bg-transparent outline-none text-gray-700"
                                            />
                                        </div>
                                        {errors.city && <span className="text-red-500 text-sm mt-1 block">{errors.city}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                        <div className={`flex items-center gap-3 p-4 rounded-lg border ${errors.state ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                                            <select
                                                name="state"
                                                value={paymentData.state}
                                                onChange={handleInputChange}
                                                onKeyPress={handleKeyPress}
                                                className="flex-1 bg-transparent outline-none text-gray-700"
                                            >
                                                <option value="">Selecione</option>
                                                {['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'PA'].map((uf) => (
                                                    <option key={uf} value={uf}>{uf}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.state && <span className="text-red-500 text-sm mt-1 block">{errors.state}</span>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                                    <div className={`flex items-center gap-3 p-4 rounded-lg border ${errors.cep ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                                        <MapPin className="w-5 h-5 text-violet-400 flex-shrink-0" />
                                        <input
                                            type="text"
                                            placeholder="00000-000"
                                            name="cep"
                                            value={paymentData.cep}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            maxLength={9}
                                            className="flex-1 bg-transparent outline-none text-gray-700"
                                        />
                                    </div>
                                    {errors.cep && <span className="text-red-500 text-sm mt-1 block">{errors.cep}</span>}
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Resumo do Pedido</h3>

                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-3 mb-2">
                                <img
                                    src={orderData?.service?.icon || ServiceIcon}
                                    alt="Serviço"
                                    className="w-10 h-10 object-contain"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{orderData?.service?.name}</p>
                                    <p className="text-sm text-gray-600">{orderData?.service?.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                                <img
                                    src={orderData?.provider?.avatar || ProviderAvatar}
                                    alt={orderData?.provider?.name || 'Profissional'}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-medium text-gray-800">{orderData?.provider?.name}</p>
                                    <span className="text-sm text-yellow-600">
                                        ⭐ {orderData?.provider?.rating} ({orderData?.provider?.reviewCount} avaliações)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span>R$ {orderData?.service?.price?.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Taxa de serviço</span>
                                <span>R$ {orderData?.fees?.service?.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                                <span>Total</span>
                                <span>R$ {calculateTotal().toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-center gap-2 text-green-700 text-sm">
                            <Lock className="w-4 h-4" />
                            <span>Seus dados estão protegidos com criptografia SSL</span>
                        </div>

                        <ButtonLoading
                            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50"
                            onClick={handlePayment}
                            loading={loading}
                            disabled={loading}
                        >
                            Confirmar Pagamento
                        </ButtonLoading>

                        <p className="text-xs text-gray-500 text-center mt-3">
                            Ao confirmar, você concorda com nossos{' '}
                            <a href="/Terms" className="text-green-500 hover:underline">Termos de Serviço</a>
                        </p>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Payments;

