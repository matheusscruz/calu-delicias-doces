import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Check, 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Store, 
  RotateCcw, 
  Save, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { formatCurrency } from '../utils/whatsapp';

export default function AdminModal({
  isOpen,
  onClose,
  storeConfig,
  setStoreConfig,
  products,
  setProducts,
  onResetDefaults
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('status'); // 'status', 'products', 'new_product'
  const [saveFeedback, setSaveFeedback] = useState(false);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('bolos-de-pote');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('Especial');

  const triggerSaved = () => {
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  // Toggle product availability
  const toggleProductAvailability = (productId) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p)
    );
    triggerSaved();
  };

  // Delete product
  const deleteProduct = (productId) => {
    if (confirm('Tem certeza que deseja excluir este item do cardápio?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      triggerSaved();
    }
  };

  // Handle create new product
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const newProd = {
      id: `custom-${Date.now()}`,
      name: newProdName,
      category: newProdCategory,
      price: parseFloat(newProdPrice.replace(',', '.')),
      description: newProdDesc || 'Feito artesanalmente com ingredientes selecionados.',
      image: newProdImage || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
      badge: newProdBadge,
      isAvailable: true,
      customizations: [
        {
          id: 'opcao_sabor',
          title: 'Escolha a Opção / Sabor',
          required: true,
          type: 'radio',
          options: [
            { name: 'Opção Tradicional', priceModifier: 0 },
            { name: 'Opção Especial', priceModifier: 2.00 }
          ]
        }
      ]
    };

    setProducts(prev => [newProd, ...prev]);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    setNewProdImage('');
    setActiveTab('products');
    triggerSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#F7E1E6] bg-[#FFF9FA] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FBE3E8] text-[#C24869]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#3B2228]">Gestão Rápida da Loja</h2>
              <p className="text-xs text-[#87656E]">Controle de produtos, status e dados de pagamento</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveFeedback && (
              <span className="text-xs text-emerald-700 bg-emerald-100 font-bold px-2 py-1 rounded-lg animate-pulse flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Salvo
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-[#FBE3E8] text-[#755960] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#F5E2E6] px-4 gap-2 bg-[#FFFDFE] shrink-0 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'status'
                ? 'border-[#D86B88] text-[#C24869]'
                : 'border-transparent text-[#755960] hover:text-[#3B2228]'
            }`}
          >
            Status & Pagamento
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#D86B88] text-[#C24869]'
                : 'border-transparent text-[#755960] hover:text-[#3B2228]'
            }`}
          >
            Produtos ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('new_product')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'new_product'
                ? 'border-[#D86B88] text-[#C24869]'
                : 'border-transparent text-[#755960] hover:text-[#3B2228]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Doce</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs sm:text-sm space-y-4">
          {/* Tab 1: Status & Settings */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Store Status Toggle */}
              <div className="p-4 rounded-2xl border border-[#F3DEE3] bg-[#FFF9FA] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#3B2228] text-sm sm:text-base">
                    Status da Loja: {storeConfig.isOpen ? 'Aceitando Pedidos' : 'Fechada Temporariamente'}
                  </h4>
                  <p className="text-xs text-[#755960] mt-0.5">
                    Desative quando os doces acabarem ou fora do horário de atendimento.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStoreConfig(prev => ({ ...prev, isOpen: !prev.isOpen }));
                    triggerSaved();
                  }}
                  className="cursor-pointer"
                >
                  {storeConfig.isOpen ? (
                    <ToggleRight className="w-10 h-10 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Status Message */}
              <div>
                <label className="block text-xs font-bold text-[#4A3238] mb-1">
                  Mensagem do Banner Superior
                </label>
                <input
                  type="text"
                  value={storeConfig.statusMessage}
                  onChange={(e) => {
                    setStoreConfig(prev => ({ ...prev, statusMessage: e.target.value }));
                    triggerSaved();
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] text-xs"
                />
              </div>

              {/* WhatsApp & Pix Config */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A3238] mb-1">
                    Número WhatsApp Business (DDD + Número)
                  </label>
                  <input
                    type="text"
                    value={storeConfig.phone}
                    onChange={(e) => {
                      setStoreConfig(prev => ({ ...prev, phone: e.target.value }));
                      triggerSaved();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3238] mb-1">
                    Chave PIX
                  </label>
                  <input
                    type="text"
                    value={storeConfig.pixKey}
                    onChange={(e) => {
                      setStoreConfig(prev => ({ ...prev, pixKey: e.target.value }));
                      triggerSaved();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] text-xs"
                  />
                </div>
              </div>

              {/* Pickup location */}
              <div>
                <label className="block text-xs font-bold text-[#4A3238] mb-1">
                  Local / Bairro de Retirada
                </label>
                <input
                  type="text"
                  value={storeConfig.pickupLocation}
                  onChange={(e) => {
                    setStoreConfig(prev => ({ ...prev, pickupLocation: e.target.value }));
                    triggerSaved();
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] text-xs"
                />
              </div>

              {/* Restore Defaults */}
              <div className="pt-4 border-t border-[#F5E2E6] flex items-center justify-between">
                <span className="text-xs text-[#87656E]">
                  Precisa reiniciar as configurações para o modelo inicial?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Deseja resetar todos os produtos e configurações para o padrão original?')) {
                      onResetDefaults();
                      triggerSaved();
                    }
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Products List & Pause */}
          {activeTab === 'products' && (
            <div className="space-y-3">
              <p className="text-xs text-[#755960]">
                Pausa rápida: quando um doce esgotar no dia, basta desmarcar para que os clientes vejam como "Esgotado".
              </p>

              <div className="space-y-2">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border border-[#F3DEE3] bg-[#FFFDFE] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#F5E2E6]"
                      />
                      <div>
                        <h4 className="font-bold text-[#3B2228] text-xs sm:text-sm">{p.name}</h4>
                        <span className="text-xs font-semibold text-[#A83253]">
                          {formatCurrency(p.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleProductAvailability(p.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                          p.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {p.isAvailable ? 'Disponível' : 'Esgotado'}
                      </button>

                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Excluir produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: New Product */}
          {activeTab === 'new_product' && (
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#4A3238] mb-1">Nome do Doce *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pão de Mel Especial de Páscoa"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A3238] mb-1">Categoria</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] bg-white"
                  >
                    <option value="bolos-de-pote">Bolos de Pote</option>
                    <option value="paes-de-mel">Pães de Mel</option>
                    <option value="sazonais">Especiais & Sazonais</option>
                    <option value="combos">Kits & Presentes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3238] mb-1">Preço Base (R$) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 16,50"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3238] mb-1">Descrição</label>
                <textarea
                  rows={2}
                  placeholder="Descrição tentadora do doce..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A3238] mb-1">Selo / Destaque</label>
                  <input
                    type="text"
                    placeholder="Ex: Edição Páscoa, Novidade"
                    value={newProdBadge}
                    onChange={(e) => setNewProdBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3238] mb-1">URL da Imagem</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#D86B88] hover:bg-[#C24869] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Cadastrar Novo Doce no Cardápio
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
