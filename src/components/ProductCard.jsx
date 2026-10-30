import React from 'react';
import { Plus, SlidersHorizontal, Sparkles, Check } from 'lucide-react';
import { formatCurrency } from '../utils/whatsapp';

export default function ProductCard({ product, onSelectProduct, isStoreOpen }) {
  const hasCustomizations = product.customizations && product.customizations.length > 0;

  return (
    <div className={`bg-white rounded-2xl overflow-hidden border border-[#F3DEE3] hover:border-[#E8B4C0] transition-all duration-200 hover:shadow-md flex flex-col justify-between group ${
      !product.isAvailable ? 'opacity-60 bg-gray-50' : ''
    }`}>
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FBEFF2]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 bg-[#FFF9FA]/90 backdrop-blur-xs text-[#9B2C4B] font-bold text-[11px] px-2.5 py-1 rounded-full shadow-xs border border-[#F7D8DF] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D86B88]" />
            <span>{product.badge}</span>
          </div>
        )}

        {/* Availability overlay */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 text-center">
            <span className="bg-white/95 text-[#63202E] font-bold text-xs px-3 py-1.5 rounded-full shadow-md">
              Esgotado nesta fornada
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif font-bold text-[#3B2228] text-base sm:text-lg leading-tight group-hover:text-[#C24869] transition-colors">
            {product.name}
          </h3>
          <p className="text-[#755960] text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Customization Hints (e.g., Massas e Recheios) */}
          {hasCustomizations && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1 text-[11px] text-[#A25A6C] bg-[#FFF5F7] px-2 py-1 rounded-lg border border-[#FDE5EB]">
              <SlidersHorizontal className="w-3 h-3 text-[#D86B88] shrink-0" />
              <span>Personalize massa & recheio</span>
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-[#F8E8EC] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#8C6D75] block uppercase tracking-wider font-semibold">
              A partir de
            </span>
            <span className="text-base sm:text-lg font-bold text-[#A83253]">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            onClick={() => onSelectProduct(product)}
            disabled={!product.isAvailable || !isStoreOpen}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs ${
              !product.isAvailable || !isStoreOpen
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#FBE9ED] text-[#A83253] hover:bg-[#D86B88] hover:text-white'
            }`}
          >
            {hasCustomizations ? (
              <>
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Montar</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
