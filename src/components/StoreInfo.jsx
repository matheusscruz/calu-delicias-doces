import React from 'react';
import { MapPin, Clock, CreditCard, MessageCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function StoreInfo({ storeConfig }) {
  return (
    <section className="max-w-4xl mx-auto px-4 pt-4 pb-2">
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#F5E2E6] shadow-xs">
        {/* Closed warning if store is toggled closed */}
        {!storeConfig.isOpen && (
          <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 flex items-start gap-3 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Loja temporariamente em pausa para novos pedidos</p>
              <p className="text-amber-800 mt-0.5">{storeConfig.closedMessage}</p>
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
          {/* Pickup & Delivery */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FFF9FA] border border-[#FBE9ED]">
            <div className="p-2 rounded-lg bg-[#FBE3E8] text-[#C24869] shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#3B2228]">Recebimento</p>
              <p className="text-[#755960] text-xs leading-relaxed mt-0.5">
                Retirada no ponto combinado ou envio via Uber Flash.
              </p>
            </div>
          </div>

          {/* Prep time / Availability */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FFF9FA] border border-[#FBE9ED]">
            <div className="p-2 rounded-lg bg-[#FBE3E8] text-[#C24869] shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#3B2228]">Disponibilidade</p>
              <p className="text-[#755960] text-xs leading-relaxed mt-0.5">
                Fornadas da semana sob encomenda ou pronta entrega.
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FFF9FA] border border-[#FBE9ED]">
            <div className="p-2 rounded-lg bg-[#FBE3E8] text-[#C24869] shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#3B2228]">Pagamentos</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <span className="bg-[#E7F6EC] text-[#1E7E34] text-[10px] font-bold px-1.5 py-0.5 rounded">PIX</span>
                <span className="bg-[#F2EFFE] text-[#553C9A] text-[10px] font-bold px-1.5 py-0.5 rounded">Cartão</span>
                <span className="bg-[#FFF4E5] text-[#B76E00] text-[10px] font-bold px-1.5 py-0.5 rounded">Dinheiro</span>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Direct Help link */}
        <div className="mt-3 pt-3 border-t border-[#F5E6E9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#87656E]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D86B88]" />
            Dúvidas ou encomendas personalizadas?
          </span>
          <a
            href={`https://wa.me/${storeConfig.phone}?text=${encodeURIComponent('Olá! Estava navegando no cardápio da Calu Delícias e gostaria de tirar uma dúvida.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-[#1E8E3E] hover:text-[#166E30] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Falar no WhatsApp ({storeConfig.displayPhone})
          </a>
        </div>
      </div>
    </section>
  );
}
