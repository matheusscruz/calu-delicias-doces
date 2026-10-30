import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/whatsapp';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) {
  if (!isOpen) return null;

  const totalCart = cart.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full sm:max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#F7E1E6] flex items-center justify-between bg-[#FFF9FA]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FBE3E8] text-[#C24869]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#3B2228]">Sua Sacola</h2>
              <p className="text-xs text-[#87656E]">
                {totalItemsCount} {totalItemsCount === 1 ? 'doce selecionado' : 'doces selecionados'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#FBE3E8] text-[#755960] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar sacola"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#9A7D84]">
              <div className="w-16 h-16 rounded-full bg-[#FFF0F3] flex items-center justify-center text-3xl mb-3">
                🧁
              </div>
              <h3 className="font-serif font-bold text-lg text-[#3B2228]">Sua sacola está vazia</h3>
              <p className="text-xs sm:text-sm mt-1 max-w-xs">
                Escolha seus bolos de pote, pães de mel ou doces favoritos para montar seu pedido!
              </p>
            </div>
          ) : (
            cart.map((item, index) => {
              const itemTotal = item.totalPrice * item.quantity;

              return (
                <div
                  key={`${item.productId}-${index}`}
                  className="p-3 rounded-2xl border border-[#F3DEE3] bg-[#FFFDFE] flex flex-col gap-2 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#F7E1E6] shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-[#3B2228] text-sm leading-snug">
                          {item.name}
                        </h4>
                        <span className="text-xs font-bold text-[#A83253]">
                          {formatCurrency(item.totalPrice)} cada
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-gray-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Remover item"
                      aria-label="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Selected options breakdown */}
                  {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                    <div className="bg-[#FFF5F7] rounded-xl p-2 text-[11px] space-y-1 text-[#6F4E56] border border-[#FCE6EC]">
                      {Object.entries(item.selectedOptions).map(([title, choice]) => {
                        if (!choice || (Array.isArray(choice) && choice.length === 0)) return null;
                        return (
                          <div key={title} className="flex items-start gap-1">
                            <span className="font-semibold text-[#3B2228]">{title}:</span>
                            <span>{Array.isArray(choice) ? choice.join(', ') : choice}</span>
                          </div>
                        );
                      })}
                      {item.notes && (
                        <div className="text-[#99475E] italic pt-0.5 border-t border-[#FCD5DE]">
                          Obs: "{item.notes}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#F7E6EA]">
                    <div className="flex items-center bg-white border border-[#EAC5CE] rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-[#755960] hover:bg-[#FFF0F3] transition-colors cursor-pointer"
                        aria-label="Reduzir quantidade"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-[#3B2228]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-[#755960] hover:bg-[#FFF0F3] transition-colors cursor-pointer"
                        aria-label="Adicionar mais um"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-[#3B2228]">
                      {formatCurrency(itemTotal)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-[#F7E1E6] bg-[#FFF9FA] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#755960] font-medium">Subtotal dos doces</span>
              <span className="font-bold text-lg text-[#3B2228]">
                {formatCurrency(totalCart)}
              </span>
            </div>

            <p className="text-[11px] text-[#8C6D75] text-center">
              Ao avançar, você informará os dados de entrega/retirada e a forma de pagamento.
            </p>

            <button
              onClick={onProceedToCheckout}
              className="w-full bg-[#D86B88] hover:bg-[#C24869] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Avançar para Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
