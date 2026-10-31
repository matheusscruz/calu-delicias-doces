# 🧁 Calu Delícias Doces - Cardápio Digital & Encomendas

🇧🇷 Cardápio web mobile-first (estilo Anota.ai) com montador de doces artesanais, opções de pagamento e checkout direto para o WhatsApp Business. Desenvolvido em React + Vite + Tailwind CSS e integrado ao Supabase.

🇺🇸 Mobile-first digital menu & ordering web app with custom sweet builder and direct WhatsApp checkout. Built with React, Vite, Tailwind CSS & Supabase.

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
   - **Retirada / Ponto de Entrega** (Grátis) ou **Envio via Uber Flash** (taxa paga pelo cliente).
   - **Formas de Pagamento:**
     - **PIX:** Chave Pix com botão de 1 clique "Copiar Chave Pix" e aviso para anexar comprovante.
     - **Dinheiro:** Opção de calcular troco automaticamente ("Troco para quanto?").
     - **Cartão de Crédito e Débito:** Aviso de maquininha na entrega/retirada.

4. **Integração WhatsApp Business Sem Custos:**
   - Deep link nativo (`whatsapp://send`) sem redirecionamentos web, preservando emojis perfeitamente.
   - Abre o WhatsApp com a mensagem formatada e estruturada para a loja apenas confirmar o pedido.

5. **Painel Master da Loja (Protegido por PIN):**
   - Acesso seguro via link `?admin=1` ou gesto secreto (3 toques no cupcake 🧁).
   - Validação com PIN numérico de 4 dígitos.
   - Edição de nomes, preços, fotos e descrições dos doces.
   - Upload de fotos direto da câmera/galeria com compressão WebP ou colando URL.
   - Botão rápido "Disponível / Esgotado" para fornadas do dia.
   - Cadastro de itens sazonais (Páscoa, Natal, Dia das Mães, etc.).
   - Sincronização em tempo real na nuvem via **Supabase**.

---

## 🚀 Como Executar Localmente

```bash
# Entrar no diretório
cd "calu-delicias-doces"

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse no navegador: `http://localhost:5173/`
