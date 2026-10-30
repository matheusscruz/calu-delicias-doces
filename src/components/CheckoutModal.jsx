import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Copy, 
  Check, 
  AlertCircle, 
  Send, 
  ArrowLeft,
  Bike
} from 'lucide-react';
import { formatCurrency, generateOrderId, buildWhatsAppUrl, openWhatsApp } from '../utils/whatsapp';

export default function CheckoutModal({
  isOpen,
  onClose,
  onBackToCart,
  cart,
  storeConfig,
  onOrderCompleted
}) {
  if (!isOpen) return null;

  const totalCart = cart.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState('retirada'); // 'retirada' or 'uber_flash'
  
  // Delivery address fields (for Uber Flash)
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [reference, setReference] = useState('');

  // Payment fields
  const [paymentMethod, setPaymentMethod] = useState('pix'); // 'pix', 'dinheiro', 'cartao_credito', 'cartao_debito'
  const [needsChange, setNeedsChange] = useState(false);
  const [changeFor, setChangeFor] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);

  // General notes
  const [generalNotes, setGeneralNotes] = useState('');

  // Validation errors
  const [error, setError] = useState('');

  // Copy PIX key to clipboard
  const handleCopyPix = () => {
    navigator.clipboard.writeText(storeConfig.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  // Submit order to WhatsApp
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!customerName.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setError('Por favor, informe um WhatsApp válido com DDD (ex: 21 99999-9999).');
      return;
    }

    if (deliveryType === 'uber_flash') {
      if (!neighborhood.trim() || !street.trim() || !number.trim()) {
        setError('Para envio via Uber Flash, por favor preencha o endereço (Bairro, Rua e Número).');
        return;
      }
    }

    if (paymentMethod === 'dinheiro' && needsChange) {
      const changeVal = parseFloat(changeFor.replace(',', '.'));
      if (isNaN(changeVal) || changeVal <= totalCart) {
        setError(`O valor para troco deve ser maior que o total da compra (${formatCurrency(totalCart)}).`);
        return;
      }
    }

    const orderId = generateOrderId();

    const orderData = {
      orderId,
      cart,
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        generalNotes: generalNotes.trim(),
      },
      delivery: {
        type: deliveryType,
        street: street.trim(),
        number: number.trim(),
        neighborhood: neighborhood.trim(),
        complement: complement.trim(),
        reference: reference.trim(),
      },
      payment: {
        method: paymentMethod,
        needsChange,
        changeFor: needsChange ? parseFloat(changeFor.replace(',', '.')) : 0,
        total: totalCart,
      },
      storeConfig,
    };

    const { url, appUrl, fullText } = buildWhatsAppUrl(orderData);

    // Save last order info and trigger completion
    onOrderCompleted({
      ...orderData,
      whatsappUrl: url,
      whatsappAppUrl: appUrl,
      messageText: fullText,
    });

    // Open WhatsApp
    openWhatsApp({ url, appUrl });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full sm:max-w-xl max-h-[94vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#F7E1E6] flex items-center justify-between bg-[#FFF9FA] shrink-0">
          <button
            onClick={onBackToCart}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#87656E] hover:text-[#3B2228] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para sacola</span>
          </button>

          <h2 className="font-serif font-bold text-base sm:text-lg text-[#3B2228]">
            Finalizar Pedido
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#FBE3E8] text-[#755960] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-center gap-2 text-xs sm:text-sm animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#3B2228] text-sm sm:text-base flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#FCE6EC] text-[#9B2C4B] font-extrabold text-xs flex items-center justify-center">1</span>
              Seus Dados
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A3238] mb-1">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Matheus Silva"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] focus:outline-hidden focus:ring-2 focus:ring-[#D86B88]/30 focus:border-[#D86B88]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3238] mb-1">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(21) 99999-9999"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] focus:outline-hidden focus:ring-2 focus:ring-[#D86B88]/30 focus:border-[#D86B88]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery / Pickup Method */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#3B2228] text-sm sm:text-base flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#FCE6EC] text-[#9B2C4B] font-extrabold text-xs flex items-center justify-center">2</span>
              Como deseja receber?
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('retirada')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                  deliveryType === 'retirada'
                    ? 'border-[#D86B88] bg-[#FFF0F3] text-[#3B2228] font-bold shadow-xs'
                    : 'border-[#F0DCE1] bg-white text-[#755960]'
                }`}
              >
                <MapPin className="w-5 h-5 text-[#C24869]" />
                <span className="text-xs">Retirada / Ponto de Entrega</span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.2 rounded">Grátis</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('uber_flash')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                  deliveryType === 'uber_flash'
                    ? 'border-[#D86B88] bg-[#FFF0F3] text-[#3B2228] font-bold shadow-xs'
                    : 'border-[#F0DCE1] bg-white text-[#755960]'
                }`}
              >
                <Bike className="w-5 h-5 text-[#C24869]" />
                <span className="text-xs">Envio via Uber Flash</span>
                <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-1.5 py-0.2 rounded">Taxa à parte</span>
              </button>
            </div>

            {deliveryType === 'retirada' && (
              <div className="bg-[#FFF9FA] border border-[#FBE3E8] p-3 rounded-xl text-xs text-[#6F4E56]">
                <p className="font-bold text-[#3B2228] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C24869]" /> Ponto de Entrega:
                </p>
                <p className="mt-1">
                  Entrega no local combinado com quem compartilhou o link ou retirada no ponto de atendimento.
                </p>
              </div>
            )}

            {deliveryType === 'uber_flash' && (
              <div className="bg-[#FFF9FA] border border-[#FBE3E8] p-3.5 rounded-xl space-y-2.5">
                <p className="text-xs text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  🛵 {storeConfig.deliveryNotice}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-semibold text-[#4A3238] mb-0.5">Bairro *</label>
                    <input
                      type="text"
                      placeholder="Ex: Tijuca, Maracanã, Vila Isabel"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#EDD3D9]"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-semibold text-[#4A3238] mb-0.5">Rua / Logradouro *</label>
                    <input
                      type="text"
                      placeholder="Nome da sua rua"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#EDD3D9]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#4A3238] mb-0.5">Número *</label>
                    <input
                      type="text"
                      placeholder="Ex: 120"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#EDD3D9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#4A3238] mb-0.5">Complemento</label>
                    <input
                      type="text"
                      placeholder="Apto 302, Bloco B"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#EDD3D9]"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-semibold text-[#4A3238] mb-0.5">Ponto de Referência</label>
                    <input
                      type="text"
                      placeholder="Próximo à praça..."
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#EDD3D9]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#3B2228] text-sm sm:text-base flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#FCE6EC] text-[#9B2C4B] font-extrabold text-xs flex items-center justify-center">3</span>
              Forma de Pagamento
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                    : 'border-[#F0DCE1] bg-white text-[#755960]'
                }`}
              >
                <QrCode className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">PIX</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('dinheiro')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                  paymentMethod === 'dinheiro'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs'
                    : 'border-[#F0DCE1] bg-white text-[#755960]'
                }`}
              >
                <Banknote className="w-5 h-5 text-amber-600" />
                <span className="text-xs">Dinheiro</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cartao_credito')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                  paymentMethod === 'cartao_credito'
                    ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-xs'
                    : 'border-[#F0DCE1] bg-white text-[#755960]'
                }`}
              >
                <CreditCard className="w-5 h-5 text-purple-600" />
                <span className="text-xs">Crédito</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cartao_debito')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                  paymentMethod === 'cartao_debito'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                    : 'border-[#F0DCE1] bg-white text-[#755960]'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-xs">Débito</span>
              </button>
            </div>

            {/* PIX instructions and Copy Key */}
            {paymentMethod === 'pix' && (
              <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl space-y-2 text-emerald-950">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Chave PIX da Calu:</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                    {storeConfig.pixKeyType}
                  </span>
                </div>
                
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-emerald-200">
                  <span className="font-mono font-bold text-xs sm:text-sm select-all">
                    {storeConfig.pixKey}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    {copiedPix ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Chave</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-emerald-800">
                  Favorecido: <strong className="font-semibold">{storeConfig.pixRecipient}</strong>. Ao enviar o pedido no WhatsApp, basta anexar o comprovante na mesma conversa!
                </p>
              </div>
            )}

            {/* Cash & Change Options */}
            {paymentMethod === 'dinheiro' && (
              <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-950">Precisa de troco?</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNeedsChange(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        !needsChange 
                          ? 'bg-amber-600 text-white shadow-2xs' 
                          : 'bg-white text-amber-800 border border-amber-200'
                      }`}
                    >
                      Não preciso (Valor exato)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNeedsChange(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        needsChange 
                          ? 'bg-amber-600 text-white shadow-2xs' 
                          : 'bg-white text-amber-800 border border-amber-200'
                      }`}
                    >
                      Sim, preciso de troco
                    </button>
                  </div>
                </div>

                {needsChange && (
                  <div className="pt-2 border-t border-amber-200/60">
                    <label className="block text-xs font-semibold text-amber-950 mb-1">
                      Troco para quanto em dinheiro? (Ex: 50 ou 100)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-bold text-gray-500">R$</span>
                      <input
                        type="number"
                        step="any"
                        placeholder="50,00"
                        value={changeFor}
                        onChange={(e) => setChangeFor(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Card info */}
            {(paymentMethod === 'cartao_credito' || paymentMethod === 'cartao_debito') && (
              <div className="bg-purple-50/70 border border-purple-200 p-3 rounded-xl text-xs text-purple-900">
                A maquininha de cartão estará disponível na retirada ou levada junto na entrega. Aceitamos as principais bandeiras (Visa, Mastercard, Elo, Hipercard).
              </div>
            )}
          </div>

          {/* General Notes */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#4A3238]">
              Observações gerais para o pedido (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ex: É para presente de aniversário, favor enviar bilhetinho com carinho..."
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#EDD3D9] focus:outline-hidden focus:ring-2 focus:ring-[#D86B88]/30"
            />
          </div>

          {/* Order Summary Box */}
          <div className="bg-[#FFF5F7] p-3.5 rounded-2xl border border-[#FBE3E8] space-y-1.5">
            <div className="flex justify-between text-xs text-[#755960]">
              <span>Quantidade de doces:</span>
              <span className="font-semibold">{cart.reduce((a, b) => a + b.quantity, 0)} itens</span>
            </div>
            <div className="flex justify-between text-xs text-[#755960]">
              <span>Forma de envio:</span>
              <span className="font-semibold">
                {deliveryType === 'retirada' ? '📍 Retirada / Ponto de Entrega' : '🛵 Uber Flash (Envio)'}
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-bold text-[#3B2228] pt-1.5 border-t border-[#F7D8DF]">
              <span>Total a pagar:</span>
              <span className="text-[#A83253] text-lg">{formatCurrency(totalCart)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#1E8E3E] hover:bg-[#167232] text-white py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Send className="w-4 h-4" />
            <span>Enviar Pedido para o WhatsApp da Calu</span>
          </button>
        </form>
      </div>
    </div>
  );
}
