import React, { useEffect, useState } from "react";
import "./Payments.css";
import { ButtonLoading } from "../components/Loading";
import { useEnterNavigation } from "../hooks/useEnterNavigation";

const Payments = () => {
  const handleKeyPress = useEnterNavigation();
  const [paymentData, setPaymentData] = useState(() => {
    const defaults = {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
      address: "",
      city: "",
      state: "",
      cep: "",
    };
    try {
      const stored = localStorage.getItem("payment_form");
      return stored ? JSON.parse(stored) : defaults;
    } catch (_) {
      return defaults;
    }
  });

  // Estados auxiliares para UX e preparação para backend
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderData, setOrderData] = useState(() => {
    // Mock pronto para ser substituído pelo backend (ex.: GET /api/orders/:id)
    try {
      const stored = localStorage.getItem("order_data");
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return {
      service: {
        id: 1,
        name: "Serviço de Limpeza",
        description: "Limpeza completa - 4 horas",
        price: 150.0,
        icon: "/images/icone-limpeza.png",
      },
      provider: {
        id: 1,
        name: "Maria Silva",
        avatar: `${process.env.PUBLIC_URL}/images/images.jpg`, // <- caminho correto
        rating: 4.8,
        reviewCount: 56,
      },
      fees: {
        service: 15.0,
        platform: 0.0,
      },
      currency: "BRL",
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem("payment_form", JSON.stringify(paymentData));
    } catch (_) {}
  }, [paymentData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));

    let v = value;

    // Campos que só aceitam números
    if (name === "cardNumber") {
      v = value
        .replace(/\D/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .slice(0, 19);
    } else if (name === "expiryDate") {
      v = value.replace(/\D/g, "").slice(0, 4);
      if (v.length >= 3) v = v.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    } else if (name === "cvv") {
      v = value.replace(/\D/g, "").slice(0, 4);
    } else if (name === "cep") {
      v = value.replace(/\D/g, "").slice(0, 8);
      if (v.length > 5) v = v.replace(/(\d{5})(\d{1,3})/, "$1-$2");
    }
    // Campos que só aceitam letras e espaços
    else if (name === "cardName") {
      v = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").slice(0, 50);
    } else if (name === "city") {
      v = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").slice(0, 50);
    }
    // Campo de endereço aceita letras, números, vírgulas, pontos e hífens
    else if (name === "address") {
      v = value.replace(/[^a-zA-ZÀ-ÿ0-9\s,.-]/g, "").slice(0, 100);
    }

    setPaymentData((prev) => ({
      ...prev,
      [name]: v,
    }));
  };

  // Algoritmo de Luhn para validar número de cartão
  const validateCardNumber = (cardNumber) => {
    const digits = cardNumber.replace(/\s/g, "").split("").map(Number);
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const validateForm = () => {
    const errs = {};

    // Validação do número do cartão
    const cardNumberClean = paymentData.cardNumber.replace(/\s/g, "");
    if (!cardNumberClean) {
      errs.cardNumber = "Número do cartão é obrigatório";
    } else if (cardNumberClean.length < 16) {
      errs.cardNumber = "Número do cartão deve ter 16 dígitos";
    } else if (!validateCardNumber(cardNumberClean)) {
      errs.cardNumber = "Número do cartão inválido";
    }

    // Validação da data de validade
    if (!paymentData.expiryDate.trim()) {
      errs.expiryDate = "Data de validade é obrigatória";
    } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      errs.expiryDate = "Data de validade inválida (MM/AA)";
    } else {
      // Validar se a data não está no passado
      const [month, year] = paymentData.expiryDate.split("/");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        errs.expiryDate = "Cartão expirado";
      }
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        errs.expiryDate = "Mês inválido";
      }
    }

    // Validação do CVV
    if (!paymentData.cvv.trim()) {
      errs.cvv = "CVV é obrigatório";
    } else if (paymentData.cvv.length < 3) {
      errs.cvv = "CVV deve ter pelo menos 3 dígitos";
    }

    // Validação do nome no cartão
    if (!paymentData.cardName.trim()) {
      errs.cardName = "Nome no cartão é obrigatório";
    } else if (paymentData.cardName.trim().length < 2) {
      errs.cardName = "Nome deve ter pelo menos 2 caracteres";
    }

    // Validação do endereço
    if (!paymentData.address.trim()) {
      errs.address = "Endereço é obrigatório";
    } else if (paymentData.address.trim().length < 5) {
      errs.address = "Endereço deve ter pelo menos 5 caracteres";
    }

    // Validação da cidade
    if (!paymentData.city.trim()) {
      errs.city = "Cidade é obrigatória";
    } else if (paymentData.city.trim().length < 2) {
      errs.city = "Nome da cidade deve ter pelo menos 2 caracteres";
    }

    // Validação do estado
    if (!paymentData.state) {
      errs.state = "Estado é obrigatório";
    }

    // Validação do CEP
    if (!paymentData.cep.trim()) {
      errs.cep = "CEP é obrigatório";
    } else if (!/^\d{5}-\d{3}$/.test(paymentData.cep)) {
      errs.cep = "CEP inválido (formato: 00000-000)";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const calculateTotal = () => {
    return (
      (orderData?.service?.price || 0) +
      (orderData?.fees?.service || 0) +
      (orderData?.fees?.platform || 0)
    );
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Payload pronto para envio ao backend Java
      const payload = {
        orderId: orderData?.service?.id,
        providerId: orderData?.provider?.id,
        amount: calculateTotal(),
        currency: orderData?.currency || "BRL",
        paymentMethod: {
          type: "credit_card",
          cardNumber: paymentData.cardNumber.replace(/\s/g, ""),
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

      // Exemplo futuro: await api.post('/payments', payload)
      await new Promise((r) => setTimeout(r, 1200));
      localStorage.setItem("last_payment", JSON.stringify(payload));
      localStorage.removeItem("payment_form");
      alert("Pagamento processado com sucesso!");
    } catch (err) {
      console.error("Erro no pagamento:", err);
      alert("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pagamento-main editar-perfil">
      <div className="header-editar">
        <h1>Finalizar Pagamento</h1>
      </div>

      <div className="payment-wrapper">
        <section className="payment-details section-card">
          <h3 className="titulo-pagamento">Dados de Pagamento</h3>

          <div className="section">
            <h4 className="info-cartao">Informações do Cartão</h4>
            <div className="input-group">
              <label>Número do Cartão</label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.cardNumber ? "error" : ""}
                maxLength={19}
                autoComplete="cc-number"
              />
              {errors.cardNumber && (
                <span className="error-message">{errors.cardNumber}</span>
              )}
            </div>

            <div className="row">
              <div className="input-group">
                <label>Validade</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={errors.expiryDate ? "error" : ""}
                  maxLength={5}
                  autoComplete="cc-exp"
                />
                {errors.expiryDate && (
                  <span className="error-message">{errors.expiryDate}</span>
                )}
              </div>
              <div className="input-group">
                <label>CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={errors.cvv ? "error" : ""}
                  maxLength={4}
                  autoComplete="cc-csc"
                />
                {errors.cvv && (
                  <span className="error-message">{errors.cvv}</span>
                )}
              </div>
            </div>

            <div className="input-group">
              <label>Nome no Cartão</label>
              <input
                type="text"
                placeholder="Como está impresso no cartão"
                name="cardName"
                value={paymentData.cardName}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.cardName ? "error" : ""}
                autoComplete="cc-name"
              />
              {errors.cardName && (
                <span className="error-message">{errors.cardName}</span>
              )}
            </div>
          </div>

          <div className="section">
            <h4>Endereço de Cobrança</h4>
            <div className="input-group">
              <label>Rua, número e bairro</label>
              <input
                type="text"
                placeholder="Av. Brasil, 123 - Centro"
                name="address"
                value={paymentData.address}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.address ? "error" : ""}
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>
            <div className="row">
              <div className="input-group">
                <label>Cidade</label>
                <input
                  type="text"
                  placeholder="São Paulo"
                  name="city"
                  value={paymentData.city}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={errors.city ? "error" : ""}
                />
                {errors.city && (
                  <span className="error-message">{errors.city}</span>
                )}
              </div>
              <div className="input-group">
                <label>Estado</label>
                <select
                  name="state"
                  value={paymentData.state}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={errors.state ? "error" : ""}
                >
                  <option value="">Selecione</option>
                  <option value="SP">SP</option>
                  <option value="RJ">RJ</option>
                  <option value="MG">MG</option>
                </select>
                {errors.state && (
                  <span className="error-message">{errors.state}</span>
                )}
              </div>
            </div>

            <div className="input-group">
              <label>CEP</label>
              <input
                type="text"
                placeholder="00000-000"
                name="cep"
                value={paymentData.cep}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors.cep ? "error" : ""}
                maxLength={9}
              />
              {errors.cep && (
                <span className="error-message">{errors.cep}</span>
              )}
            </div>
          </div>
        </section>

        <aside className="order-summary section-card">
          <h3>Resumo do Pedido</h3>

          <div className="service">
            <p className="service-title">
              <img
                src={orderData?.service?.icon || "/images/icone-limpeza.png"}
                alt="Ícone de limpeza"
                className="icone-limpeza"
                onError={(e) => {
                  e.currentTarget.src = `${
                    process.env.PUBLIC_URL || ""
                  }/images/icone-limpeza.png`;
                }}
              />
              Serviço de Limpeza
            </p>
            <p className="service-desc">Limpeza completa - 4 horas</p>

            <div className="provider">
              <img
                src={orderData?.provider?.avatar}
                alt={orderData?.provider?.name || "Profissional"}
                onError={(e) => {
                  e.currentTarget.src = `${process.env.PUBLIC_URL}/images/images.jpg`;
                }}
              />
              <div>
                <p className="provider-name">{orderData?.provider?.name}</p>
                <span className="provider-rating">
                  ⭐ {orderData?.provider?.rating} (
                  {orderData?.provider?.reviewCount} avaliações)
                </span>
              </div>
            </div>
          </div>

          <div className="totals">
            <div>
              <span>Subtotal</span>
              <span>
                {orderData.currency === "BRL"
                  ? `R$ ${orderData?.service?.price
                      ?.toFixed(2)
                      .replace(".", ",")}`
                  : orderData?.service?.price}
              </span>
            </div>
            <div>
              <span>Taxa de serviço</span>
              <span>
                {orderData.currency === "BRL"
                  ? `R$ ${orderData?.fees?.service
                      ?.toFixed(2)
                      .replace(".", ",")}`
                  : orderData?.fees?.service}
              </span>
            </div>
            <div className="total">
              <strong>Total</strong>
              <strong>
                {orderData.currency === "BRL"
                  ? `R$ ${calculateTotal().toFixed(2).replace(".", ",")}`
                  : calculateTotal()}
              </strong>
            </div>
          </div>

          <div className="ssl-note">
            <i className="fas fa-lock"></i> Seus dados estão protegidos com
            criptografia SSL
          </div>

          <ButtonLoading
            className="btn-confirm green"
            onClick={handlePayment}
            loading={loading}
            disabled={loading}
          >
            Confirmar Pagamento
          </ButtonLoading>
          <p className="terms-note">
            Ao confirmar, você concorda com nossos{" "}
            <a href="/" onClick={(e) => e.preventDefault()}>
              Termos de Serviço
            </a>
          </p>
        </aside>
      </div>
    </div>
  );
};

export default Payments;
