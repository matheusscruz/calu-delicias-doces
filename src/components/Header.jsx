import React, { useRef } from 'react';
import { ShoppingBag, Sparkles, Settings2, ShieldCheck } from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function Header({ 
  storeConfig, 
  cartCount, 
  cartTotal, 
  onOpenCart, 
  onOpenAdmin,
  isMasterUnlocked,
  onSecretTrigger
}) {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  // Triple click detector on cupcake logo for secret master access
  const handleLogoClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onSecretTrigger();
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1200);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFF9FA]/95 backdrop-blur-md border-b border-[#F7E1E6] shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#D86B88] to-[#C24869] text-white py-1.5 px-3 text-xs text-center font-medium flex items-center justify-center gap-2 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#FFDFE7]" />
        <span>{storeConfig.statusMessage}</span>
        <span className="hidden sm:inline opacity-80">• Pedidos enviados direto para o WhatsApp</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand identity (With secret 3-tap trigger on logo) */}
        <div className="flex items-center gap-3">
          <div 
            onClick={handleLogoClick}
            className="relative group cursor-pointer select-none active:scale-95 transition-transform"
            title="Calu Delícias Doces"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#E6889F] via-[#D86B88] to-[#FCE6EC] p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <span className="text-2xl sm:text-3xl select-none" role="img" aria-label="Doce">🧁</span>
              </div>
            </div>
            {storeConfig.isOpen && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs" title="Loja Aberta" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#3B2228] tracking-tight">
                {storeConfig.name}
              </h1>
              {isMasterUnlocked && (
                <span className="bg-[#FFEBF0] text-[#9B2C4B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FCD5DE] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#D86B88]" />
                  <span>Master</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#87656E] font-medium flex items-center gap-1.5">
              <span>{storeConfig.tagline}</span>
            </p>
          </div>
        </div>

        {/* Actions (Instagram, Admin & Cart) */}
        <div className="flex items-center gap-2">
          {/* Instagram Button */}
          <a
            href={storeConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:px-3 sm:py-2 text-[#87656E] hover:text-[#C24869] hover:bg-[#FCECEF] rounded-full transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Siga nosso Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
            <span className="hidden md:inline">@{storeConfig.instagram}</span>
          </a>

          {/* Quick Admin Settings (Only visible when unlocked for the master user) */}
          {isMasterUnlocked && (
            <button
              onClick={onOpenAdmin}
              className="p-2 text-[#C24869] bg-[#FFF0F3] hover:bg-[#FBE3E8] border border-[#FCD5DE] rounded-full transition-all animate-in zoom-in-75 cursor-pointer shadow-2xs"
              title="Abrir painel de gestão Master"
              aria-label="Abrir painel de gestão"
            >
              <Settings2 className="w-4 h-4 animate-spin-slow" />
            </button>
          )}

          {/* Floating / Header Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-[#D86B88] hover:bg-[#C24869] text-white px-3.5 py-2 rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            aria-label="Abrir sacola de pedidos"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Sacola</span>
            {cartCount > 0 && (
              <span className="bg-white text-[#C24869] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
