import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, Copy, Check, RotateCcw, Heart } from 'lucide-react';
import { formatCurrency } from '../utils/whatsapp';

export default function OrderSuccessModal({ orderData, onClose, onNewOrder }) {
  if (!orderData) return null;

  const [copiedText, setCopiedText] = useState(false);

  // Trigger celebration confetti
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D86B88', '#F3C5D0', '#E28E9E', '#FFDFE7', '#5E2B39'],
      });
    } catch (e) {
      console.log('Confetti failed to run', e);
    }
  }, []);

  const handleCopyText = () => {
    navigator.clipboard.writeText(orderData.messageText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 text-center space-y-5 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Celebration Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div>
          <span className="bg-[#FFEBF0] text-[#9B2C4B] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Pedido #{orderData.orderId}
          </span>
          <h2 className="font-serif font-bold text-2xl text-[#3B2228] mt-2">
            Pedido Enviado com Sucesso!
          </h2>
          <p className="text-xs sm:text-sm text-[#755960] mt-1.5 leading-relaxed">
            Seu pedido foi formatado e direcionado para o WhatsApp da <strong className="text-[#3B2228]">Calu Delícias Doces</strong>.
          </p>
        </div>

        {/* Quick Tips Box */}
        <div className="bg-[#FFF9FA] border border-[#FBE3E8] p-3.5 rounded-2xl text-left text-xs space-y-2 text-[#6F4E56]">
          <div className="flex items-center gap-1.5 font-bold text-[#3B2228]">
            <Heart className="w-4 h-4 text-[#D86B88] fill-[#D86B88]" />
            <span>O que acontece agora?</span>
          </div>
          <p>
            1. Verifique a conversa aberta no seu WhatsApp e clique em <strong>Enviar</strong> caso a mensagem não tenha disparado automaticamente.
          </p>
          <p>
            2. Se o pagamento for via <strong>PIX</strong>, anexe o comprovante na mesma conversa.
          </p>
          <p>
            3. A loja responderá com a confirmação do horário de retirada ou envio!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {/* Reopen WhatsApp Button */}
          <button
            onClick={() => {
              const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
              if (isMobile && orderData.whatsappAppUrl) {
                window.location.href = orderData.whatsappAppUrl;
              } else {
                window.open(orderData.whatsappUrl, '_blank');
              }
            }}
            className="w-full bg-[#1E8E3E] hover:bg-[#167232] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Reabrir Conversa no WhatsApp</span>
          </button>

          {/* Copy Message Button */}
          <button
            onClick={handleCopyText}
            className="w-full bg-white hover:bg-gray-50 text-[#5E484E] border border-[#E8D1D7] py-2.5 px-4 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Mensagem Copiada!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar texto do pedido para a área de transferência</span>
              </>
            )}
          </button>

          {/* New Order Button */}
          <button
            onClick={onNewOrder}
            className="w-full text-xs text-[#87656E] hover:text-[#3B2228] font-bold py-2 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Fazer outro pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
}
