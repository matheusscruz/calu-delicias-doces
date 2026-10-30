# 🧁 Calu Delícias Doces - Cardápio Digital & Encomendas

🇧🇷 Cardápio web mobile-first (estilo Anota.ai) com montador de doces artesanais, opções de pagamento e checkout direto para o WhatsApp Business. Desenvolvido em React + Vite + Tailwind CSS.
🇺🇸 Mobile-first digital menu & ordering web app with custom sweet builder and direct WhatsApp checkout. Built with React, Vite & Tailwind CSS.

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
