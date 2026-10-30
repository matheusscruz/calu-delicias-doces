import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import StoreInfo from './components/StoreInfo';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import AdminModal from './components/AdminModal';

import { initialStoreConfig, initialCategories, initialProducts } from './data/initialData';
import { formatCurrency } from './utils/whatsapp';
import { ShoppingBag, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { InstagramIcon } from './components/Icons';

const STORAGE_KEYS = {
  STORE_CONFIG: 'calu_store_config_v1',
  PRODUCTS: 'calu_products_v1',
  CART: 'calu_cart_v1',
};

export default function App() {
  // Store Config state with localStorage persistence
  const [storeConfig, setStoreConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STORE_CONFIG);
      return saved ? JSON.parse(saved) : initialStoreConfig;
    } catch {
      return initialStoreConfig;
    }
  });

  // Products state with localStorage persistence
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & Modal states
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [customizingProduct, setCustomizingProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORE_CONFIG, JSON.stringify(storeConfig));
  }, [storeConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'todos') {
      return products;
    }
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  // Cart totals
  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // Cart handlers
  const handleAddToCart = (item) => {
    setCart(prev => [...prev, item]);
  };

  const handleUpdateCartQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCart(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: newQuantity };
      return updated;
    });
  };

  const handleRemoveCartItem = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleResetDefaults = () => {
    setStoreConfig(initialStoreConfig);
    setProducts(initialProducts);
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.STORE_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CART);
  };

  const handleOrderCompleted = (orderData) => {
    setCompletedOrder(orderData);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCart([]); // Clear cart after order is successfully sent
  };

  return (
    <div className="min-h-screen bg-[#FFF9FA] text-[#2D2424] flex flex-col font-sans">
      {/* Header */}
      <Header
        storeConfig={storeConfig}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 sm:pb-16">
        {/* Store Info Banner */}
        <StoreInfo storeConfig={storeConfig} />

        {/* Categories Bar */}
        <CategoryNav
          categories={initialCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          products={products}
        />

        {/* Product Grid */}
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#3B2228]">
              {initialCategories.find(c => c.id === selectedCategory)?.name || 'Doces Selecionados'}
            </h2>
            <span className="text-xs text-[#87656E] font-medium">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item disponível' : 'itens disponíveis'}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#F3DEE3] p-8">
              <span className="text-4xl">🍯</span>
              <h3 className="font-serif font-bold text-lg text-[#3B2228] mt-2">
                Nenhum doce nesta categoria no momento
              </h3>
              <p className="text-xs text-[#755960] mt-1">
                Fique de olho em nossas fornadas ou escolha outra categoria acima!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isStoreOpen={storeConfig.isOpen}
                  onSelectProduct={(p) => setCustomizingProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Cart Bar (Mobile-first Anota.ai style) */}
      {cartCount > 0 && !isCartOpen && !isCheckoutOpen && !customizingProduct && (
        <div className="fixed bottom-3 left-0 right-0 z-40 px-4 max-w-md mx-auto animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#D86B88] hover:bg-[#C24869] text-white p-3.5 rounded-2xl shadow-xl shadow-[#D86B88]/30 flex items-center justify-between font-bold text-sm transition-all active:scale-98 cursor-pointer border border-[#FFD0DC]"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-white/25 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black">
                {cartCount}
              </div>
              <span>Ver Minha Sacola</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold">{formatCurrency(cartTotal)}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#F5E2E6] py-8 text-center text-xs text-[#87656E]">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🧁</span>
            <span className="font-serif font-bold text-base text-[#3B2228]">
              {storeConfig.name}
            </span>
          </div>

          <p className="max-w-md mx-auto text-[11px] leading-relaxed">
            Cardápio digital artesanal desenvolvido para aprimorar o atendimento da confeitaria, com recebimento direto e seguro no WhatsApp.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            <a
              href={storeConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-[#A83253] hover:underline"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Instagram @{storeConfig.instagram}</span>
            </a>
          </div>

          <p className="text-[10px] text-[#A68890] pt-2 flex items-center justify-center gap-1">
            Feito com <Heart className="w-3 h-3 text-[#D86B88] fill-[#D86B88]" /> para Calu Delícias Doces
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductModal
        product={customizingProduct}
        onClose={() => setCustomizingProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onBackToCart={() => {
          setIsCheckoutOpen(false);
          setIsCartOpen(true);
        }}
        cart={cart}
        storeConfig={storeConfig}
        onOrderCompleted={handleOrderCompleted}
      />

      <OrderSuccessModal
        orderData={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onNewOrder={() => setCompletedOrder(null)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        storeConfig={storeConfig}
        setStoreConfig={setStoreConfig}
        products={products}
        setProducts={setProducts}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
