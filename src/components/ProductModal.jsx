import React, { useState, useMemo } from 'react';
import { X, Plus, Minus, Check, AlertCircle, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../utils/whatsapp';

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  // Initialize selected options
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initial = {};
    if (product.customizations) {
      product.customizations.forEach((group) => {
        if (group.type === 'radio') {
          // Preselect first option if required, or leave empty to force intentional choice
          initial[group.title] = group.options[0]?.name || '';
        } else if (group.type === 'checkbox') {
          initial[group.title] = [];
        }
      });
    }
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  // Calculate unit price dynamically based on base price + selected options modifiers
  const unitPrice = useMemo(() => {
    let total = product.price;

    if (product.customizations) {
      product.customizations.forEach((group) => {
        const choice = selectedOptions[group.title];

        if (group.type === 'radio' && choice) {
          const selectedOpt = group.options.find(opt => opt.name === choice);
          if (selectedOpt && selectedOpt.priceModifier) {
            total += selectedOpt.priceModifier;
          }
        } else if (group.type === 'checkbox' && Array.isArray(choice)) {
          choice.forEach(optName => {
            const selectedOpt = group.options.find(opt => opt.name === optName);
            if (selectedOpt && selectedOpt.priceModifier) {
              total += selectedOpt.priceModifier;
            }
          });
        }
      });
    }

    return total;
  }, [product, selectedOptions]);

  const totalPrice = unitPrice * quantity;

  // Handle single selection (radio)
  const handleRadioChange = (groupTitle, optionName) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupTitle]: optionName
    }));
    setValidationError('');
  };

  // Handle multi selection (checkbox)
  const handleCheckboxToggle = (groupTitle, optionName) => {
    setSelectedOptions(prev => {
      const currentList = prev[groupTitle] || [];
      const exists = currentList.includes(optionName);
      return {
        ...prev,
        [groupTitle]: exists 
          ? currentList.filter(item => item !== optionName)
          : [...currentList, optionName]
      };
    });
    setValidationError('');
  };

  // Submit and add to cart
  const handleAdd = () => {
    // Validate required groups
    if (product.customizations) {
      for (const group of product.customizations) {
        if (group.required) {
          const val = selectedOptions[group.title];
          if (!val || (Array.isArray(val) && val.length === 0)) {
            setValidationError(`Por favor, selecione: "${group.title}"`);
            return;
          }
        }
      }
    }

    onAddToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      basePrice: product.price,
      totalPrice: unitPrice, // unit price with modifiers
      quantity,
      selectedOptions,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full sm:max-w-lg h-[88vh] sm:h-auto sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-40 sm:h-48 w-full bg-[#FFF5F7] shrink-0 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/35" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer z-10"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h2 className="font-serif font-bold text-lg sm:text-xl leading-tight drop-shadow-md">
              {product.name}
            </h2>
            <p className="text-[11px] sm:text-xs text-pink-100 font-medium drop-shadow-xs line-clamp-1 mt-0.5">
              {product.description}
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 overscroll-contain">
          {/* Validation Alert */}
          {validationError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-center gap-2 text-xs sm:text-sm animate-pulse">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{validationError}</span>
            </div>
          )}

          {/* Customization Groups */}
          {product.customizations && product.customizations.map((group) => {
            const isRadio = group.type === 'radio';
            const selectedVal = selectedOptions[group.title];

            return (
              <div key={group.id || group.title} className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-[#F7E1E6]">
                  <div>
                    <h3 className="font-bold text-[#3B2228] text-sm sm:text-base">
                      {group.title}
                    </h3>
                    <p className="text-[11px] text-[#8C6D75]">
                      {isRadio ? 'Escolha 1 opção' : 'Escolha quantos desejar'}
                    </p>
                  </div>
                  {group.required ? (
                    <span className="bg-[#FFE6EC] text-[#9B2C4B] font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Obrigatório
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 font-semibold text-[10px] px-2 py-0.5 rounded-full">
                      Opcional
                    </span>
                  )}
                </div>

                {/* Option Cards */}
                <div className="grid grid-cols-1 gap-2">
                  {group.options.map((opt) => {
                    const isChecked = isRadio
                      ? selectedVal === opt.name
                      : Array.isArray(selectedVal) && selectedVal.includes(opt.name);

                    return (
                      <div
                        key={opt.name}
                        onClick={() =>
                          isRadio
                            ? handleRadioChange(group.title, opt.name)
                            : handleCheckboxToggle(group.title, opt.name)
                        }
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer select-none ${
                          isChecked
                            ? 'border-[#D86B88] bg-[#FFF2F5] shadow-xs'
                            : 'border-[#F0DCE1] hover:border-[#E5B5C1] bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-${isRadio ? 'full' : 'md'} border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'border-[#D86B88] bg-[#D86B88] text-white'
                                : 'border-[#CBB4BA] bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className={`text-xs sm:text-sm font-medium ${isChecked ? 'text-[#3B2228] font-bold' : 'text-[#5E484E]'}`}>
                            {opt.name}
                          </span>
                        </div>

                        {opt.priceModifier > 0 && (
                          <span className="text-xs font-bold text-[#A83253] bg-[#FFEBF0] px-2 py-0.5 rounded-full">
                            +{formatCurrency(opt.priceModifier)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special item instructions */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold text-[#3B2228]">
              Alguma observação para este item?
            </label>
            <input
              type="text"
              placeholder="Ex: Sem granulado no topo, com colherzinha, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#EDD3D9] focus:outline-hidden focus:ring-2 focus:ring-[#D86B88]/30 focus:border-[#D86B88] transition-all"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FFF9FA] border-t border-[#F5E2E6] flex items-center justify-between gap-3 shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center bg-white border border-[#EDD3D9] rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#755960] hover:bg-[#FFF0F3] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-[#3B2228]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#755960] hover:bg-[#FFF0F3] transition-colors cursor-pointer"
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAdd}
            className="flex-1 bg-[#D86B88] hover:bg-[#C24869] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-between cursor-pointer active:scale-98"
          >
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              Adicionar à Sacola
            </span>
            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-extrabold tracking-wide">
              {formatCurrency(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
