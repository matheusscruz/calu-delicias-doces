# 🧁 Calu Delícias Doces - Cardápio Digital & Encomendas

Cardápio digital mobile-first desenvolvido sob medida para a **Calu Delícias Doces**, funcionando no estilo *Anota AI / iFood próprio*, com checkout direto para o WhatsApp Business da loja (+55 21 99910-0225).

---

## ✨ Funcionalidades Principais

1. **Cardápio Interativo & Mobile-First:**
   - Visual aconchegante, clean e com as cores artesanais da confeitaria (paleta rosé, cacau e creme).
   - Categorias rápidas: *Bolos de Pote*, *Pães de Mel*, *Especiais da Semana* e *Kits & Presentes*.
   - Fotos apetitosas com selos promocionais ("Mais Pedido", "Artesanal", "Edição Limitada").

2. **Montador de Sabores & Combinações (O "Coração" do Pedido):**
   - Escolha obrigatória de **Massa** (Massa Branca de Baunilha, Massa de Chocolate Cacau 50%, etc.).
   - Escolha obrigatória de **Recheio** (Ninho c/ Nutella, Brigadeiro Belga, Doce de Leite Artesanal, etc.).
   - Adicionais opcionais com cálculo automático de acréscimo no valor.
   - Campo para observações específicas do item (ex: "Sem granulado", "Escrever Parabéns").

3. **Sacola de Pedidos & Checkout Descomplicado:**
   - Barra inferior flutuante com contagem de itens e subtotal em tempo real.
   - Coleta de dados rápida: Nome e WhatsApp com DDD.
   - **Retirada no Local** (com endereço na Tijuca/RJ) ou **Entrega / Delivery a combinar** (com campos de bairro, rua, número e referência).
   - **Formas de Pagamento:**
     - **PIX:** Exibe a chave celular `21999100225` com botão de 1 clique "Copiar Chave Pix" e aviso para anexar comprovante.
     - **Dinheiro:** Opção de calcular troco automaticamente ("Troco para quanto?").
     - **Cartão de Crédito e Débito:** Aviso de maquininha na entrega/retirada.

4. **Integração WhatsApp Business Sem Custos:**
   - Gera um payload formatado e estruturado, enviando para o link oficial `https://wa.me/5521999100225`.
   - Abre o WhatsApp no celular ou WhatsApp Web no desktop com tudo mastigado para a sua mãe apenas confirmar o pedido.

5. **Painel de Gestão Rápida da Loja (Ícone de Engrenagem):**
   - Pausar / Ativar produtos no dia (quando um doce esgotar na fornada).
   - Abrir ou Fechar a loja temporariamente.
   - Adicionar novos doces ou ofertas sazonais (Páscoa, Natal, Dia das Mães).
   - Atualizar dados de PIX e contato.
   - Salvo automaticamente no `localStorage` do navegador.

---

## 🚀 Como Executar Localmente

```bash
# Entrar no diretório do projeto
cd "C:\Users\mathe\.gemini\antigravity\scratch\calu-delicias-doces"

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse no navegador: `http://localhost:5173/`

---

## 🌐 Como Fazer Deploy Gratuito (Vercel ou Netlify)

1. Suba o código para o GitHub (pode ser repositório privado ou público).
2. Acesse [vercel.com](https://vercel.com) ou [netlify.com](https://netlify.com).
3. Importe o repositório — o build Vite é detectado automaticamente (`npm run build`).
4. Seu cardápio estará no ar em um link seguro `https://caludelicias.vercel.app` para colocar na bio do Instagram e nos grupos de WhatsApp!
