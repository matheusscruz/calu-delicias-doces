import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Check, 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  RotateCcw, 
  Edit3,
  Image,
  Tag,
  Save,
  Sparkles,
  Lock,
  Calendar
} from 'lucide-react';
import { formatCurrency } from '../utils/whatsapp';
import { salvarProduto, excluirProduto, salvarConfiguracaoLoja } from '../services/supabase';
import ImageSelector from './ImageSelector';

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

  const [activeTab, setActiveTab] = useState('products'); // 'products', 'new_product', 'status'
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('sazonais');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('Especial de Natal');
  const [newProdIsSeasonal, setNewProdIsSeasonal] = useState(true);

  const triggerSaved = () => {
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  // Toggle product availability (Disponível / Esgotado)
  const toggleProductAvailability = async (productId) => {
    const updated = products.map(p => 
      p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p
    );
    setProducts(updated);
    const target = updated.find(p => p.id === productId);
    if (target) {
      await salvarProduto(target);
    }
    triggerSaved();
  };

  // Delete product
  const deleteProduct = async (productId) => {
    if (confirm('Tem certeza que deseja excluir este item do cardápio?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      await excluirProduto(productId);
      if (editingProduct?.id === productId) {
        setEditingProduct(null);
      }
      triggerSaved();
    }
  };

  // Save edited product
  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    );
    setProducts(updated);
    await salvarProduto(editingProduct);
    setEditingProduct(null);
    triggerSaved();
  };

  // Handle create new product (e.g. seasonal item)
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const newProd = {
      id: `doce-${Date.now()}`,
      name: newProdName.trim(),
      category: newProdCategory,
      price: parseFloat(newProdPrice.toString().replace(',', '.')),
      description: newProdDesc.trim() || 'Receita artesanal especial preparada com carinho.',
      image: newProdImage.trim() || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
      badge: newProdBadge.trim(),
      isAvailable: true,
      isSeasonal: newProdIsSeasonal,
      order: products.length + 1,
      customizations: [
        {
          id: 'opcao_sabor',
          title: 'Escolha o Sabor Principal',
          required: true,
          type: 'radio',
          options: [
            { name: 'Tradicional da Casa', priceModifier: 0 },
            { name: 'Ninho com Nutella', priceModifier: 2.00 }
          ]
        }
      ]
    };

    setProducts(prev => [newProd, ...prev]);
    await salvarProduto(newProd);

    // Reset form
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    setNewProdImage('');
    setNewProdBadge('Especial');
    setNewProdIsSeasonal(true);
    setActiveTab('products');
    triggerSaved();
  };

  // Save store config changes
  const handleConfigChange = async (key, value) => {
    const updated = { ...storeConfig, [key]: value };
    setStoreConfig(updated);
    await salvarConfiguracaoLoja(updated);
    triggerSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 border border-[#F5E2E6]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#F7E1E6] bg-gradient-to-r from-[#FFF9FA] to-[#FFF0F3] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FBE3E8] text-[#C24869]">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-serif font-bold text-base sm:text-lg text-[#3B2228]">
                  Painel da Calu
                </h2>
                <span className="bg-[#FFE6EC] text-[#9B2C4B] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Master
                </span>
              </div>
              <p className="text-xs text-[#87656E]">
                Edição de fotos, preços, nomes, avisos e fornadas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveFeedback && (
              <span className="text-xs text-emerald-700 bg-emerald-100 font-bold px-2.5 py-1 rounded-lg animate-pulse flex items-center gap-1 shadow-2xs">
                <Check className="w-3.5 h-3.5" /> Salvo na nuvem!
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
            onClick={() => { setActiveTab('products'); setEditingProduct(null); }}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#D86B88] text-[#C24869]'
                : 'border-transparent text-[#755960] hover:text-[#3B2228]'
            }`}
          >
            Doces ({products.length})
          </button>
          <button
            onClick={() => { setActiveTab('new_product'); setEditingProduct(null); }}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'new_product'
                ? 'border-[#D86B88] text-[#C24869]'
                : 'border-transparent text-[#755960] hover:text-[#3B2228]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Doce / Sazonal</span>
          </button>
          <button
            onClick={() => { setActiveTab('status'); setEditingProduct(null); }}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'status'
                ? 'border-[#D86B88] text-[#C24869]'
                : 'border-transparent text-[#755960] hover:text-[#3B2228]'
            }`}
          >
            Avisos & Status
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs sm:text-sm space-y-4">
          
          {/* TAB 1: PRODUCT LIST & INLINE EDITING */}
          {activeTab === 'products' && (
            <div className="space-y-3">
              {editingProduct ? (
                /* EDIT FORM */
                <form onSubmit={handleSaveEditProduct} className="p-4 rounded-2xl border-2 border-[#D86B88] bg-[#FFF9FA] space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F7E1E6]">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-[#3B2228] flex items-center gap-1.5">
                      <Edit3 className="w-4 h-4 text-[#D86B88]" />
                      <span>Editando: {editingProduct.name}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-xs text-gray-500 hover:text-gray-800 font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3238] mb-1">Nome do Doce *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3238] mb-1">Preço em R$ *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] bg-white text-xs font-bold text-[#A83253]"
                      />
                    </div>
                  </div>

                  <ImageSelector
                    label="Foto do Doce"
                    value={editingProduct.image}
                    onChange={(url) => setEditingProduct({ ...editingProduct, image: url })}
                  />

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3238] mb-1">Descrição</label>
                    <textarea
                      rows={2}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] bg-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3238] mb-1">Selo / Destaque</label>
                      <input
                        type="text"
                        placeholder="Ex: Mais Pedido, Especial"
                        value={editingProduct.badge || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3238] mb-1">Categoria</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] bg-white text-xs"
                      >
                        <option value="bolos-de-pote">Bolos de Pote</option>
                        <option value="paes-de-mel">Pães de Mel</option>
                        <option value="sazonais">Especiais da Semana</option>
                        <option value="combos">Kits & Presentes</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#4A3238]">
                      <input
                        type="checkbox"
                        checked={!!editingProduct.isSeasonal}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isSeasonal: e.target.checked })}
                        className="rounded text-[#D86B88] focus:ring-[#D86B88]"
                      />
                      <span>Item Sazonal / Especial temporário</span>
                    </label>

                    <button
                      type="submit"
                      className="bg-[#D86B88] hover:bg-[#C24869] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Salvar Alterações</span>
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-xs text-[#755960]">
                    💡 Toque em <strong>Editar</strong> para mudar preços e fotos, ou clique no botão verde/vermelho para marcar como <strong>Esgotado</strong> instantaneamente.
                  </p>

                  <div className="space-y-2">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-2xl border border-[#F3DEE3] bg-[#FFFDFE] flex items-center justify-between gap-3 shadow-2xs hover:border-[#E8B4C0] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#F5E2E6] shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-[#3B2228] text-xs sm:text-sm truncate">
                                {p.name}
                              </h4>
                              {p.badge && (
                                <span className="text-[10px] bg-[#FFF0F3] text-[#A83253] font-bold px-1.5 py-0.2 rounded border border-[#FCD5DE]">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-extrabold text-[#A83253]">
                              {formatCurrency(p.price)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Edit Button */}
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-2 text-[#755960] hover:text-[#C24869] hover:bg-[#FBE3E8] rounded-xl transition-colors cursor-pointer"
                            title="Editar preço, foto ou texto"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Availability Toggle */}
                          <button
                            onClick={() => toggleProductAvailability(p.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                              p.isAvailable
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            {p.isAvailable ? 'Disponível' : 'Esgotado'}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-2 text-gray-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                            title="Excluir produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: CREATE NEW / SEASONAL PRODUCT */}
          {activeTab === 'new_product' && (
            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div className="bg-[#FFF9FA] border border-[#FBE3E8] p-3 rounded-xl flex items-center gap-2 text-xs text-[#87656E]">
                <Calendar className="w-4 h-4 text-[#D86B88] shrink-0" />
                <span>
                  Cadastre fornadas especiais, itens sazonais (Páscoa, Natal, Dia das Mães) ou novidades do cardápio.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3238] mb-1">Nome do Doce *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Panetone Trufado de Pote ou Ovo de Colher"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A3238] mb-1">Categoria *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] bg-white text-xs"
                  >
                    <option value="sazonais">⭐ Especiais da Semana</option>
                    <option value="bolos-de-pote">🧁 Bolos de Pote</option>
                    <option value="paes-de-mel">🍯 Pães de Mel</option>
                    <option value="combos">🎁 Kits & Presentes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3238] mb-1">Preço Base (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 18.00"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] text-xs font-bold text-[#A83253]"
                  />
                </div>
              </div>

              <ImageSelector
                label="Foto do Doce"
                value={newProdImage}
                onChange={setNewProdImage}
              />

              <div>
                <label className="block text-xs font-bold text-[#4A3238] mb-1">Descrição</label>
                <textarea
                  rows={2}
                  placeholder="Descrição tentadora do doce..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A3238] mb-1">Selo / Destaque</label>
                  <input
                    type="text"
                    placeholder="Ex: Edição de Natal, Páscoa"
                    value={newProdBadge}
                    onChange={(e) => setNewProdBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] text-xs"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#4A3238]">
                    <input
                      type="checkbox"
                      checked={newProdIsSeasonal}
                      onChange={(e) => setNewProdIsSeasonal(e.target.checked)}
                      className="rounded text-[#D86B88] focus:ring-[#D86B88]"
                    />
                    <span>Marcar como Sazonal</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#D86B88] hover:bg-[#C24869] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar ao Cardápio</span>
              </button>
            </form>
          )}

          {/* TAB 3: STORE STATUS & NOTICES */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Store Open/Close Toggle */}
              <div className="p-4 rounded-2xl border border-[#F3DEE3] bg-[#FFF9FA] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#3B2228] text-sm sm:text-base">
                    Status da Loja: {storeConfig.isOpen ? 'Aceitando Pedidos' : 'Fechada Temporariamente'}
                  </h4>
                  <p className="text-xs text-[#755960] mt-0.5">
                    Desative quando os doces da fornada acabarem.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleConfigChange('isOpen', !storeConfig.isOpen)}
                  className="cursor-pointer"
                >
                  {storeConfig.isOpen ? (
                    <ToggleRight className="w-10 h-10 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Status Message (Top Banner) */}
              <div>
                <label className="block text-xs font-bold text-[#4A3238] mb-1">
                  Aviso no Banner Superior (Rosa)
                </label>
                <input
                  type="text"
                  value={storeConfig.statusMessage}
                  onChange={(e) => handleConfigChange('statusMessage', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] text-xs"
                />
              </div>

              {/* Admin PIN update */}
              <div>
                <label className="block text-xs font-bold text-[#4A3238] mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#D86B88]" />
                  <span>PIN de Acesso Master (4 dígitos)</span>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={storeConfig.adminPin || '2026'}
                  onChange={(e) => handleConfigChange('adminPin', e.target.value)}
                  className="w-32 px-3 py-2 rounded-xl border border-[#EDD3D9] text-xs font-mono font-bold tracking-widest text-center"
                />
              </div>

              {/* Contact and Pix Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#4A3238] mb-1">
                    WhatsApp da Loja
                  </label>
                  <input
                    type="text"
                    value={storeConfig.phone}
                    onChange={(e) => handleConfigChange('phone', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3238] mb-1">
                    Chave PIX
                  </label>
                  <input
                    type="text"
                    value={storeConfig.pixKey}
                    onChange={(e) => handleConfigChange('pixKey', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDD3D9] text-xs font-mono"
                  />
                </div>
              </div>

              {/* Restore Defaults */}
              <div className="pt-4 border-t border-[#F5E2E6] flex items-center justify-between">
                <span className="text-xs text-[#87656E]">
                  Restaurar dados originais de fábrica?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Deseja resetar configurações para o padrão original?')) {
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

        </div>
      </div>
    </div>
  );
}
