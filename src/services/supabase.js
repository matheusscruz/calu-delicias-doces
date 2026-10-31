import { initialStoreConfig, initialCategories, initialProducts } from '../data/initialData';
import { compressImage } from '../utils/imageUpload';

const SUPABASE_BASE_URL = (import.meta.env.VITE_SUPABASE_URL || 'https://zfxyqzwwwacurfntkghw.supabase.co').replace(/\/rest\/v1\/?$/, '');
const REST_URL = `${SUPABASE_BASE_URL}/rest/v1`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
  Prefer: 'return=representation',
});

/**
 * Verifica se a chave do Supabase foi configurada
 */
export const isSupabaseConfigured = () => Boolean(ANON_KEY && ANON_KEY.trim() !== '');

/**
 * 1. Busca as configurações da loja
 */
export async function carregarConfiguracaoLoja() {
  if (!isSupabaseConfigured()) {
    return initialStoreConfig;
  }

  try {
    const res = await fetch(`${REST_URL}/configuracao_loja?id=eq.1&select=*`, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      console.warn('Fallback para config local:', res.statusText);
      return initialStoreConfig;
    }

    const rows = await res.json();
    if (!rows || rows.length === 0) return initialStoreConfig;

    const data = rows[0];
    return {
      name: data.nome,
      tagline: data.slogan,
      instagram: data.instagram,
      instagramUrl: data.instagram_url,
      phone: data.telefone,
      displayPhone: data.telefone_exibicao,
      pixKey: data.chave_pix,
      pixKeyType: data.tipo_chave_pix,
      pixRecipient: data.titular_pix,
      isOpen: data.esta_aberta,
      statusMessage: data.mensagem_status,
      closedMessage: data.mensagem_fechada,
      pickupLocation: data.local_retirada,
      deliveryNotice: data.aviso_entrega,
      prepTime: data.tempo_preparo,
      adminPin: data.pin_administrador || '2026',
    };
  } catch (err) {
    console.error('Erro ao buscar configuração no Supabase:', err);
    return initialStoreConfig;
  }
}

/**
 * 2. Atualiza as configurações da loja
 */
export async function salvarConfiguracaoLoja(config) {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const payload = {
      id: 1,
      nome: config.name,
      slogan: config.tagline,
      instagram: config.instagram,
      instagram_url: config.instagramUrl,
      telefone: config.phone,
      telefone_exibicao: config.displayPhone,
      chave_pix: config.pixKey,
      tipo_chave_pix: config.pixKeyType,
      titular_pix: config.pixRecipient,
      esta_aberta: config.isOpen,
      mensagem_status: config.statusMessage,
      mensagem_fechada: config.closedMessage,
      local_retirada: config.pickupLocation,
      aviso_entrega: config.deliveryNotice,
      tempo_preparo: config.prepTime,
      pin_administrador: config.adminPin || '2026',
      atualizado_em: new Date().toISOString(),
    };

    const res = await fetch(`${REST_URL}/configuracao_loja?id=eq.1`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Erro ${res.status}: ${res.statusText}`);
    }

    return { success: true };
  } catch (err) {
    console.error('Erro ao salvar configuração:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 3. Busca a lista de produtos
 */
export async function carregarProdutos() {
  if (!isSupabaseConfigured()) {
    return initialProducts;
  }

  try {
    const res = await fetch(`${REST_URL}/produtos?select=*&order=ordem.asc`, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      console.warn('Fallback para produtos locais:', res.statusText);
      return initialProducts;
    }

    const rows = await res.json();
    if (!rows || rows.length === 0) return initialProducts;

    return rows.map((item) => ({
      id: item.id,
      category: item.categoria_id,
      name: item.nome,
      description: item.descricao,
      price: parseFloat(item.preco),
      image: item.imagem_url,
      badge: item.selo,
      isAvailable: item.esta_disponivel,
      isSeasonal: item.e_sazonal,
      order: item.ordem,
      customizations: item.customizacoes || [],
    }));
  } catch (err) {
    console.error('Erro ao buscar produtos no Supabase:', err);
    return initialProducts;
  }
}

/**
 * 4. Salva ou atualiza um produto (Upsert)
 */
export async function salvarProduto(prod) {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const payload = {
      id: prod.id,
      categoria_id: prod.category,
      nome: prod.name,
      descricao: prod.description,
      preco: prod.price,
      imagem_url: prod.image,
      selo: prod.badge,
      esta_disponivel: prod.isAvailable,
      e_sazonal: !!prod.isSeasonal,
      customizacoes: prod.customizations || [],
      atualizado_em: new Date().toISOString(),
    };

    const res = await fetch(`${REST_URL}/produtos`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Erro ${res.status}: ${res.statusText}`);
    }

    return { success: true };
  } catch (err) {
    console.error('Erro ao salvar produto:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 5. Exclui um produto
 */
export async function excluirProduto(id) {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const res = await fetch(`${REST_URL}/produtos?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Erro ${res.status}: ${res.statusText}`);
    }

    return { success: true };
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 6. Faz upload de uma foto enviada do celular ou computador
 * - Comprime a imagem em WebP ultra-leve (~40-90KB)
 * - Tenta subir para o Supabase Storage (bucket 'doces')
 * - Se o bucket não existir, utiliza o DataURL comprimido com fallback instantâneo
 */
export async function fazerUploadImagem(file) {
  const compressedDataUrl = await compressImage(file);

  if (!isSupabaseConfigured()) {
    return compressedDataUrl;
  }

  try {
    const res = await fetch(compressedDataUrl);
    const blob = await res.blob();
    const fileName = `doce-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

    const uploadRes = await fetch(`${SUPABASE_BASE_URL}/storage/v1/object/doces/${fileName}`, {
      method: 'POST',
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'image/webp',
      },
      body: blob,
    });

    if (uploadRes.ok) {
      return `${SUPABASE_BASE_URL}/storage/v1/object/public/doces/${fileName}`;
    }
  } catch (err) {
    console.warn('Fallback de imagem para DataURL comprimido:', err);
  }

  return compressedDataUrl;
}
